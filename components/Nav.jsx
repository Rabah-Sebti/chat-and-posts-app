"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, MessageSquare } from "lucide-react";
import { useAuthContext } from "@auth/useAuthContext";
import { useRouter } from "next/navigation";
import UsersChatDrawer from "./UsersChatDrawer";
import ChatDrawer from "./ChatDrawer";
import { useSocket } from "@providers/socket-provider";
import { useDispatch } from "@redux/store";
import {
  getAllUnreadMessages,
  getUsers,
  updateUnreadMessages,
} from "@redux/slices/chat";
import { toast } from "sonner";
const Nav = () => {
  const router = useRouter();

  const { user, logout } = useAuthContext();
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openUsersChatDrawer, setOpenUsersChatDrawer] = useState(false);
  const [openChatDrawer, setOpenChatDrawer] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [contact, setContact] = useState(null);

  const handleContactSelected = useCallback(
    async (item) => {
      setContact(item);
      setOpenChatDrawer(true);
      await dispatch(
        updateUnreadMessages({ sender: item.id }, setUnreadMessages)
      );
      dispatch(getUsers());
    },
    [dispatch]
  );

  const handleLogout = async () => {
    try {
      logout();
      socket.emit("disconnect-user", { userId: user._id });
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };
  const notifyMessage = (text, from) => {
    if (!openUsersChatDrawer) {
      toast(text, {
        description: from,
        closeButton: true,
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("msg-receive", (msg) => {
        notifyMessage(msg.data.text, msg.user.firstname);
        setUnreadMessages((prev) => prev + 1);
      });
    }
  }, [socket]);
  useEffect(() => {
    if (socket) {
      socket.on("update-unreadMessages", (msg) => {
        setUnreadMessages((prev) => prev + msg.unreadMessages);
      });
    }
  }, [socket]);
  useEffect(() => {
    dispatch(getAllUnreadMessages(setUnreadMessages));
  }, [dispatch]);
  //
  return (
    <nav className="fixed top-0 h-20 backdrop-blur-sm bg-white/90 px-8 py-4 flex-between w-full mb-16 pt-3 shadow-10 z-20">
      <Link href="/home" className="flex gap-2 flex-center">
        <Image
          src="/logo3.png"
          alt="go home img"
          width={48}
          height={48}
          className="object-contain"
        />
        <p className="hidden md:flex font-bold" style={{ fontSize: 14 }}>
          Convo Stream
        </p>
      </Link>
      <div className="sm:flex hidden">
        <div className="flex items-center gap-3 md:gap-5">
          <Link href="/create-post" className="emerald_btn">
            Create post
          </Link>
          <div
            onClick={() => setOpenUsersChatDrawer(true)}
            className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 h-[36px] w-[36px] rounded-full cursor-pointer relative"
          >
            {unreadMessages !== 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center ">
                <p className="text-xs font-bold">{unreadMessages}</p>
              </div>
            )}
            <MessageSquare className="text-blue-600" />
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 h-[36px] w-[36px] rounded-full cursor-pointer"
          >
            <LogOut className="text-blue-600" />
          </div>

          <Link href="/profile" className="w-[34px] h-[34px]">
            <Image
              src={user?.picture || "/user.png"}
              alt="profile"
              width={35}
              height={35}
              className="rounded-full object-contain"
            />
          </Link>
        </div>
      </div>
      {/* mobile */}
      <div className="sm:hidden flex relative">
        <DropdownMenu
          open={openDropdown}
          onOpenChange={() => setOpenDropdown((prev) => !prev)}
        >
          <DropdownMenuTrigger>
            <Image
              src={user?.picture || "/user.png"}
              alt="profile"
              width={35}
              height={35}
              className="rounded-full"
              onClick={() => {
                setOpenDropdown(true);
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white mr-2 p-0">
            <DropdownMenuItem>
              <Link
                onClick={() => setOpenDropdown(false)}
                className="font-semibold hover:bg-slate-300 rounded w-full p-2 text-center"
                href="/profile"
              >
                My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                onClick={() => setOpenDropdown(false)}
                className="font-semibold hover:bg-slate-300 rounded w-full p-2 text-center"
                href="/create-post"
              >
                Create post
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                className="bg-inherit hover:bg-slate-300 text-black rounded w-full p-2 text-center"
                onClick={() => setOpenUsersChatDrawer(true)}
              >
                <p className="font-semibold">Chat</p>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {openUsersChatDrawer && (
        <UsersChatDrawer
          open={openUsersChatDrawer}
          onClose={() => setOpenUsersChatDrawer(false)}
          handleContactSelected={handleContactSelected}
        />
      )}
      {openChatDrawer && (
        <ChatDrawer
          open={openChatDrawer}
          onClose={() => setOpenChatDrawer(false)}
          contact={contact}
        />
      )}
    </nav>
  );
};

export default Nav;
