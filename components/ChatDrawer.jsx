"use client";
import PropTypes from "prop-types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { ArrowDown, Loader2, SendHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthContext } from "@auth/useAuthContext";
import { addMessage, getMessages } from "@redux/slices/chat";
import { useDispatch, useSelector } from "@redux/store";
import { useSocket } from "@providers/socket-provider";
import { Virtuoso } from "react-virtuoso";
import { formatDateMessage } from "@utils/utils";

ChatDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  contact: PropTypes.object,
};
export default function ChatDrawer({ open, onClose, contact }) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { isLoading, totalMessages } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState([]);
  const [arriveMessage, setArriveMessage] = useState(null);
  const [arriveMessages, setArriveMessages] = useState([]);
  const [showTime, setShowTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showArrow, setShowArrow] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(
    totalMessages - newMessages.length
  );

  const { socket, onlineUsers } = useSocket();
  const chatRef = useRef(null);
  const bottomRef = useRef(null);
  const observer = useRef();

  const pageSize = 20;
  const hasNextPage = currentPage * pageSize < totalMessages;
  const shouldLoadMore = !isLoading && !!hasNextPage;
  const existsInArray = onlineUsers.includes(contact.id);
  const handleSendMessage = () => {
    if (message !== "") {
      const data = {
        to: contact.id,
        text: message,
      };
      dispatch(addMessage(data, setNewMessages, newMessages, socket));
      setMessage("");
    }
  };

  const fetchNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [showContent, setShowContent] = useState(false);
  // new message arrive
  useEffect(() => {
    if (arriveMessage) {
      setShowContent(true);
      setNewMessages((prev) => [...prev, arriveMessage]);
      setArriveMessages((prev) => [...prev, arriveMessage]);

      const timeoutId = setTimeout(() => {
        setShowContent(false);
        setArriveMessage(null);
        setArriveMessages([]);
      }, 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [arriveMessage]);
  useEffect(() => {
    if (socket) {
      socket.on("msg-receive", (msg) => {
        setArriveMessage(msg?.data);
      });
    }
  }, [socket]);

  const lastElementOnBottomRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
        // setShowArrow(false);
      } else {
        // setShowArrow(true);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (contact !== null) {
      const data = {
        page: 1,
        pageSize: pageSize,
        to: contact?.id,
      };
      dispatch(getMessages(setNewMessages, data));
    }
  }, [dispatch, contact]);

  const followOutput = useCallback((isAtBottom) => {
    return isAtBottom ? "smooth" : false;
  }, []);

  const startReached = useCallback(() => {
    if (contact !== null) {
      if (shouldLoadMore) {
        const data = {
          page: currentPage + 1,
          pageSize: pageSize,
          to: contact?.id,
        };
        dispatch(getMessages(setNewMessages, data));
      }
    }
  }, [dispatch, newMessages]);

  const itemContent = useCallback(
    (index, rowData) => {
      if (index === newMessages.length - 1) {
        return (
          <div className="py-2">
            {showTime === rowData.id && (
              <p className="text-center text-[12px]">
                {formatDateMessage(rowData.createdAt).toUpperCase()}
              </p>
            )}
            <div
              ref={lastElementOnBottomRef}
              className={
                rowData.sender !== user.id ? "flex space-x-1 items-center" : ""
              }
            >
              {rowData.senderId !== user.id && (
                <Avatar className="w-[20px] h-[20px]">
                  <AvatarImage
                    className="w-[20px] h-[20px] object-contain"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>Photo</AvatarFallback>
                </Avatar>
              )}
              <p
                style={{
                  overflowWrap: "break-word",
                }}
                className={
                  rowData.senderId === user.id ? " text-end " : " text-start"
                }
              >
                <span
                  onClick={() => {
                    setShowTime((prev) => {
                      if (prev !== rowData.id) {
                        return rowData.id;
                      } else {
                        return "";
                      }
                    });
                  }}
                  style={{
                    overflowWrap: "break-word",
                    maxWidth: "70%",
                  }}
                  className={
                    rowData.senderId === user.id
                      ? "cursor-pointer px-2 rounded-s rounded-t py-1  bg-purple-600 text-white"
                      : "cursor-pointer px-2 rounded-e rounded-t py-1  bg-slate-200"
                  }
                >
                  {rowData?.text}
                </span>
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="py-2">
            {showTime === rowData.id && (
              <p className="text-center text-[12px]">
                {formatDateMessage(rowData.createdAt).toUpperCase()}
              </p>
            )}
            <div
              className={
                rowData.senderId !== user.id
                  ? "flex space-x-1 items-center"
                  : ""
              }
            >
              {rowData.senderId !== user.id && (
                <Avatar className="w-[20px] h-[20px]">
                  <AvatarImage
                    className="w-[20px] h-[20px] object-contain"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>Photo</AvatarFallback>
                </Avatar>
              )}
              <p
                style={{
                  overflowWrap: "break-word",
                }}
                className={
                  rowData.senderId === user.id ? " text-end " : " text-start "
                }
              >
                <span
                  onClick={() => {
                    setShowTime((prev) => {
                      if (prev !== rowData.id) {
                        return rowData.id;
                      } else {
                        return "";
                      }
                    });
                  }}
                  style={{
                    maxWidth: "70%",
                    overflowWrap: "break-word",
                  }}
                  className={
                    rowData.senderId === user.id
                      ? "cursor-pointer px-2 py-1 rounded-s rounded-t bg-purple-600 text-white"
                      : "cursor-pointer px-2 py-1 rounded-e rounded-t bg-slate-200"
                  }
                >
                  {rowData?.text}
                </span>
              </p>
            </div>
          </div>
        );
      }
    },
    [newMessages, showTime, user?.id, lastElementOnBottomRef]
  );

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = totalMessages - newMessages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return newMessages;
  }, [newMessages, totalMessages]);

  const Header = () => {
    return (
      <div>
        {hasNextPage && (
          <div className="flex justify-center">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
              >
                Load previous messages
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleGoToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollToIndex({
        index: totalMessages - 1,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="bg-white" style={{ zIndex: 999 }} side="right">
          <SheetHeader>
            <SheetTitle>
              <div>
                <p className="text-center text-md">{contact.firstname}</p>
                <p className="text-center text-gray-400 text-sm">
                  {existsInArray ? "online" : "Offline"}
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <Separator className="my-2 border" />
          <div className="relative h-full">
            {showContent && arriveMessages.length > 0 && (
              <div className="w-full absolute top-2 z-50">
                <p className="text-center">
                  <span className="bg-purple-800 text-white px-4 py-2 rounded">
                    {arriveMessages[arriveMessages.length - 1].text.length > 8
                      ? `${arriveMessages[
                          arriveMessages.length - 1
                        ].text.substring(0, 8)} ...`
                      : `${arriveMessages[arriveMessages.length - 1].text}`}
                    <span className="h-[12px] w-[12px] text-[12px] ml-1 p-1 rounded-full bg-white text-black items-center justify-center">
                      +{arriveMessages.length}
                    </span>
                  </span>
                </p>
                {/* <div className="flex items-center justify-center animate-bounce">
                  <ArrowDownToDot />
                </div> */}
              </div>
            )}
            <SheetDescription>
              <div
                style={{
                  display: "flex",
                  flexFlow: "column",
                  height: "60vh",
                  width: "100%",
                }}
              >
                <Virtuoso
                  ref={chatRef}
                  components={{ Header }}
                  initialTopMostItemIndex={internalMessages.length - 1}
                  firstItemIndex={Math.max(0, firstItemIndex)}
                  itemContent={itemContent}
                  data={newMessages}
                  startReached={startReached}
                  followOutput={followOutput}
                  style={{
                    flex: "1 1 auto",
                    overscrollBehavior: "contain",
                  }}
                />
                <div ref={bottomRef} />
              </div>
            </SheetDescription>
            {showArrow && !showContent && (
              <div className="w-full absolute bottom-[175px] z-50">
                <div className="flex items-center justify-center animate-bounce ">
                  <div
                    onClick={handleGoToBottom}
                    className="flex items-center justify-center h-[34px] w-[34px] rounded-full bg-purple-500 hover:bg-purple-600 hover:scale-105 ease-in-out duration-3000 cursor-pointer"
                  >
                    <ArrowDown color="white" />
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-10 w-full">
              <Separator className="my-2 border" />

              <div className="p-2 flex flex-row space-x-2">
                <Input
                  className="rounded"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="Send message"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  className="rounded bg-purple-600 hover:bg-purple-700"
                  disabled={message === ""}
                >
                  <SendHorizontal size={22} color="white" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
