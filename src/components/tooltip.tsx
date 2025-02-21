"use client";

import React, { useState, useEffect, useRef } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // **クリック外しを処理**
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

  // **Escapeキーで閉じる**
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setVisible(false);
    }
  };

  // **デバイス判定（スマホかどうか）**
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  return (
    <span
      ref={triggerRef}
      className="relative inline-block"
      onClick={(e) => {
        e.stopPropagation();
        setVisible((prev) => !prev);
      }}
      onMouseEnter={() => {
        if (!isTouchDevice()) setVisible(true);
      }}
      onMouseLeave={() => {
        if (!isTouchDevice()) setVisible(false);
      }}
      onFocus={() => setVisible(true)}
      tabIndex={0}
      aria-describedby={visible ? "tooltip" : undefined}
      aria-expanded={visible}
    >
      {children}
      {visible && (
        <div
          id="tooltip"
          ref={tooltipRef}
          role="tooltip"
          aria-hidden={!visible}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg z-50"
        >
          {content}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
