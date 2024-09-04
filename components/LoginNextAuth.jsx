"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

function LoginNextAuth() {
  return (
    <div>
      <Button onClick={() => signIn()}>Login</Button>
    </div>
  );
}

export default LoginNextAuth;
