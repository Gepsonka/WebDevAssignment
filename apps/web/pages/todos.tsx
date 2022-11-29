import { Card } from "primereact/card";
import React, { use, useState } from "react";
import Navbar from "../components/Navbar";
import '../styles/Todos.module.css'

export interface TodosProps {
    userId?: string;
}


const Todos = (props: TodosProps) => {
    const [username, setUsername] = useState('csoki');
    const [firstName, setFirstName] = useState('Kalany');
    const [lastName, setLastName] = useState('Jozsi');



    return (
        <div>
            <Navbar/>
            <div className="flex w-screen">
                <div className="md:col-3 sm:col-10">
                    <Card className="flex flex-column text-center gap-2 profile-container bg-blue-100">
                        <div className="mb-3">
                            <span className="text-2xl">Profile</span>
                        </div>
                        <div className="mb-3">
                            <span className="text-xl">{username}</span>
                        </div>
                        <div>
                            <span className="text-base">{firstName} {lastName}</span>
                        </div>
                    </Card>
                </div>
                <div className="md:col-9 sm:col-10 p-2">
                    <Card>
                        
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Todos;