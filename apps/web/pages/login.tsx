import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Card } from 'primereact/card';


const login = () => {
    const router = useRouter()

    useEffect(() => {
        if (!!localStorage.getItem('jwtToken')){
            router.push('/');
        }
    }, [])




    return (
        <div>
            <Navbar isLoggedIn={false} />
            <div className="flex h-screen w-screen">
                <Card>

                </Card>
            </div>
        </div>
    )
}


export default login;