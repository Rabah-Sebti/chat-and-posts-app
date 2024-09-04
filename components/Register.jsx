"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { useAuthContext } from "@auth/useAuthContext";
import Image from "next/image";
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuthContext();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(values);
      toast("Register successfully", {
        closeButton: true,
        type: "success",
      });
    } catch (error) {
      console.log("error register", error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="flex p-4 w-1/2 max-sm:w-3/4 rounded gap-2 flex-col"
        style={{
          boxShadow: "2px 4px 8px 0 rgba(0, 0, 0, 8%)",
        }}
      >
        <div className="py-2 flex justify-between items-center">
          <Image src="/logo3.png" alt="loo" width={32} height={32} />
          <p className="font-semibold">We Talk</p>
        </div>
        <div className="flex flex-row gap-2">
          <Input
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            className="rounded p-2"
            type="text"
            placeholder="firstName"
          />
          <Input
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            className="rounded p-2"
            type="text"
            placeholder="lastName"
          />
        </div>
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
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded "
        >
          Register
        </Button>{" "}
        <p className="text-center font-bold">
          Already a member !{" "}
          <Link className="text-blue-500" href="/login">
            Login
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Register;
