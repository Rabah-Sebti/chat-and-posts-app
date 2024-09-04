"use client";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useDispatch, useSelector } from "@redux/store";
import { getUsers } from "@redux/slices/chat";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSocket } from "@providers/socket-provider";

UsersChatDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleContactSelected: PropTypes.func,
};
export default function UsersChatDrawer({
  open,
  onClose,
  handleContactSelected,
}) {
  const dispatch = useDispatch();
  const { onlineUsers } = useSocket();
  const { users } = useSelector((state) => state.chat);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <div>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="bg-white" style={{ zIndex: 999 }} side="right">
          <SheetHeader>
            <SheetTitle>
              <div>
                <p className="text-center text-md">Discussion</p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <Separator className="my-2 border border-dashed" />
          <div className="relative h-full">
            <SheetDescription>
              <div>
                {users.map((item, index) => {
                  const existsInArray = onlineUsers.includes(item.id);
                  return (
                    <div key={index}>
                      <div
                        onClick={() => handleContactSelected(item)}
                        className="w-full flex items-center relative cursor-pointer"
                      >
                        <Avatar>
                          <AvatarImage
                            src={item?.picture || "/user.png"}
                            alt="@shadcn"
                          />
                          <AvatarFallback>USER</AvatarFallback>
                        </Avatar>
                        {existsInArray ? (
                          <div className="absolute bottom-0 left-[27px] rounded-full bg-green-500 h-[12px] w-[12px]" />
                        ) : (
                          <div className="absolute bottom-0 left-[27px] rounded-full bg-red-800 h-[12px] w-[12px]" />
                        )}

                        <p
                          className={`ml-2 ${
                            item.unreadMessages > 0
                              ? "font-bold"
                              : "font-medium"
                          }`}
                        >{`${item.firstname} ${item.lastname}`}</p>
                        <div className="absolute right-0">
                          {item.unreadMessages > 0 && (
                            <div className="flex justify-center rounded-full items-center w-[20px] h-[20px] bg-slate-200">
                              {item.unreadMessages}
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator className="my-2 border border-dashed" />
                    </div>
                  );
                })}
              </div>
            </SheetDescription>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
