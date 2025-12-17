"use client";

import React from 'react';
import '../../../styles/login-layout.css';
import { clearContextDraft } from '@/components/local-storage';
import { Logo } from '@/components/logo';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const Login: React.FC = () => {
    const t = useTranslations("login");

    //BORRAR LA SIGUIENTE FUNCIÓN CUANDO SE IMPLEMENTE EL LOGIN: - V0.1
    const router = useRouter();
    const formRedirect = () => {
        clearContextDraft();
        router.push("/context-form");
    };
    return (
        <div className='flex min-h-screen w-full'>
            <div className='w-1/2 bg-[#ededed] p-8 flex flex-col justify-between'>
                <div>
                    <Logo />
                </div>
                {
                    //<Screenshot />
                }
            </div>
            <div className='w-1/2 bg-white flex flex-col justify-center items-center px-16'>

                <div className="max-w-md text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        {t("title")}
                        {/* Welcome to Gada */}
                    </h2>
                    <p className="text-gray-500 text-lg">
                        {t("description")}
                    </p>
                    <div className="flex justify-center w-full mt-5">
                        <button className="btn-supabase" onClick={formRedirect}>
                            {t("buttonText")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Screenshot: React.FC = () => {
    return (
        <div className='mb-20'>
            <img
                src="next.svg"
                alt="Screenshot placeholder"
                className='login-screenshot'
            />
        </div>
    );
}

export default Login;
