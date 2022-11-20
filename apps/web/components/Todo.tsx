import { Card } from "primereact/card";
import React, { useState } from "react";
import { Checkbox } from 'primereact/checkbox';


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

    

    return (
        <div>
            <Card>
                <div className="">
                    <span>{title}</span>
                    <Checkbox onChange={e => setCompleted(e.checked)} checked={completed}></Checkbox>
                </div>
            </Card>
        </div> 
    )
}