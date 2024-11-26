"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { useAuthContext } from "@auth/useAuthContext";
import { useDispatch, useSelector } from "@redux/store";
import { editProfile, resetError } from "@redux/slices/profile";
import { toast } from "sonner";
import { Form } from "./ui/form";
import RHFTextField from "./hook-form/RHFTextField";
import LoadingButton from "./ui/loading-button";
import { X } from "lucide-react";

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "First Name is required.",
  }),
  lastname: z.string().min(2, {
    message: "Last Name is required.",
  }),
  email: z.string().email({ message: "Email is required" }),
});

const InfoPersonneles = () => {
  const { isLoading, error } = useSelector((state) => state.profile);
  const { user } = useAuthContext();

  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
    },
    values: {
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
    },
  });

  const handleResetError = () => {
    dispatch(resetError());
  };
  const onSubmit = async (data) => {
    try {
      dispatch(editProfile(data)).then((status) => {
        if (status === 200) {
          toast("Profile updated", {
            closeButton: true,
            type: "success",
          });
        }
      });
    } catch (error) {
      console.log("error register", error);
    }
  };
  return (
    <div className="w-full mt-6 flex justify-center items-center ">
      <div className="w-3/4 max-sm:w-full flex flex-col justify-center items-center shadow-lg p-6 rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="my-2 w-full flex justify-between items-center flex-wrap">
              <p className="text-xl font-bold">Personnel informations</p>
              <LoadingButton
                type="submit"
                loading={isLoading}
                className="default_btn"
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
            <div className="w-full flex gap-3 flex-col mt-6">
              <div className="flex flex-row space-x-1">
                <RHFTextField name="firstname" placeholder="First Name" />
                <RHFTextField name="lastname" placeholder="Last Name" />
              </div>
              <RHFTextField name="email" placeholder="Email" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InfoPersonneles;
