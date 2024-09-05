"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useAuthContext } from "@auth/useAuthContext";
import Image from "next/image";
import LoadingButton from "./ui/loading-button";
import { toast } from "sonner";
import { Form } from "./ui/form";
import RHFTextField from "./hook-form/RHFTextField";

const formSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Login = () => {
  const { login } = useAuthContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast("Login successfully", {
        closeButton: true,
        type: "success",
      });
      setLoading(false);
      setError(null);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log("error login", error);
    }
  };
  return (
    <div className="flex flex-col w-full items-center justify-center h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 w-1/2 max-sm:w-3/4 rounded space-y-2"
          style={{
            boxShadow: "2px 4px 8px 0 rgba(0, 0, 0, 8%)",
          }}
        >
          <div className="py-2 flex justify-between items-center">
            <Image src="/logo3.png" alt="logo" width={36} height={36} />
            <p className="font-semibold">We Talk</p>
          </div>
          {error && (
            <p className="p-4 my-2 text-lg font-semibold text-white bg-red-500 rounded-md">
              {error?.response
                ? typeof error?.response?.data?.message === "string"
                  ? error?.response?.data?.message
                  : error?.response?.data?.message
                      .map((message) => message)
                      .join(",")
                : "Something went wrong try later"}
            </p>
          )}

          <RHFTextField name="email" placeholder="Email" />
          <RHFTextField
            name="password"
            placeholder="Password"
            type="password"
          />
          <LoadingButton
            loading={loading}
            type="submit"
            className="w-full  bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-[45px] 2xl:h-[50px] "
          >
            Login
          </LoadingButton>
          <p className="text-center font-bold">
            Don&apos;t have account{" "}
            <Link className="text-blue-500" href="/register">
              Register
            </Link>{" "}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Login;
