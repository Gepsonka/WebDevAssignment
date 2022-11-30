import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axios";
import Navbar from "../../components/Navbar";
import { Card } from 'primereact/card';
import Error from "next/error";
import Todo from "../../components/Todo";



const currentUser = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<any | null>({});
    const [isUsersProfile, setIsUsersProfile] = useState<boolean>(false);
    const [todos, setTodos] = useState([]);

    useEffect(() => {

        if (!router.isReady) {
            return
        }

        const getProfile = async () => {
            try {
                const res = await axiosInstance.get(`/user/${router.query.id}`);
                if (res.data.userId === router.query.id) {
                    setIsUsersProfile(true);
                } else {
                    setIsUsersProfile(false);
                }

                setUser(res.data)
            } catch (e) {
                console.log(e);
                setUser(null);
                setIsUsersProfile(false);
            }
        }

        const getTodos = async () => {
            try {
                const res = await axiosInstance.get(`/user/todo/${router.query.id}`);
                setTodos(res.data);
            } catch (e) {
                console.log(e);
            }
        }

        getTodos();
        getProfile();
    }, [router.isReady])

    if (user === null) {
        return <Error statusCode={404} title={'User not found'}/>
    }
        
    return (
        <div>
            <Navbar/>
            <div className="grid p-3">
                <div className="md:col-3 sm:col-12">
                    <Card>
                        <h3 className="text-center">{user.username}</h3>
                        <p>{id}</p>
                    </Card>
                </div>
                <div className="md:col-9 sm:col-12 justify-content-center ">
                    {todos.map((value: any, index: number) => {
                        return <Todo id={value.id}/>
                    })}
                </div>
            </div>
        </div>
    )
}


export default currentUser;