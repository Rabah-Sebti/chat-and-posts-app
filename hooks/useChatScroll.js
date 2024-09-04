import PropTypes from "prop-types";
import { useEffect, useState } from "react";

useChatScroll.propTypes = {
  chatRef: PropTypes.any,
  bottomRef: PropTypes.any,
  shouldLoadMore: PropTypes.bool,
  loadMore: PropTypes.func,
  count: PropTypes.number,
};
export default function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}) {
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }
      if (!topDiv) {
        return false;
      }
      const distanceFromBottom =
        // topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom >= 100;
    };
    // if (shouldAutoScroll()) {
    //   setTimeout(() => {
    //     bottomRef.current?.scrollIntoView({
    //       behavior: "smooth",
    //     });
    //   }, 100);
    // }
  }, [bottomRef, chatRef, count, hasInitialized]);
}
