import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Card } from 'primereact/card';
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Link from "next/link";
import { Toast } from "primereact/toast";
import { AxiosInstance } from "axios";
import { axiosInstance } from "../axios/axios";

const login = () => {
    const router = useRouter()

    const toast = useRef(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameIsValid, setUsernameIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);

    const [badPasswordOrUsername, setBadPasswordOrUsername] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (localStorage.getItem('token') === null){
            router.push('/');
        }
    }, [])

    const login = async (username: string, password: string) => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.post('/auth/login', {
                username: username,
                password: password
            })
        } catch (e) {
            // @ts-ignore
            toast.current.show({severity: 'error', summary: 'Registration fail', detail: e.response.data.message})
            setPasswordIsValid(false);
            setUsernameIsValid(false);
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Navbar isLoggedIn={false} />
            <div className="flex h-screen w-screen justify-content-center align-items-center">
                <Card className='col-4 md:col-4 sm:col-10 text-center'>
                    <h2 className='mb-5 mt-1' >Login</h2>
                    <div className="field mb-5">
                        <span className="p-float-label p-fluid">
                            <InputText className={`${!usernameIsValid ? 'p-invalid' : ''}`} id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="field md-5">
                        <span className="p-float-label p-fluid mb-2">
                            <Password id='password' className={`${!passwordIsValid ? 'p-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    {badPasswordOrUsername && <small style={{ textAlign: 'left' }} className="p-error block mb-3">Wrong usename or password.</small>}
                    <Button label='Login' onClick={() => { login(username, password) }} loading={isLoading} />
                    <p style={{ textAlign: 'left' }}>Or if don&apos;t have account <Link href={'/register'}><Button label="register here" className="p-button-link inline p-0" /></Link>.</p>
                </Card>
            </div>
            <Toast ref={toast} />
        </div>
    )
}


export default login;