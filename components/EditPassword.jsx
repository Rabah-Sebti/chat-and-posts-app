"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch } from "@redux/store";
import { editPassword, editProfile } from "@redux/slices/profile";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const EditPassword = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };
      dispatch(editPassword(newData));

      toast("Password updated ", {
        closeButton: true,
        type: "success",
      });
    } catch (error) {
      console.log("error register", error);
    }
  };
  return (
    <div className="flex justify-center items-center w-full mt-6">
      <div className="w-3/4 max-sm:w-full flex flex-col justify-center items-center shadow-lg p-6 rounded">
        <div className="my-2 w-full flex justify-between items-center flex-wrap">
          <p className="text-xl font-bold">Edit Password</p>
          <Button
            // type="submit"
            className=" bg-blue-600 hover:bg-blue-700 text-white rounded "
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
        <form className="flex mt-6 w-full gap-3 flex-col">
          <div className="relative flex items-center justify-start">
            <div
              className="flex flex-row items-center absolute right-4 cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff /> : <Eye />}
            </div>
            <Input
              className="w-full pr-12"
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={values.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
            />
          </div>

          <div className="relative flex items-center justify-start">
            <div
              className="flex flex-row items-center absolute right-4 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </div>
            <Input
              className="w-full pr-12"
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={values.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
          </div>
          <div className="relative flex items-center justify-start">
            <div
              className="flex flex-row items-center absolute right-4 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </div>
            <Input
              className="w-full pr-12"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={values.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;
