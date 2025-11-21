import './styles/login-layout.css';

function Login() {
    return (
        <section className='login-page'>
            <div className='login-left'>
                <Logo />
                <Screenshot />
            </div>
            <div className='login-right'>
                <h2>
                    Hola mundo
                </h2>
                <p>
                    Aqui va el login
                </p>
            </div>
        </section>
    );
}

function Screenshot() {
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

function Logo() {
    return (
        <img
            src="file.svg"
            alt="GADA logo placeholder"
            className='login-logo place-items-start size-10'
        />
    );
}

export default Login;