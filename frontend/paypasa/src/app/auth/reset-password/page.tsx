'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import z from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { api } from "@/utils/app"
import { toast } from "sonner"

export const passwordSchema = z.object ({
    password : z.string().min(4, "Minimum Password length 4").max(25, "Maximum Password length 25")
})

type passwordType = z.infer<typeof passwordSchema>;


export default function page() {
    const router  = useRouter();

    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver : zodResolver(passwordSchema)
    })
    // router.push('/login')


    
        const onSubmit: SubmitHandler<passwordType> = async (inputValues) => {
            try {
    
                const response = await api.post('/api/forgot-password/', {
                    password: inputValues.password,
                })
    
                console.log("Password Reset Success")
                router.push('/auth/login/');
                toast.success("Password Reset Success.")
            } catch (error) {
                console.log("unable to reset password.:", error);
                toast.error("Enter valid password.")
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
                                    <h1 className="text-2xl font-bold">Enter New Password</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Enter Valid Password
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">New Password </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        required
                                        {...register('password')}
                                    />
                                    {errors.password && <span className="text-sm text-red-500"> {errors.password.message}</span>}
                                </div>
                                <Button type="submit" className="w-full">
                                    Submit
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
