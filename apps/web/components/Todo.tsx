import { Card } from "primereact/card";
import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from 'primereact/checkbox';
import { axiosInstance } from "../axios/axios";
import SubTodo, { SubTodoProps } from "./SubTodo";
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";




export interface TodoProps {
    id: string;
    user_id: string
    title: string;
    description: string | undefined;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
    subTodos: SubTodoProps[];
}

const Todo = (props: TodoProps) => {
    const [todo, setTodo] = useState(props);
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useRef(null);

    const [updateTitle, setUpdateTitle] = useState(todo.title);
    const [updateDescription, setUpdateDescription] = useState(todo.description);
    const [isDeleted, setIdDeleted] = useState(false)

    const [newSubTodo, setNewSubTodo] = useState('')
    
    const completeTodo = async () => {
        try {
            const res = await axiosInstance.put(`/todo/complete/${todo.id}`)
            console.log(res.data)
            setTodo({...todo, completed: true})
        } catch (e) {
            console.log(e)
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not complete task', detail: e.response.data.message, life: 3000});
        }
    }

    const decompleteTodo = async () => {
        try {
            const res = await axiosInstance.put(`/todo/decomplete/${todo.id}`)
            setTodo({...todo, completed: false})
        } catch (error) {
            console.log(error)
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not decomplete task', detail: error.response.data.message, life: 3000});
        }
    }

    const updateTodo = async () => {
        if (updateTitle === '') {
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not update task', detail: 'Title required.', life: 3000});
            return;
        }
        try {
            const res = await axiosInstance.put(`/todo/${todo.id}`, {
                title: updateTitle,
                description: updateDescription
            })
            console.log(res.data)
            setTodo({...res.data})
            setIsUpdating(false);
        } catch (e) {
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not update task', detail: e.response.data.message, life: 3000});
        }
    }

    const deleteTodo = async () => {
        
    }

    const clickCheckbox = async () => {
        todo.completed ? decompleteTodo() : completeTodo()
    }

    const addNewSubTodo = async () => {
        try {
            const res = await axiosInstance.post('/sub-todo', {
                description: newSubTodo,
                ParentTodoId: todo.id
            })
            todo.subTodos.push(res.data);
            setNewSubTodo('');
        } catch (e) {
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not create task', detail: e.response.data.message, life: 3000});
        }
    }

    return (
        <div className={`${isDeleted ? 'hidden' : null}`}>
            <Card>
                <div className="flex align-items-center mb-3 p-fluid">
                    {isUpdating ? <InputText placeholder="Title" className={`mr-2 ${updateTitle === '' ? 'p-invalid' : null}`} value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)}/> : <span className={`flex-grow-1 mr-2 ${todo.completed ? 'line-through' : null}`}>{todo.title}</span>}
                    <Checkbox className="mr-3" onChange={e => clickCheckbox()} checked={todo.completed}></Checkbox>
                    {todo.user_id === localStorage.getItem('user') && (isUpdating ? <Button onClick={() => updateTodo()} icon="pi pi-check" className="p-button-sm p-button-rounded p-button-text p-button-success mr-2" aria-label="Submit" /> : <Button onClick={() => setIsUpdating(!isUpdating)} icon="pi pi-pencil" className="p-button-sm p-button-rounded p-button-text p-button-info mr-2" aria-label="Submit" />)}
                    {todo.user_id === localStorage.getItem('user') && <Button icon="pi pi-trash" className="p-button-sm p-button-rounded p-button-text p-button-danger" aria-label="Submit" />}
                </div>
                <div className="p-fluid mb-3">
                    {isUpdating ? <InputText placeholder="Description" className="p-inputtext-sm" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)}/> : <small className={`${todo.completed ? 'line-through' : null}`}>{todo.description}</small>}
                </div>
                <div className="flex flex-column">
                    {
                        todo.subTodos.map((value: any, index: number) => <SubTodo key={index} id={value.id} user_id={todo.user_id} description={value.description} completed={value.completed} createdAt={value.created_at}/>)
                    }
                </div>
                <div className="flex mt-4">
                    <InputText placeholder="Description" className="flex-grow-1 mr-3" value={newSubTodo} onChange={(e) => setNewSubTodo(e.target.value)} />
                    <Button onClick={() => addNewSubTodo()} label="Add sub-todo" aria-label="Submit" />
                </div>
            </Card>
            <Toast ref={toast} />
        </div> 
    )
}

export default Todo;