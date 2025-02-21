import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { Locale } from "@/lib/types";

const locales: Locale[] = ["en", "ja", "cn"];
const defaultLocale: Locale = "en";

export const routing = defineRouting({ locales, defaultLocale });

export const navigation = createNavigation(routing);

export const { Link, redirect, usePathname, useRouter, getPathname } =
  navigation;
