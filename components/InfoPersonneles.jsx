"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuthContext } from "@auth/useAuthContext";
import { useDispatch } from "@redux/store";
import { editProfile } from "@redux/slices/profile";
import { toast } from "sonner";

const InfoPersonneles = () => {
  const { user } = useAuthContext();

  const dispatch = useDispatch();
  const [values, setValues] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(editProfile(values));

      toast("Profile updated", {
        closeButton: true,
        type: "success",
      });
    } catch (error) {
      console.log("error register", error);
    }
  };
  return (
    <div className="w-full mt-6 flex justify-center items-center ">
      <div className="w-3/4 max-sm:w-full flex flex-col justify-center items-center shadow-lg p-6 rounded">
        <div className="my-2 w-full flex justify-between items-center flex-wrap">
          <p className="text-xl font-bold">Personnel informations</p>
          <Button
            // type="submit"
            className=" bg-blue-600 hover:bg-blue-700 text-white rounded "
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
        <form
          // onSubmit={handleSubmit}
          className="w-full flex gap-3 flex-col mt-6"
        >
          <div className="flex flex-row space-x-1">
            <Input
              name="firstname"
              value={values.firstname}
              onChange={handleChange}
              className="rounded p-2"
              type="text"
              placeholder="Firstname"
            />
            <Input
              name="lastname"
              value={values.lastname}
              onChange={handleChange}
              className="rounded p-2"
              type="text"
              placeholder="Lastname"
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
        </form>
      </div>
    </div>
  );
};

export default InfoPersonneles;
