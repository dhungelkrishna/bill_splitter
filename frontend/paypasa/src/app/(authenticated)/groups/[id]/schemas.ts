import { z } from 'zod'

export const CustomUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  date_joined: z.string().optional(),
  avatar: z.string().url().nullable(),
})

export const GroupUserSchema = z.object({
  id: z.string().uuid(),
  custom_user: CustomUserSchema,
  joined_at: z.string(),
  user: z.string(),
  group: z.string(),
})

export const GroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Group name is required'),
  custom_user: z.string(),
  created_at: z.string(),
  avatar: z.string().url().nullable(),
  created_by: z.string(),
  members: z.array(GroupUserSchema),
})

export const ActivityLogSchema = z.object({
  id: z.string().uuid(),
  user: z.string(),
  user_name: z.string().nullable(),
  entity_type: z.string(),
  object_id: z.string(),
  action_type: z.string(),
  action_type_display: z.string(),
  description: z.string(),
  timestamp: z.string(),
})

export const ActivityLogResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ActivityLogSchema),
})

export const ExpensePayloadSchema = z.object({
  title: z.string().min(1, 'Expense title is required'),
  group: z.string().uuid('Invalid group ID'),
  paid_by: z.string().email('Invalid payer email'),
  total_amount: z.number().positive('Total amount must be positive'),
  splits_details: z.array(
    z.object({
      user: z.string().email('Invalid user email'),
      split_type: z.enum(['equal', 'percentage', 'unequal']),
      share_value: z.number().nonnegative().optional(),
    })
  ).min(1, 'At least one participant is required'),
}).refine(
  (data) => {
    if (data.split_type === 'percentage') {
      const totalPercentage = data.splits_details.reduce((sum, split) => sum + (split.share_value || 0), 0)
      return Math.abs(totalPercentage - 100) <= 0.01
    }
    return true
  },
  { message: 'Percentages must sum to 100%', path: ['splits_details'] }
).refine(
  (data) => {
    if (data.split_type === 'unequal') {
      const totalShares = data.splits_details.reduce((sum, split) => sum + (split.share_value || 0), 0)
      return Math.abs(totalShares - data.total_amount) <= 0.01
    }
    return true
  },
  { message: 'Unequal shares must sum to the total amount', path: ['splits_details'] }
)

export const PaymentPayloadSchema = z.object({
  group: z.string().uuid('Invalid group ID'),
  to_email: z.string().email('Invalid recipient email'),
  amount: z.number().positive('Payment amount must be positive'),
})