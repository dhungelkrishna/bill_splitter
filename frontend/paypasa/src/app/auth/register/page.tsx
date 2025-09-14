'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SubmitHandler, useForm } from "react-hook-form"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { Axios } from "axios"
import { useRouter } from "next/navigation"
import { api } from "@/utils/app"


const RegisterFormSchema = z.object({
    firstName: z.string().min(2, "Length must need to be minimin 2 digits. ").max(50, "Can't exceed length of 50 characters. ").trim(),
    lastName: z.string().min(2, "Length must need to be minimin 2 digits. ").max(50, "Can't exceed length of 50 characters. ").trim(),
    email: z.string().email().trim(),
    phone: z.string().regex(/^98[4-9]\d{7}$/).trim(),
    password: z.string().min(4, "Passowrd minimum length 4").max(16, "Password Cannot exceed 16 length").trim(),
    cpassword: z.string().min(4, "Passowrd minimum length 4").max(16, "Password Cannot exceed 16 length").trim(),

}).refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match.",
    path: ["cpassword"],
});


type registerFormData = z.infer<typeof RegisterFormSchema>;



export default function page({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(RegisterFormSchema)
    });



    const onSubmit: SubmitHandler<registerFormData> = async (inputValues) => {
        try {

            const response = await api.post('/api/users/register/', {
                firstName: inputValues.firstName,
                lastName: inputValues.lastName,
                email: inputValues.email,
                phone: inputValues.phone,
                password: inputValues.password,
                cpassword: inputValues.cpassword,
            })
            localStorage.setItem("pending_email", inputValues.email);

            // toast.success("Verify OTP To Login to Complete Registration. ")
            console.log("Verify OTP Nonw.")
            router.push('/auth/verify-otp');
        } catch (error) {
            console.log("Registration error:", error);
            // toast.error("Passwords do not match.")
        }
    }

    return (
        <>
            <div className='flex justify-center h-screen items-center p-5 mt-2'>

                <div className={cn("flex flex-col gap-6", className)}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-1">
                            <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">Hello! Welcome</h1>
                                        <p className="text-muted-foreground text-balance">
                                            Register in Paypasa
                                        </p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-2">

                                        <div className="grid gap-3">
                                            <Label htmlFor="firstname">Enter First Name</Label>
                                            <Input
                                                id="firstname"
                                                type="text"
                                                placeholder="Samip"
                                                {...register('firstName')}
                                            />
                                            {errors.firstName && <span className="text-sm text-red-500"> {errors.firstName.message}</span>}
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="lastname">Enter Last Name</Label>
                                            <Input
                                                id="lastname"
                                                type="text"
                                                placeholder="Kharel"
                                                {...register('lastName')}
                                            />
                                            {errors.lastName && <span className="text-sm text-red-500"> {errors.lastName.message}</span>}
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email*</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            required
                                            {...register('email')}
                                        />
                                        {errors.email && <span className="text-sm text-red-500"> {errors.email.message}</span>}

                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="phone">Phone*</Label>
                                        <Input
                                            id="phone"
                                            type="number"
                                            maxLength={10}
                                            placeholder="98*********"
                                            required
                                            {...register('phone')}
                                        />
                                        {errors.phone && <span className="text-sm text-red-500"> Enter valid Nepali Phone Number</span>}

                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">Password*</Label>
                                        <Input id="password"
                                            type="password"
                                            required
                                            {...register('password')}
                                        />
                                        {errors.password && <span className="text-sm text-red-500"> {errors.password.message}</span>}

                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="cpassword">Confirm Password*</Label>
                                        <Input id="cpassword" type="password"
                                            required
                                            {...register('cpassword')}
                                        />
                                        {errors.cpassword && <span className="text-sm text-red-500"> {errors.cpassword.message} </span>}
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Register
                                    </Button>
                                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    </div>
                                    <div className="text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <Link href="login" className="underline underline-offset-4">
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        Loggin in tells you gave permissions to handle your data<a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </>
    )
}
