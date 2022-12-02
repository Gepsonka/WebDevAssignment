import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axios";
import Navbar from "../../components/Navbar";
import { Card } from 'primereact/card';
import Error from "next/error";
import Todo from "../../components/Todo";



const CurrentUser = () => {
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
                console.log(res.data)
                if (localStorage.getItem('user') === router.query.id) {
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
                const res = await axiosInstance.get(`/todo/user/${router.query.id}`);
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
                    <Card className="border-green-500 border-2">
                        <h3 className="text-center">{user.username}</h3>
                        <p className="text-center">{user.first_name} {user.last_name}</p>
                    </Card>
                </div>
                <div className="md:col-9 sm:col-12 justify-content-center ">
                    {todos.map((value: any, index: number) => {
                        return <Todo key={index} id={value.id} title={value.title} description={value.description} completed={value.completed} created_at={value.created_at} sub_todos={value.sub_todos} user_id={value.user_id} updated_at={value.updated_at}/>
                    })}
                </div>
            </div>
        </div>
    )
}


export default CurrentUser;