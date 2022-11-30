import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { Checkbox } from 'primereact/checkbox';
import { axiosInstance } from "../axios/axios";


// export interface SubTodo {
//     description: string;
//     completed: boolean;
//     createdAt: Date;
// }

// export interface TodoProps {
//     id: string;
//     title: string;
//     description: string | undefined;
//     completed: boolean;
//     createdAt: Date;
//     subTodos: SubTodo[];
// }



const Todo = (props: {id: string}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [todo, setTodo] = useState({})

    useEffect(() => {
        const getTodo = async () => {
            try {
                const res = await axiosInstance.get(`/todo/${props.id}`)
                setTodo(res.data)
            } catch (e) {
                console.log(e);
            }
        }

        getTodo();
    }, [])
    

    return (
        <div>
            <Card>
                <div className="flex">
                    <span>{title}</span>
                    <Checkbox onChange={e => setCompleted(e.checked)} checked={completed}></Checkbox>
                </div>
            </Card>
        </div> 
    )
}

export default Todo;