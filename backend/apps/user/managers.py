from django.contrib.auth.base_user import BaseUserManager
class CustomManager(BaseUserManager):
    def create_user(self, email, password, **details):
        if not email:
            raise ValueError("Email is required. ")
        email = self.normalize_email(email)
        user = self.model(email = email, **details)
        user.set_password(password)

        user.save()
        return user

    def create_superuser(self, email, password, **details):
        # details.setdefault('role', Role.ADMIN)
        details.setdefault('is_staff',True)
        details.setdefault('is_superuser', True)
        details.setdefault('is_active',True)
        return self.create_user(email, password, **details)
