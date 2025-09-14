'use client'
import { api } from '@/utils/app'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'
import { CustomUserSchema, GroupUserSchema, GroupSchema, ActivityLogSchema, ActivityLogResponseSchema, ExpensePayloadSchema, PaymentPayloadSchema } from './schemas'
import {CustomUser, GroupUser, Group, SplitDetail, ActivityLog} from './interfaces'


export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  // State for Add Expense Dialog
  const [openAddExpense, setOpenAddExpense] = useState(false)
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'unequal'>('equal')
  const [splits, setSplits] = useState<SplitDetail[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  // State for Add Payment Dialog
  const [openAddPayment, setOpenAddPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentToEmail, setPaymentToEmail] = useState('')

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    async function fetchGroupDetails() {
      if (!id) return
      try {
        const groupResponse = await api.get(`/api/groups/${id}`)
        const groupResult = GroupSchema.safeParse(groupResponse.data)
        if (!groupResult.success) {
          console.error('Group validation error:', groupResult.error.format())
          throw new Error('Invalid group data received')
        }
        setGroup(groupResult.data)

        const activityResponse = await api.get(`/api/activitylog/group/${id}/`)
        const activityResult = ActivityLogResponseSchema.safeParse(activityResponse.data)
        if (!activityResult.success) {
          console.error('Activity log validation error:', activityResult.error.format())
          throw new Error('Invalid activity log data received')
        }
        const sortedLogs = activityResult.data.results.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setActivityLogs(sortedLogs)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to fetch group or activity details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchGroupDetails()
    }
  }, [id])

  useEffect(() => {
    if (openAddExpense && selectedMembers.length > 0) {
      const newSplits = selectedMembers.map((email) => ({
        user: email,
        split_type: splitType,
        share_value: splitType === 'equal' ? undefined : 0,
      }))
      setSplits(newSplits)
    } else {
      setSplits([])
    }
  }, [openAddExpense, selectedMembers, splitType])

  const handleMemberToggle = (email: string) => {
    setSelectedMembers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    )
  }

  const handleSplitTypeChange = (value: 'equal' | 'percentage' | 'unequal') => {
    setSplitType(value)
    setSplits((prevSplits) =>
      prevSplits.map((split) => ({
        ...split,
        split_type: value,
        share_value: value === 'equal' ? undefined : split.share_value || 0,
      }))
    )
  }

  const handleSplitValueChange = (email: string, value: string) => {
    setSplits((prevSplits) =>
      prevSplits.map((split) =>
        split.user === email ? { ...split, share_value: parseFloat(value) || 0 } : split
      )
    )
  }

  const handleAddExpense = async () => {
    setValidationErrors({})
    const payload = {
      title: expenseTitle,
      group: group?.id,
      paid_by: paidBy,
      total_amount: parseFloat(expenseAmount) || 0,
      splits_details: splits.map((split) => ({
        user: split.user,
        split_type: split.split_type,
        ...(split.split_type !== 'equal' && { share_value: split.share_value }),
      })),
    }

    const result = ExpensePayloadSchema.safeParse(payload)
    if (!result.success) {
      const errors: { [key: string]: string } = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })
      setValidationErrors(errors)
      toast.error('Please fix the following errors:\n' + Object.values(errors).join('\n'))
      return
    }

    try {
      await api.post('/api/expenses/', payload)
      toast.success(`Expense "${expenseTitle}" added successfully!`)
      setOpenAddExpense(false)
      setExpenseTitle('')
      setExpenseAmount('')
      setPaidBy('')
      setSplitType('equal')
      setSelectedMembers([])
      setSplits([])
      const activityResponse = await api.get(`/api/activitylog/group/${id}/`)
      const activityResult = ActivityLogResponseSchema.safeParse(activityResponse.data)
      if (!activityResult.success) {
        console.error('Activity log validation error:', activityResult.error.format())
        throw new Error('Invalid activity log data received')
      }
      const sortedLogs = activityResult.data.results.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setActivityLogs(sortedLogs)
    } catch (err) {
      console.error('Failed to add expense:', err)
      toast.error('Failed to add expense. Please try again.')
    }
  }

  const handleAddPayment = async () => {
    setValidationErrors({})
    const payload = {
      group: group?.id,
      to_email: paymentToEmail,
      amount: parseFloat(paymentAmount) || 0,
    }

    const result = PaymentPayloadSchema.safeParse(payload)
    if (!result.success) {
      const errors: { [key: string]: string } = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })
      setValidationErrors(errors)
      toast.error('Please fix the following errors:\n' + Object.values(errors).join('\n'))
      return
    }

    try {
      await api.post('/api/payments/', payload)
      toast.success(`Payment of Rs. ${paymentAmount} sent to ${paymentToEmail}`)
      setOpenAddPayment(false)
      setPaymentAmount('')
      setPaymentToEmail('')
      const activityResponse = await api.get(`/api/activitylog/group/${id}/`)
      const activityResult = ActivityLogResponseSchema.safeParse(activityResponse.data)
      if (!activityResult.success) {
        console.error('Activity log validation error:', activityResult.error.format())
        throw new Error('Invalid activity log data received')
      }
      const sortedLogs = activityResult.data.results.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setActivityLogs(sortedLogs)
    } catch (err) {
      console.error('Failed to add payment:', err)
      toast.error('Failed to add payment. Please try again.')
    }
  }

  const formatDescription = (log: ActivityLog) => {
    if (log.action_type !== 'CREATE' || log.entity_type !== 'expense') {
      return `${log.description} (${new Date(log.timestamp).toLocaleString()})`
    }
    const regex = /User (\S+) created an expense '([^']+)' of (Rs\. \d+\.\d{2})/
    const match = log.description.match(regex)
    if (match) {
      const [, user, title, price] = match
      return `${user} created expense ${title} ${price} (${new Date(log.timestamp).toLocaleString()})`
    }
    return `${log.description} (${new Date(log.timestamp).toLocaleString()})`
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading group details...</div>
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>
  if (!group) return <div className="text-center py-10 text-muted-foreground">Group not found.</div>

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 pb-4 border-b">
          <div className="flex items-center space-x-4">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-3xl font-bold shadow-md">
                {group.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{group.name}</CardTitle>
              <p className="text-md text-gray-600 dark:text-gray-400">Created by: {group.custom_user}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Created at: {new Date(group.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={openAddExpense} onOpenChange={setOpenAddExpense}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-transitionmd -colors duration-200">
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expense-title" className="text-right">Title</Label>
                    <div className="col-span-3">
                      <Input
                        id="expense-title"
                        value={expenseTitle}
                        onChange={(e) => setExpenseTitle(e.target.value)}
                        className="w-full"
                        placeholder="e.g., Dinner, Movie Tickets"
                      />
                      {validationErrors['title'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['title']}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expense-amount" className="text-right">Total Amount</Label>
                    <div className="col-span-3">
                      <Input
                        id="expense-amount"
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="w-full"
                        placeholder="e.g., 500"
                      />
                      {validationErrors['total_amount'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['total_amount']}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paid-by" className="text-right">Paid By</Label>
                    <div className="col-span-3">
                      <Select value={paidBy} onValueChange={setPaidBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payer" />
                        </SelectTrigger>
                        <SelectContent>
                          {group.members.map((member) => (
                            <SelectItem key={member.custom_user.email} value={member.custom_user.email}>
                              {member.custom_user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors['paid_by'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['paid_by']}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <Label>Select Participants</Label>
                    {group.members.map((member) => (
                      <div key={member.custom_user.email} className="flex items-center gap-2">
                        <Checkbox
                          id={`member-${member.custom_user.email}`}
                          checked={selectedMembers.includes(member.custom_user.email)}
                          onCheckedChange={() => handleMemberToggle(member.custom_user.email)}
                        />
                        <Label htmlFor={`member-${member.custom_user.email}`}>
                          {member.custom_user.email}
                        </Label>
                      </div>
                    ))}
                    {validationErrors['splits_details'] && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors['splits_details']}</p>
                    )}
                  </div>
                  {selectedMembers.length > 0 && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="split-type" className="text-right">Split Type</Label>
                      <Select value={splitType} onValueChange={handleSplitTypeChange}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select split type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equal">Equal</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="unequal">Unequal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {splitType !== 'equal' && selectedMembers.length > 0 && (
                    <div className="grid gap-4">
                      <Label>Split Details</Label>
                      {splits.map((split, index) => (
                        <div key={split.user} className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">{split.user}</Label>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              value={split.share_value || ''}
                              onChange={(e) => handleSplitValueChange(split.user, e.target.value)}
                              className="w-full"
                              placeholder={splitType === 'percentage' ? 'e.g., 25' : 'e.g., 100'}
                            />
                            {validationErrors[`splits_details.${index}.share_value`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {validationErrors[`splits_details.${index}.share_value`]}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddExpense}>Save Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={openAddPayment} onOpenChange={setOpenAddPayment}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="payment-to" className="text-right">To Email</Label>
                    <div className="col-span-3">
                      <Input
                        id="payment-to"
                        type="email"
                        value={paymentToEmail}
                        onChange={(e) => setPaymentToEmail(e.target.value)}
                        className="w-full"
                        placeholder="e.g., member@example.com"
                      />
                      {validationErrors['to_email'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['to_email']}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="payment-amount" className="text-right">Amount</Label>
                    <div className="col-span-3">
                      <Input
                        id="payment-amount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full"
                        placeholder="e.g., 250"
                      />
                      {validationErrors['amount'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['amount']}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddPayment}>Record Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Group Members ({group.members.length})
          </h2>
          {group.members.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {group.members.map((member) => (
                <li key={member.custom_user.id} className="text-sm font-bold">
                  {member.custom_user.email} (Joined: {new Date(member.joined_at).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No members in this group yet.</p>
          )}
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Group Activities ({activityLogs.length})
          </h2>
          {activityLogs.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {activityLogs.map((log) => (
                <li key={log.id} className="text-sm">
                  {formatDescription(log)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No activity logs available for this group.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}