import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axios";
import Navbar from "../../components/Navbar";
import { Card } from 'primereact/card';
import Error from "next/error";



const currentUser = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<any | null>({});
    const [isUsersProfile, setIsUsersProfile] = useState<boolean>(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axiosInstance.get(`/user/${id}`);
                console.log(res)
                if (res.data.userId === id) {
                    setIsUsersProfile(true);
                } else {
                    setIsUsersProfile(false);
                }

                setUser(res.data)
            } catch (e) {
                console.log(e)
                setUser(null)
                setIsUsersProfile(false);
            }
        }
        
        getProfile();
    }, [])

    if (user === null) {
        return <Error statusCode={404} title={'User not found'}/>
    }
        
    return (
        <div>
            <Navbar/>
            <div className="grid">
                <div className="md:col-3 sm:col-12">
                    <Card>
                        <h3 className="text-center">{user.username}</h3>
                        <p>{id}</p>
                    </Card>
                </div>
                <div className="md:col-9 sm:col-12">
                    <Card>
                        <h3>{}</h3>
                    </Card>
                </div>
            </div>
        </div>
    )
}


export default currentUser;