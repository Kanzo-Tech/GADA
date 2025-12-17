import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";


export default getRequestConfig(async ({ requestLocale }) => {
    let requested = await requestLocale;

    const locale: Locale =
        routing.locales.includes(requested as Locale)
            ? (requested as Locale)
            : routing.defaultLocale;

    const messages = (await import(`./messages/${locale}.json`)).default;

    return {
        locale,
        messages
    }
});