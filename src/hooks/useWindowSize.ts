import { useEffect, useState } from 'react';

export function useWindowSize(isViewport = false) {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setSize({
      width: isViewport ? window.visualViewport?.width || 0 : window.innerWidth,
      height: isViewport ? window.visualViewport?.height || 0 : window.innerHeight,
    });

    function handleResize() {
      setSize({
        width: isViewport ? window.visualViewport?.width || 0 : window.innerWidth,
        height: isViewport ? window.visualViewport?.height || 0 : window.innerHeight,
      });
    }

    if (isViewport) window.visualViewport?.addEventListener('resize', handleResize);
    else window.addEventListener('resize', handleResize);

    return () => {
      if (isViewport) window.visualViewport?.removeEventListener('resize', handleResize);
      else window?.removeEventListener('resize', handleResize);
    };
  }, [isViewport]);

  return size;
}
