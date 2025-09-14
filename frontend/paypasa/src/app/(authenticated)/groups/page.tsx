'use client'

import { api } from '@/utils/app'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import Link from 'next/link' // Import Link for navigation
import Image from 'next/image'

interface Group {
  id: string
  custom_user: string
  name: string
  created_at: string
  avatar: string | null
  created_by: string
}

const GroupCard = ({
  group,
  onDelete,
  onUpdate,
  onInvite,
}: {
  group: Group
  onDelete: (id: string) => void
  onUpdate: (id: string, newName: string) => void
  onInvite: (groupId: string, email: string) => void
}) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [editedName, setEditedName] = useState(group.name)
  const [openInvite, setOpenInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleUpdate = async () => {
    try {
      const response = await api.patch(`/api/groups/${group.id}/`, { name: editedName })
      onUpdate(group.id, response.data.name)
      setOpenEdit(false)
    } catch (err) {
      console.error('Failed to update group:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/groups/${group.id}/`)
      onDelete(group.id)
    } catch (err) {
      console.error('Failed to delete group:', err)
    }
  }

  const handleInvite = async () => {
    try {
      // Pass the groupId and email up to the parent component
      onInvite(group.id, inviteEmail)
      setOpenInvite(false)
      setInviteEmail('') // Clear the input
    } catch (err) {
      console.error('Failed to send invitation:', err)
    }
  }

  return (
    <Card>
      <Link href={`/groups/${group.id}`} passHref>
        <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center space-x-4">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}

                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {group.name.charAt(0).toUpperCase()}
              </div>
            )}
            <CardTitle>{group.name}</CardTitle>
          </div>
        </CardHeader>
      </Link>
      <CardContent>
        <p className="text-sm text-muted-foreground">Created by: {group.custom_user}</p>
        <p className="text-sm text-muted-foreground">
          Created at: {new Date(group.created_at).toLocaleDateString()}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Update Dialog */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button variant="outline">Update</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Group</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdate}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Invite Member Dialog */}
          <Dialog open={openInvite} onOpenChange={setOpenInvite}>
            <DialogTrigger asChild>
              <Button variant="outline">Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Member to {group.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter user's email"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the group.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const groupsRes = await api.get('/api/groups/')
        const groupsData = Array.isArray(groupsRes.data.results) ? groupsRes.data.results : []
        setGroups(groupsData)
      } catch (err) {
        console.error('Failed to fetch groups:', err)
        setError('Failed to fetch groups')
        setGroups([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id))
  }

  const handleUpdate = (id: string, newName: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: newName } : g))
    )
  }

  const handleInvite = async (groupId: string, email: string) => {
    try {
      // This is the API call to send the invitation
      await api.post(`/api/groups/${groupId}/invite/`, { email })
      alert(`Invitation sent to ${email} for group ${groupId}!`)
    } catch (err) {
      console.error('Failed to send invitation:', err)
      alert('Failed to send invitation. Please try again.')
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Group Listing</h1>
      {groups.length === 0 ? (
        <div className="text-center text-muted-foreground">No groups available.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onInvite={handleInvite}
            />
          ))}
        </div>
      )}
    </div>
  )
}