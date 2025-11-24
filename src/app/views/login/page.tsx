'use client';
import React from 'react';
import '../../styles/login-layout.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const Login: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId="user">
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
                            Welcome to Gada
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Login with your Google account
                        </p>
                        <div className="flex justify-center w-full mt-5">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                }}
                                onError={() => {
                                    console.log('Login Failed.');
                                }}
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="rectangular"
                                width="350"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
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

const Logo: React.FC = () => {
    return (
        <div className="flex items-center gap-3">
            {//DESCOMENTAR CUANDO SE TENGA EL LOGO Y SUSTITUIR EL SRC 
                //<img
                //src="file.svg"
                //alt="GADA logo placeholder"
                //className='login-logo h-10 w-10'
                ///>
            }
            <div className="h-10 w-10 bg-slate-900 rounded-lg shadow-lg flex justify-center items-center">

                <div className="h-6 w-6 border-2 border-white border-dashed rounded-full"></div>

            </div>

            <span className="font-bold text-xl text-black">
                GADA
            </span>
        </div>
    );
}

export default Login;
