"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "@redux/store";
import { editPassword, editProfile, resetError } from "@redux/slices/profile";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Form } from "./ui/form";
import LoadingButton from "./ui/loading-button";
import RHFTextField from "./hook-form/RHFTextField";

const formSchema = z
  .object({
    oldPassword: z.string().min(2, {
      message: "Current Password is required.",
    }),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one capital letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[_,\-/#@*]/,
        "Password must contain at least one special character (_,-,/,#,@)"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password doesn't match",
    path: ["confirmNewPassword"],
  });

const EditPassword = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.profile);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const handleResetError = () => {
    dispatch(resetError());
  };
  const onSubmit = async (data) => {
    try {
      const newData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      dispatch(editPassword(newData)).then((status) => {
        if (status === 200) {
          toast("Password updated", {
            closeButton: true,
            type: "success",
          });
          form.reset();
        }
      });
    } catch (error) {
      console.log("error register", error);
    }
  };
  return (
    <div className="flex justify-center items-center w-full mt-6">
      <div className="w-3/4 max-sm:w-full flex flex-col justify-center items-center shadow-lg p-6 rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="my-2 w-full flex justify-between items-center flex-wrap">
              <p className="text-xl font-bold">Edit Password</p>
              <LoadingButton
                type="submit"
                loading={isLoading}
                className=" bg-blue-600 hover:bg-blue-700 text-white rounded "
                // onClick={handleSubmit}
              >
                Update
              </LoadingButton>
            </div>

            {error && (
              <div className="relative my-2 p-4 mb-2 w-full text-lg font-semibold text-white bg-red-500 rounded-md">
                <p className="">
                  {" "}
                  {typeof error?.response?.data?.message === "string"
                    ? error?.response?.data?.message
                    : error?.response?.data?.message
                        .map((message) => message)
                        .join(",")}
                </p>
                <Button
                  type="button"
                  className="w-6 h-6 p-0 bg-white hover:bg-gray-100 absolute top-1 right-1 rounded-full text-black"
                  onClick={handleResetError}
                >
                  <X size={12} />
                </Button>
              </div>
            )}
            <div className="flex mt-6 w-full gap-3 flex-col">
              <RHFTextField
                name="oldPassword"
                placeholder="Current Password"
                isPassword
              />
              <RHFTextField
                name="newPassword"
                placeholder="New Password"
                isPassword
              />
              <RHFTextField
                name="confirmNewPassword"
                placeholder="Confirmation Password"
                isPassword
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditPassword;
