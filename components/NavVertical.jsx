"use client";
import PropTypes from "prop-types";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui/command";
// import Icon from "./icon/Icon";
import { Separator } from "./ui/separator";
import { useAuthContext } from "@auth/useAuthContext";
import { useRouter } from "next/navigation";
import Icon from "./icon/Icon";
import React from "react";

NavVertival.propTypes = {
  data: PropTypes.array,
  handleSelectTab: PropTypes.func,
};
export function NavVertival({ data, handleSelectTab }) {
  const { logout } = useAuthContext();
  const router = useRouter();
  const handleLogout = () => {
    try {
      logout();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Command className="mt-4">
        <CommandList>
          <CommandGroup>
            <div className="flex flex-col gap-1">
              {data[0].items.map((item, index) => {
                if (item.children) {
                  return (
                    <React.Fragment key={index}>
                      <span className="font-bold text-gray-500">
                        {item.title}
                      </span>
                      <div className="my-1">
                        <Separator className="h-[2px]" />
                      </div>
                      {item.children.map((child, index) => (
                        <CommandItem
                          onSelect={() => {
                            handleSelectTab(child.step);
                          }}
                          className="cursor-pointer hover:bg-slate-200 mx-2 rounded-lg mx-4"
                          key={index}
                        >
                          <div className="h-7 w-7 rounded-full flex items-center justify-center mr-4 bg-gray-300">
                            <Icon name={child.icon} size={16} color="#075985" />
                          </div>
                          <span
                            title={child.title}
                            className="font-bold line-clamp-1"
                          >
                            {child.title}
                          </span>
                          <CommandShortcut>
                            <Icon name="ChevronRight" size={18} />
                          </CommandShortcut>
                        </CommandItem>
                      ))}
                    </React.Fragment>
                  );
                } else {
                  return (
                    <CommandItem
                      key={index}
                      className="p-3 cursor-pointer mx-2"
                      onSelect={() => {
                        setActiveStep(item.step);
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="mr-4 bg-gray-200"
                      >
                        <Icon name={item.icon} size={16} color="#075985" />
                      </div>
                      <span className="font-bold">{item.title}</span>
                      <CommandShortcut>
                        <Icon name="ChevronRight" size={18} />
                      </CommandShortcut>
                    </CommandItem>
                  );
                }
              })}
              <div onClick={() => handleLogout()}>
                <CommandItem className="cursor-pointer hover:bg-slate-200 mx-4">
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="mr-4 bg-gray-300"
                  >
                    <Icon name="LogOut" size={16} color="#ef4444" />
                  </div>
                  <span className="font-bold text-red-400"> Déconnexion</span>
                  <CommandShortcut>
                    <Icon name="ChevronRight" size={18} />
                  </CommandShortcut>
                </CommandItem>
              </div>
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
