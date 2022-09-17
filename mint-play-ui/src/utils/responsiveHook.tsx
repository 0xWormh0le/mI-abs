import {useEffect, useState} from 'react';

type Params = {
  phone?: boolean;
  tablet?: boolean;
  laptop?: boolean;
}

export const useResponsive = (map: Params) => {
  const laptop = 1329;
  const tablet = 1023;
  const phone = 767;

  // phone -> tablet -> laptop
  // hook returns true when screen is smaller than the size in map
  const [windowSize, setWindowSize] = useState(false);
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // detect in what size we are now
      const size = window.innerWidth;
      if (size > laptop) {
        setWindowSize(false)
      }
      if (size <= laptop) {
        if (size <= tablet) {
          if (size <= phone) {
            setWindowSize(!!map.phone)
          } else {
            setWindowSize(!!map.tablet)
          }
        } else {
          setWindowSize(!!map.laptop)
        }
      }
    }

    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [map.laptop, map.phone, map.tablet]); // Empty array ensures that effect is only run on mount
  return windowSize;

}
