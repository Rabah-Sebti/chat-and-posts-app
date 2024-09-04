"use client";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { NavVertival } from "./NavVertical";
import { useAuthContext } from "@auth/useAuthContext";
// import Icon from "./icon/Icon";
import { useDispatch } from "@redux/store";
import { Pencil, Settings } from "lucide-react";
import Icon from "./icon/Icon";

const navConfig = [
  {
    items: [
      {
        title: "Profile",
        icon: "User",
        children: [
          {
            title: "Posts",
            icon: "WalletCards",
            path: "/",

            step: 0,
          },
        ],
      },
      {
        title: "Paramètres du profil",
        icon: "User",
        children: [
          {
            title: "Informations personnelles",
            icon: "User",
            path: "/",
            step: 1,
          },

          {
            title: "Modifier le password",
            icon: "KeyRound",
            path: "/",

            step: 2,
          },
        ],
      },
      {
        title: "Générale",
        icon: "User",
        children: [],
      },
    ],
  },
];

export default function ProfileSettingsDrawer({ setActiveStep }) {
  const [openSheet, setOpenSheet] = useState(false);
  const dispatch = useDispatch();
  const handleChangeOpenSheet = () => {
    setOpenSheet(!openSheet);
  };

  const handleSelectTab = (step) => {
    setActiveStep(step);
    setOpenSheet(false);
  };
  const { user, updatePicture } = useAuthContext();
  const fileInputRef = useRef(null);
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const base64 = await convertToBase64(selectedFile);
    const formData = {
      picture: base64,
    };
    try {
      updatePicture(formData);
    } catch (error) {
      console.log("error update picture", error);
    }
  };
  return (
    <>
      <Sheet open={openSheet} onOpenChange={handleChangeOpenSheet}>
        <SheetTrigger onClick={handleChangeOpenSheet}>
          <div className="w-[36px] h-[36px] bg-slate-200 hover:bg-slate-300 rounded-full flex justify-center items-center cursor-pointer">
            <Icon name="Settings" />
            {/* <Settings /> */}
          </div>
        </SheetTrigger>
        <SheetContent className="bg-white" style={{ zIndex: 999 }} side="right">
          <SheetHeader>
            <SheetDescription>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".jpeg, .png, .jpg"
              />
              <div className="my-2 items-center flex flex-col gap-2 place-content-center">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={user?.picture || "/user.png"}
                      alt="Profile"
                    />
                    <AvatarFallback>Profile</AvatarFallback>
                  </Avatar>
                  <div
                    onClick={handleIconClick}
                    className="absolute top-0 left-7 w-[22px] flex items-center justify-center p-1 h-[22px] rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer"
                  >
                    <Pencil color="red" size={16} />
                  </div>
                </div>
                <div className="mx-2">
                  <p className="font-bold text-center">{user?.firstname}</p>
                  <p className="font-bold text-xs text-center text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
          <div className="">
            <NavVertival data={navConfig} handleSelectTab={handleSelectTab} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
