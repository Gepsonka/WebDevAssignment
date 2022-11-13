import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import React, { useState } from "react";
import { Menubar } from 'primereact/menubar';
import { Image } from 'primereact/image';
import { AutoComplete } from 'primereact/autocomplete';
import { useRouter } from "next/router";
import { useQuery } from '@tanstack/react-query'
import axios from "axios";


export interface NavbarProps {
    isLoggedIn: boolean;
}

const Navbar = (props: NavbarProps) => {
    const router = useRouter();
    const [searchedUsername, setSearchedUsername] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState<any>([])
    let items: any[] = [];

    if (props.isLoggedIn) {
        items = [
            {
                label: 'My TODOs',
                command: () => router.push('/')
            },
            {
                label: 'Logout'
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
            let res:any = []
            axios.get(`${process.env.NEXT_PUBLIC_API_URL!}autocorrect/${searchedUsername}`).then(resp => {res = resp.data});
            setFilteredUsers(res.data);
            console.log(`${process.env.NEXT_PUBLIC_API_URL!}autocorrect/${searchedUsername}`)
            console.log(filteredUsers);
        } catch (e) {
            console.log(e);
        }

        
    }

    const start = <Image height="40" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c0840e59-db43-4681-ae7b-31a04dc4bc55/d7eqdvw-4e97ac92-e4b9-4498-9655-e4d612eb478b.png/v1/fill/w_1600,h_900,strp/random_logo_by_criticl_d7eqdvw-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTAwIiwicGF0aCI6IlwvZlwvYzA4NDBlNTktZGI0My00NjgxLWFlN2ItMzFhMDRkYzRiYzU1XC9kN2VxZHZ3LTRlOTdhYzkyLWU0YjktNDQ5OC05NjU1LWU0ZDYxMmViNDc4Yi5wbmciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.X991O1jF5lTNZbbEoHEfoo6nlHEihBMHMIm5-uBCXcU"/>
    const end = <AutoComplete  completeMethod={searchUser} value={searchedUsername} suggestions={filteredUsers} onChange={(e) => setSearchedUsername(e.value)} itemTemplate={userItemTemplate} />

    return (
        <>
            <Menubar className="sticky border-noround top-0 m-0" start={start} end={end} model={items} />
        </>
        
    )
}


export default Navbar;