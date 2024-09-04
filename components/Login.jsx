"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import { useAuthContext } from "@auth/useAuthContext";
import Image from "next/image";
import LoadingButton from "./ui/loading-button";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuthContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(values.email, values.password);
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-4 w-1/2 max-sm:w-3/4 rounded"
        style={{
          boxShadow: "2px 4px 8px 0 rgba(0, 0, 0, 8%)",
        }}
      >
        <div className="py-2 flex justify-between items-center">
          <Image src="/logo3.png" alt="logo" width={36} height={36} />
          <p className="font-semibold">We Talk</p>
        </div>
        {error && (
          <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
            {error?.response?.data?.message}
          </span>
        )}
        <Input
          name="email"
          value={values.email}
          onChange={handleChange}
          className="rounded p-2"
          type="email"
          placeholder="Email"
        />
        <Input
          name="password"
          value={values.password}
          onChange={handleChange}
          className="rounded p-2"
          type="password"
          placeholder="Password"
        />
        <LoadingButton
          loading={loading}
          type="submit"
          className="w-full  bg-blue-500 hover:bg-blue-600 text-white rounded "
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
    </div>
  );
};

export default Login;
