import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Checkbox } from 'primereact/checkbox';
import { axiosInstance } from "../axios/axios";
import { Button } from "primereact/button";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import Todo from "./Todo";
import '../styles/SubTodo.module.css';
import { Toast } from "primereact/toast";





export interface SubTodoProps {
    id: string
    user_id: string
    description: string;
    completed: boolean;
    createdAt: Date;
}

export default function SubTodo(props: SubTodoProps) {
    const [subTodo, setSubTodo] = useState(props);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingDescription, setUpdateDescription] = useState(subTodo.description);

    const toast = useRef(null);

    const completeSubTodo = async () => {
        try {
            const res = await axiosInstance.put(`/sub-todo/complete/${subTodo.id}`)
            console.log(res.data)
            setSubTodo({...subTodo, completed: true})
        } catch (e) {
            console.log(e)
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not complete task', detail: e.response.data.message, life: 3000});
        }
    }

    const decompleteSubTodo = async () => {
        try {
            const res = await axiosInstance.put(`/sub-todo/decomplete/${subTodo.id}`)
            setSubTodo({...subTodo, completed: false})
        } catch (error) {
            console.log(error)
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not decomplete task', detail: error.response.data.message, life: 3000});
        }
    }

    const clickCheckbox = async () => {
        subTodo.completed ? decompleteSubTodo() : completeSubTodo()
    }

    const updateSubTodo = async () => {
        try {
            const res = await axiosInstance.put(`/sub-todo/${subTodo.id}`, {
                description: updatingDescription,
            })

            setSubTodo({...subTodo, description: updatingDescription});
            setIsUpdating(false);
        } catch (e) {
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not update task', detail: e.response.data.message, life: 3000});
        }
    }

    return (
        <div>
            <Card className="p-0 m-2 border-indigo-500 border-2">
                <div className="flex p-fluid align-items-center">
                    {isUpdating ? <InputText placeholder="Title" className={`mr-2 ${updatingDescription === '' ? 'p-invalid' : null}`} value={updatingDescription} onChange={(e) => setUpdateDescription(e.target.value)} /> : <span className={`flex-grow-1 ${subTodo.completed ? 'line-through' : null}`}>{props.description}</span>}
                    <Checkbox className="mr-2 ml-3" onChange={e => clickCheckbox()} checked={subTodo.completed}></Checkbox>
                    {subTodo.user_id === localStorage.getItem('user') && (isUpdating ? <Button onClick={() => updateSubTodo()} icon="pi pi-check" className="p-button-sm p-button-rounded p-button-text p-button-success mr-2" aria-label="Submit" /> : <Button onClick={() => setIsUpdating(!isUpdating)} icon="pi pi-pencil" className="p-button-sm p-button-rounded p-button-text p-button-info mr-2" aria-label="Submit" />)}
                    {subTodo.user_id === localStorage.getItem('user') && <Button icon="pi pi-trash" className="p-button-sm p-button-rounded p-button-text p-button-danger" aria-label="Submit" />}
                </div>
            </Card>
            <Toast ref={toast} />
        </div>
        
    )
}
