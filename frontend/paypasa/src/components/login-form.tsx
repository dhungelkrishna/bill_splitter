'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Cookies from 'js-cookie'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/app"
import { toast } from "sonner"




const loginFormSchema = z.object({
  email: z.string().email().min(3, "Email is Required. "),
  password: z.string().min(4, "Password length not matched. ")



})

type LoginFormInputs = {
  email: string;
  password: string;
};

export const handleLogout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token')
}


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const router = useRouter()
  useEffect(() => {
    const accessToken = Cookies.get("access_token")
    if (accessToken) {
      router.replace("/dashboard")
    } else {
      console.log("access token vetiyena. login xaina. ")
    }
  }, [])


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (inputValues) => {
    async function postData() {
      try {

        const response = await api.post(`/api/login/`, {
          email: inputValues.email,
          password: inputValues.password
        });


        Cookies.set("access_token", response.data.access, { secure: false, sameSite: 'strict', path: "/" });
        Cookies.set("refresh_token", response.data.refresh, { secure: false, sameSite: 'strict', path: "/" });

        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }


    }

    await postData();
    try {
      const access_token = Cookies.get("access_token");
      if (access_token) {
        router.push('/dashboard/')
        toast.success("Login Success. ")
      } else {
        toast.error("LLogin Failed Try again. ")
      }
    } catch (e) {
      router.push('/error');
    }

  };


  return (
    <div className={cn("flex flex-col gap-6", className)} >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)} >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Paypasa account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}

                />
                {errors.email && <p> <span className="text-sm text-red-500">{errors.email.message} </span></p>}

              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && <p> <span className="text-sm text-red-500">{errors.password.message}</span></p>}

              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.pexels.com/photos/4386368/pexels-photo-4386368.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
