'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { api } from "@/utils/app"
import { toast } from "sonner"

const emailSchema = z.object ({
    email : z.string().email()
})

type emailType = z.infer<typeof emailSchema>;


export default function page() {
    const router = useRouter()

    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver : zodResolver(emailSchema)
    })

    

    const onSubmit: SubmitHandler<emailType> = async (inputValues) => {
        try {

            const response = await api.post('/api/forgot-password/', {
                email: inputValues.email,
            })

            // toast.success("Verify OTP To Login to Complete Registration. ")
            console.log("Check email")
            router.push('/');
            toast.success("Check your email.")
        } catch (error) {
            console.log("Email not found.:", error);
            toast.error("Passwords do not match.")
        }
    }



    return (
        <>
    <div className='flex justify-center h-screen items-center'>


            <div className={cn("flex flex-col gap-6")}>
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-1">
                        <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Paypasa Forget Password</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Reset your Password
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Enter your Email </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        required
                                        {...register('email')}
                                    />
                                    {errors.email && <span className="text-sm text-red-500"> {errors.email.message}</span>}
                                </div>
                                <Button type="submit" className="w-full">
                                    Send Reset Mail
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                </div>
                                <div className="text-center text-sm">
                                    <Link href="login" className="underline underline-offset-4">
                                        Return to Login Page
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            </div>

        </>
    )
}
