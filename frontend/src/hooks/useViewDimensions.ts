import { useState, useEffect } from 'react';

export function useViewDimensions() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.97,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({
        width: window.innerWidth * 0.97,
        height: window.innerHeight
      });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return dimensions;
}