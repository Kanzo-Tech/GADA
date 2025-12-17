'use client';
import { useRouter } from "next/navigation";

export const navigation = () => {
    const router = useRouter();

    const navigateToLocale = (route: string) => {
        router.push("/[locale]/" + route);
    };

    const navigateTo = (route: string) => {
        router.push(route);
    }

    return { navigateTo: navigateToLocale };
}