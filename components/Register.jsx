"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useAuthContext } from "@auth/useAuthContext";
import Image from "next/image";
import { toast } from "sonner";
import LoadingButton from "./ui/loading-button";
import { Form } from "./ui/form";
import RHFTextField from "./hook-form/RHFTextField";

const formSchema = z.object({
  firstName: z.string().min(2, {
    firstName: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    lastName: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Register = () => {
  const { register } = useAuthContext();
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
    setLoading(true);
    try {
      const newData = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
      };
      await register(newData);
      toast("Register successfully", {
        closeButton: true,
        type: "success",
      });
      setLoading(false);
      setError(null);
    } catch (error) {
      console.log("error register", error);
      setLoading(false);
      setError(error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 w-1/2 max-sm:w-3/4 rounded space-y-2"
          style={{
            boxShadow: "2px 4px 8px 0 rgba(0, 0, 0, 8%)",
          }}
        >
          <div className="py-2 flex justify-between items-center">
            <Image src="/logo3.png" alt="loo" width={32} height={32} />
            <p className="font-semibold">We Talk</p>
          </div>
          {error && (
            <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
              {typeof error?.response?.data?.message === "string"
                ? error?.response?.data?.message
                : error?.response?.data?.message
                    .map((message) => message)
                    .join(",")}
            </span>
          )}
          <div className="flex flex-row gap-2">
            <RHFTextField name="firstName" placeholder="First Name" />

            <RHFTextField name="lastName" placeholder="Last Name" />
          </div>
          <RHFTextField name="email" placeholder="Email" />
          <RHFTextField
            name="password"
            placeholder="Password"
            type="password"
          />
          <LoadingButton
            loading={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-[45px] 2xl:h-[50px] "
          >
            Register
          </LoadingButton>{" "}
          <p className="text-center font-bold">
            Already a member !{" "}
            <Link className="text-blue-500" href="/login">
              Login
            </Link>{" "}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Register;
