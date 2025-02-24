"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "./sideBar";
import { useLocale, useTranslations } from "next-intl";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { Locale } from "@/lib/types";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("side_bar");
  const locale = useLocale();

  return (
    <>
      <header className="bg-black text-white py-4 px-6 fixed top-0 w-full h-16 z-10">
        <div className="relative flex items-center justify-center h-full w-full">
          <button
            className="lg:hidden text-white absolute left-0"
            aria-label={t("open_menu")}
            title={t("open_menu")}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <FaBars size={28} />
          </button>

          <div className="text-xl font-bold text-white">
            <Link href="/">AI TIMES</Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white shadow-lg z-20"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  sansLocaledClassName(locale as Locale)
                )}
              >
                {t("menu")}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t("close_menu")}
                title={t("close_menu")}
                aria-expanded={isOpen}
                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <Sidebar
              whatFor="mobile"
              onPageTransition={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
