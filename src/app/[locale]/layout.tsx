import { ReactNode } from "react";
import { Locale, routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: ReactNode,
    params: Promise<{ locale: Locale }>
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) notFound();
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );

}