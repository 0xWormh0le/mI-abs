// saves position of scroll from previous page
// scrolls new page to top
// restores previous position on return
import { useEffect } from "react";

export const usePreviousScroll = () => {
  useEffect(() => {
    const prevPosition = window.scrollY;
    window.scrollTo(0, 0);
    return () => {
      window.scrollTo(0, prevPosition);
    };
  }, []);
};
