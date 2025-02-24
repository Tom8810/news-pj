"use client";

import React, { useState, useEffect, useRef } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  const [isRightAligned, setIsRightAligned] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // 要素の位置を確認し、表示位置を決定
  const updateTooltipPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const centerPoint = windowWidth / 2;
      setIsRightAligned(rect.left > centerPoint);
    }
  };

  useEffect(() => {
    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);
    return () => window.removeEventListener("resize", updateTooltipPosition);
  }, []);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node)
    ) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setVisible(false);
    }
  };

  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const tooltipPosition = isRightAligned
    ? "absolute bottom-full right-0 mb-2"
    : "absolute bottom-full left-0 mb-2";

  return (
    <span
      ref={triggerRef}
      className="relative inline-block"
      onClick={(e) => {
        e.stopPropagation();
        setVisible((prev) => !prev);
      }}
      onMouseEnter={() => {
        if (!isTouchDevice()) {
          updateTooltipPosition();
          setVisible(true);
        }
      }}
      onMouseLeave={() => {
        if (!isTouchDevice()) setVisible(false);
      }}
      onFocus={() => {
        updateTooltipPosition();
        setVisible(true);
      }}
      tabIndex={0}
      aria-describedby={visible ? "tooltip" : undefined}
      aria-expanded={visible}
    >
      {children}
      <div
        id="tooltip"
        ref={tooltipRef}
        role="tooltip"
        aria-hidden={!visible}
        className={`
          ${tooltipPosition}
          ${visible ? "opacity-100" : "opacity-0"}
          transition-opacity duration-200 ease-in-out
          pointer-events-none
          w-max bg-gray-900 text-white rounded-lg py-2 px-3 shadow-lg z-50
          ${visible ? "" : "invisible"}
          ${isTouchDevice() ? "text-xs max-w-48" : "text-sm max-w-xs"}
        `}
      >
        {content.replace(/\*\*(.*?)\*\*/g, "$1")}
      </div>
    </span>
  );
};

export default Tooltip;
