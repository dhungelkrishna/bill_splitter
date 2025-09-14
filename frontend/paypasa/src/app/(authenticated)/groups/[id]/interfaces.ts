
export interface CustomUser {
  id: string
  email: string
  first_name: string
  last_name?: string
  phone?: string
  date_joined?: string
  avatar?: string | null
}

export interface GroupUser {
  id: string
  custom_user: CustomUser
  joined_at: string
  user: string
  group: string
}

export interface Group {
  id: string
  name: string
  custom_user: string
  created_at: string
  avatar: string | null
  created_by: string
  members: GroupUser[]
}

export interface SplitDetail {
  user: string
  split_type: 'equal' | 'percentage' | 'unequal'
  share_value?: number
}

export interface ActivityLog {
  id: string
  user: string
  user_name: string | null
  entity_type: string
  object_id: string
  action_type: string
  action_type_display: string
  description: string
  timestamp: string
}