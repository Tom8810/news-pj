import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Sidebar from "@/components/sideBar";
import { Header } from "@/components/header";
import {
  notoSans,
  notoSansJP,
  notoSansSC,
  notoSerif,
  notoSerifJP,
  notoSerifSC,
} from "@/lib/font";

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // すべてのフォントクラスを適用
  const fontClasses = `${notoSans.className} ${notoSansJP.className} ${notoSansSC.className} ${notoSerif.className} ${notoSerifJP.className} ${notoSerifSC.className} `;

  // ロケールに基づいてフォントファミリーを選択するクラス
  const localeFontClass =
    locale === "ja" ? "font-ja" : locale === "cn" ? "font-cn" : "font-en";

  return (
    <html lang={locale} className={fontClasses}>
      <body className={localeFontClass}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <div className="flex pt-16 min-h-screen">
            <Sidebar whatFor="pc" />
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
