"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FloatingInput, PasswordInput } from "@/components/forms";
import { login } from "@/API/auth.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/AuthProvider";
import { loginSchema } from "@/validations/auth.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: login,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    const { response, success } = await mutateAsync(data);
    if (success) {
      setUser(response.user);
      localStorage.setItem("token", response.token);
      toast.success("Login successfull");
      if (response.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (response.user.role === "TEACHEr") {
        router.push("/dashboard/teacher");
      } else if (response.user.role === "PARENT") {
        router.push("/dashboard/parent");
      }
    } else return toast.error(response as string);
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FloatingInput
              placeholder="Email Address"
              type="email"
              name="email"
              register={register}
              isError={errors.email || false}
              errorMessage={errors.email?.message}
            />
          </div>
          <div className="grid gap-2">
            <PasswordInput
              placeholder="Password"
              type="password"
              name="password"
              register={register}
              isError={errors.password || false}
              errorMessage={errors.password?.message}
            />
            <div className="flex items-center">
              <Link
                href="forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-primaryCol text-white hover:bg-primaryCol focus:ring-2 focus:ring-primaryCol focus:ring-offset-2 focus:ring-offset-bg"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
