import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axios";
import Navbar from "../../components/Navbar";
import { Card } from 'primereact/card';
import Error from "next/error";
import Todo, { TodoProps } from "../../components/Todo";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";




const CurrentUser = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<any | null>({});
    const [isUsersProfile, setIsUsersProfile] = useState<boolean>(false);
    const [todos, setTodos] = useState<TodoProps[]>([]);
    const [createTodoDialog, setCreateTodoDialog] = useState(false);

    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [newTodoSubTodos, setNewTodoSubTodos] = useState<{ description: string }[]>([{description: "hellooo"}])
    const [newSubTodoDescription, setNewSubTodoDescription] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>('')

    const toast = useRef(null);

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

        setLoggedInUserId(localStorage.getItem('user'));

        getTodos();
        getProfile();
    }, [router.query.id])


    const addSubTodoToNewTodo = () => {
        if (newSubTodoDescription === '') {
            return;
        }
        let subTodos = [...newTodoSubTodos];
        subTodos.push({description: newSubTodoDescription});
        setNewTodoSubTodos(subTodos);
        setNewSubTodoDescription('');
    }

    const deleteSubTodoFromNewTodo = (index: number) => {
        let subTodos = [...newTodoSubTodos];
        subTodos.splice(index,1);
        setNewTodoSubTodos(subTodos);
    }

    const submitNewTodo = async () => {
        if (newTodoTitle === '') {
            return;
        }

        try {
            const res = await axiosInstance.post('/todo', {
                title: newTodoTitle,
                description: newTodoDescription,
                subTodos: newTodoSubTodos
            })

            let newTodos = [...todos];
            newTodos.unshift(res.data)
            console.log(newTodos)
            setTodos(newTodos);
        } catch (e) {
            // @ts-ignore
            toast.current.show({severity:'error', summary: 'Could not submit task', detail: e.response.data.message, life: 3000});
        }
        setCreateTodoDialog(false);
    }

    const dialogFooter = () => {
        return (
            <div>
                <Button onClick={() => submitNewTodo()} label="Submit Task" aria-label="Submit"  />
            </div>
        )
    }

    if (user === null) {
        return <Error statusCode={404} title={'User not found'} />
    }

    return (
        <div>
            <Navbar />
            <div className="grid p-3">
                <div className="md:col-3 sm:col-12">
                    <Card className="border-green-500 border-2 mb-3">
                        <h3 className="text-center">{user.username}</h3>
                        <p className="text-center">{user.first_name} {user.last_name}</p>
                    </Card>
                    <div className="p-fluid">
                        { loggedInUserId === router.query.id && <Button onClick={() => setCreateTodoDialog(true)} label="Create Task" className="p-button-info" />}
                    </div>
                </div>
                <div className="md:col-9 sm:col-12 justify-content-center ">
                    {todos.map((value: any, index: number) => {
                        return <Todo key={value.id} id={value.id} title={value.title} description={value.description} completed={value.completed} created_at={value.created_at} sub_todos={value.sub_todos} user_id={value.user_id} updated_at={value.updated_at} />
                    })}
                </div>
            </div>
            <Dialog header={<h2>Create New Task</h2>} footer={dialogFooter} visible={createTodoDialog} onHide={() => setCreateTodoDialog(false)}>
                <div className="flex w-30rem pt-4 flex-column">
                    <div className="p-fluid w-full mb-5">
                        <span className="p-float-label p-fluid">
                            <InputText className={`${newTodoTitle === '' ? 'p-invalid' : null}`} id="todoTitle" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
                            <label htmlFor="todoTitle">Task Title</label>
                        </span>
                    </div>
                    <div className="p-fluid w-full">
                        <span className="p-float-label p-fluid">
                            <InputText id="todoDescription" value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} />
                            <label htmlFor="todoDescription">Task Description</label>
                        </span>
                    </div>
                    <div className="my-3">
                        {newTodoSubTodos.map((value: any, index: number) => {
                            return (
                                <div key={value} className="flex my-2 p-2 pl-4 align-items-center border-round-md border-indigo-500 border-2 shadow-2">
                                    <span className="flex-grow-1">{value.description}</span>
                                    <Button onClick={() => deleteSubTodoFromNewTodo(index)} icon="pi pi-times" className="p-button-rounded p-button-danger" aria-label="Cancel" />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex align-items-center mt-5">
                        <div className="p-fluid flex-grow-1 mr-2">
                            <InputText className="p-inputtext-sm" placeholder="Sub-task description" value={newSubTodoDescription} onChange={(e) => setNewSubTodoDescription(e.target.value)} />
                        </div>
                        <div className="">
                            <Button onClick={() => addSubTodoToNewTodo()} label="Add sub-task" className="p-button-success p-button-sm" />
                        </div>
                    </div>
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    )
}


export default CurrentUser;