'use client'
import React, { useState, useEffect } from 'react'
import { api } from '@/utils/app'
import { z } from 'zod'
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
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { ExpensePayloadSchema, ActivityLogResponseSchema } from './schemas'
import { Group, SplitDetail, ActivityLog } from './interfaces'

interface AddExpenseDialogProps {
  group: Group | null
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>
}

export default function AddExpenseDialog({ group, setActivityLogs }: AddExpenseDialogProps) {
  const [openAddExpense, setOpenAddExpense] = useState(false)
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'unequal'>('equal')
  const [splits, setSplits] = useState<SplitDetail[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

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
      const activityResponse = await api.get(`/api/activitylog/group/${group?.id}/`)
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

  return (
    <Dialog open={openAddExpense} onOpenChange={setOpenAddExpense}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
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
                  {group?.members.map((member) => (
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
            {group?.members.map((member) => (
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
  )
}