'use client'
import Navbar04Page from '@/components/navbar-04/navbar-04'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GroupCard from '@/components/groupcard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TypographyH1 } from '@/components/ui/typography'

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import Link from 'next/link'



export const description = "A bar chart"

const dashboard = () => {
  const router = useRouter();


  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig



  const CreateGroupPage = () => {
    router.push('/dashboard/creategroup')
  }

  return (
    <>
      <Navbar04Page />

      <main>

        <div className="actionbuttons text-center grid grid-cols-3 justify-center items-center gap-6 mx-60 sm:grid-cols-3 md:m-6 sm:m-2">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full cursor-pointer md:px-20"
                >
                  Add Expenses
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Title</Label>
                    <Input id="name-1" name="name" defaultValue="on Title : momo" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price">Total Price</Label>
                    <Input id="price" name="price" defaultValue="price" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="members">Members</Label>
                    <Input id="members" name="member" type="text" />
                  </div>
                  <div className="grid gap-3 grid-cols-3">
                    <Button>Equally</Button>
                    <Button>Unequally</Button>
                    <Button>Percentage</Button>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full cursor-pointer md:px-20"
                >
                  Make Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Make Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <Label>Select Gruoup</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Cloco Fellows</SelectItem>
                      <SelectItem value="dark">College Friends</SelectItem>
                      <SelectItem value="system">Gym Friends </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  <Label>Select Member</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Bikal</SelectItem>
                      <SelectItem value="dark">Manish</SelectItem>
                      <SelectItem value="system">babin </SelectItem>
                    </SelectContent>
                  </Select>
                </div>



                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full cursor-pointer md:px-20"
                >
                  Get Balance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Get Balance</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  {/* body of expense functionality.  */}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>

        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          <Link href={'/groups'}>
            Groups
          </Link>
        </h1>

        <button onClick={CreateGroupPage} className='border border-2 px-10 py-4 rounded m-5'> Create Group </button>
        <div className="group-holder m-20 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2 mt-2">
          {/* show group details here.  */}
          <GroupCard groupName="Fellowship Friends" members={["Alice", "Bob", "Charlie", "Dave"]} balance={150.75} />
          <GroupCard groupName="College Guys" members={["Eve", "Frank"]} balance={-50.20} />
        </div>

        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">Group Expese History</h1>
        <div className="group-holder m-20 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2 mt-2">

          <div className="chart1">



            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>



          </div>
          <div className="chart2">


          </div>

        </div>

        {/* <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">Activity Log </h1> */}

      </main>

    </>
  )
}
export default dashboard

