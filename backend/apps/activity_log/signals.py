from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import ActivityLog
from .models import Group
from .models import Expense, Payment, Balance
# activity_log/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import ActivityLog, ActionType
from apps.group.models import Group  # Make sure this import path is correct for your Group model

# --- Group Signals ---

@receiver(post_save, sender=Group)
def log_group_activity(sender, instance, created, **kwargs):
    # For creation, it's typically 'created_by'. For updates, 'updated_by' is ideal,
    user = getattr(instance, 'updated_by', None) # Try to get updated_by first
    if not user: # If updated_by is not set or doesn't exist, fall back to created_by
        user = getattr(instance, 'created_by', None)

    if created:
        action = ActionType.CREATE
        description = f"User {user.email if user else 'Unknown'} created the group '{instance.name}'."
    else:
        action = ActionType.UPDATE
        description = f"User {user.email if user else 'Unknown'} updated the group '{instance.name}'."
        
    ActivityLog.objects.create(
        user=user, # This could be None if the user couldn't be determined
        content_object=instance,
        action_type=action,
        description=description,
    )

@receiver(post_delete, sender=Group)
def log_group_deletion(sender, instance, **kwargs):
    """
    Logs activity when a Group object is deleted.
    For deletions, getting the performing user can be tricky as the object
    and its relationships might be gone. We'll use the 'created_by' user if available.
    """
    user_for_log = getattr(instance, 'created_by', None) # Get the creator if still available
    description = f"Group '{instance.name}' was deleted."
    
    ActivityLog.objects.create(
        user=user_for_log, # This might be None
        content_object=instance, # The content_object will point to the deleted instance's ID
        action_type=ActionType.DELETE,
        description=description
    )

@receiver(post_save, sender=Expense)
def log_expense_activity(sender, instance, created, **kwargs):
    """
    Logs activity when an Expense object is created or updated.
    Assumes the Expense model has a 'paid_by' field.
    """
    # The user who performed the action is available via the 'paid_by' field
    user = instance.paid_by
    group = instance.group

    if created:
        action = ActionType.CREATE
        description = f"User {user.email} created an expense '{instance.title}' of Rs. {instance.total_amount} in group '{group.name}'."
    else:
        action = ActionType.UPDATE
        description = f"User {user.email} updated an expense '{instance.title}' of Rs. {instance.total_amount} in group '{group.name}'."
    
    ActivityLog.objects.create(
        user=user,
        content_object=instance,
        action_type=action,
        description=description,
    )

@receiver(post_delete, sender=Expense)
def log_expense_deletion(sender, instance, **kwargs):
    """
    Logs activity when an Expense object is deleted.
    """
    user_for_log = getattr(instance, 'paid_by', None)
    group_name = instance.group.name if instance.group else 'unknown group'
    description = f"An expense '{instance.title}' of Rs. {instance.total_amount} was deleted from group '{group_name}'."
    
    ActivityLog.objects.create(
        user=user_for_log,
        content_object=instance,
        action_type=ActionType.DELETE,
        description=description
    )
