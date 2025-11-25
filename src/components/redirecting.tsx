import { useRouter } from "next/navigation";

export const navigation = () => {
    const router = useRouter();

    const navigateTo = (route: string) => {
        router.push(route);
    };

    return { navigateTo };
}