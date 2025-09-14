'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { api } from "@/utils/app"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export const otpSchema = z.object({
    otp: z.string().min(4, "OTp of 4 digits").max(4, "OTP of 4 digits")
})

type OTPtype = z.infer<typeof otpSchema>;

export default function page() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(otpSchema)

    })


    const onSubmit: SubmitHandler<OTPtype> = async (inputValues) => {
        try {
            const email = localStorage.getItem("pending_email")
            if (!email) {
                console.log("No email found in localStorage.")
                // You could redirect user back to registration page
                router.push("/auth/register")
                return
            }

            const response = await api.post('/api/verify-otp/', {
                email,
                otp: inputValues.otp,
            })

            // toast.success("Verify OTP To Login to Complete Registration. ")
            console.log("You're ready to login")
            localStorage.removeItem("pending_email") // cleanup
            router.push('/auth/login');
        } catch (error) {
            console.log("OTP Verification Error:", error);
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
                                        <h1 className="text-2xl font-bold">Enter OTP </h1>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Enter OTP </Label>
                                        <Input
                                            id="otp"
                                            type="number"
                                            {...register('otp')}
                                        />
                                        {errors.otp && <span className="text-sm text-red-500"> {errors.otp.message}</span>}


                                    </div>
                                    <Button type="submit" className="w-full">
                                        Verify
                                    </Button>
                                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    </div>
                                    <div className="text-center text-sm">
                                        <Link href="login" className="underline underline-offset-4">
                                            Return Back
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
