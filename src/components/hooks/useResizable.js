import { useRef, useState, useCallback, useEffect } from 'react';

const LG_BREAKPOINT = 1024;

const useResizable = (initialWidth = 50, minWidth = 30, maxWidth = 80) => {
  const [leftWidth, setLeftWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < LG_BREAKPOINT) {
        setLeftWidth(100);
      } else {
        setLeftWidth(initialWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialWidth]);

  const onMouseDown = useCallback(() => {
    if (window.innerWidth < LG_BREAKPOINT) return;
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    if (window.innerWidth < LG_BREAKPOINT) return;
    const container = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - container.left) / container.width) * 100;
    setLeftWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
  }, [minWidth, maxWidth]);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  return { leftWidth, containerRef, onMouseDown, onMouseMove, onMouseUp };
};

export default useResizable;