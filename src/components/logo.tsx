export const Logo: React.FC = () => {
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