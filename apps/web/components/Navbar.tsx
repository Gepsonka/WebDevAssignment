import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import React, { useEffect, useState } from "react";
import { Menubar } from 'primereact/menubar';
import { Image } from 'primereact/image';
import { AutoComplete } from 'primereact/autocomplete';
import { useRouter } from "next/router";
import axios from "axios";
import { axiosInstance } from "../axios/axios";
import { Dialog } from 'primereact/dialog';


const Navbar = () => {
    const router = useRouter();
    const [searchedUsername, setSearchedUsername] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [createTodoDialog, setCreateTodoDialog] = useState(false);
    const [newTodo, setNewTodo] = useState({});
    const [newSubTodos, setNewSubTodos] = useState([]);

    let items: any[] = [];

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('token') !== null);

    }, [])


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }

    if (isLoggedIn) {
        items = [
            {
                label: 'My TODOs',
                command: () => router.push(`/user/${localStorage.getItem('user')}`)
            },
            {
                label: "Create Task",
                command: () => setCreateTodoDialog(true)
            },
            {
                label: 'Logout',
                command: () => logout()
            },
        ]
    } else {
        items = [
            {
                label: 'Login',
                command: () => router.push('/login'),
                className: 'mr-2'
            },
            {
                label: 'Register',
                command: () => router.push('/register')
            }
        ]
    }

    const userItemTemplate = (item: any) => {
        return (
            <div className="flex flex-column">
                <span>{item.first_name} {item.last_name}</span>
                <small>@{item.username}</small>
            </div>
        )
    }

    const searchUser = async (event: any) => {
        try {
            const res = await axiosInstance.get(`/autocorrect/${event.query}`);
            console.log(event.query);
            setFilteredUsers(res.data);
        } catch(e) {
            console.log(e);
        }
    }

    const start = <Image height="40" alt="Logo" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c0840e59-db43-4681-ae7b-31a04dc4bc55/d7eqdvw-4e97ac92-e4b9-4498-9655-e4d612eb478b.png/v1/fill/w_1600,h_900,strp/random_logo_by_criticl_d7eqdvw-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTAwIiwicGF0aCI6IlwvZlwvYzA4NDBlNTktZGI0My00NjgxLWFlN2ItMzFhMDRkYzRiYzU1XC9kN2VxZHZ3LTRlOTdhYzkyLWU0YjktNDQ5OC05NjU1LWU0ZDYxMmViNDc4Yi5wbmciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.X991O1jF5lTNZbbEoHEfoo6nlHEihBMHMIm5-uBCXcU"/>
    const end = <AutoComplete  completeMethod={searchUser} value={searchedUsername} suggestions={filteredUsers} onChange={(e) => setSearchedUsername(e.value)} itemTemplate={userItemTemplate} />

    return (
        <>
            <Menubar className="sticky border-noround top-0 m-0" start={start} end={end} model={items} />
            <Dialog visible={createTodoDialog} onHide={() => setCreateTodoDialog(false)}>

            </Dialog>
        </>
        
    )
}


export default Navbar;