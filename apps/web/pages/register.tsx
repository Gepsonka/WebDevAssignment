import React, { useEffect, useRef, useState, useTransition } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link'
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';
import { AxiosInstance } from 'axios';
import { axiosInstance } from '../axios/axios';

const Register: NextPage = () => {
    const router = useRouter();

    const toast = useRef(null);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | Date[] | undefined>(undefined);

    const [usernameIsIncorrect, setUsernameIsIncorrect] = useState(false);
    const [emailIsEmpty, setEmailIsEmpty] = useState(false);
    const [passwordIsIncorrect, setPasswordIsIncorrect] = useState(false);
    const [passwordAgainIsEmpty, setPasswordAgainIsEmpty] = useState(false);
    const [firstNameIsEmpty, setFirstNameIsEmpty] = useState(false);
    const [lastNameIsEmpty, setLastNameIsEmpty] = useState(false);
    const [dateOfBirthIsEmpty, setDateOfBirthIsEmpty] = useState(false);

    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [usernameIsTaken, setUsernameIsTaken] = useState(false);
    const [passowrdsAreMatching, setPasswordsAreMatching] = useState(true);
    const [emailIsTaken, setEmailIsTaken] = useState(false);

    const [isUsernameLongEnough, setIsUsernameLongEnough] = useState(true);

    // password rules states
    const [isPasswordLenghtMinSix, setIsPasswordLenghtMinSix] = useState(true);
    const [isPasswordContainingLetter, setIsPasswordContainingLetter] = useState(true);
    const [isPasswordContainingNumber, setIsPasswordContainingNumber] = useState(true);

    const [isUsernameTakenLoading, setIsUsernameTakenLoading] = useState(false);
    const [isEmailTakenLoading, setIsEmailTakenLoading] = useState(false);

    const [isEmailValid, setIsEmailValid] = useState(true);

    const [registrationDialogVisibile, setRegistrationDialogVisibile] = useState(false);
    const [failedRegistrationDialogVisible, setFailedRegistrationDialogVisible] = useState(false);


    const passwordCheck = () => {
        if (password.length === 0){
            setPasswordIsIncorrect(false);
            setIsPasswordLenghtMinSix(true);
            setIsPasswordContainingLetter(true);
            setIsPasswordContainingNumber(true);
            return;
        }

        if (password.length <= 6){
            setIsPasswordLenghtMinSix(false);
            setPasswordIsIncorrect(true);
        } else {
            setIsPasswordLenghtMinSix(true);
        }

        let regExpLetters = /[a-zA-Z]/g;

        if (!regExpLetters.test(password)){
            setIsPasswordContainingLetter(false);
            setPasswordIsIncorrect(true);
        } else {
            setIsPasswordContainingLetter(true);
        }

        let regExpNumerical = /[0-9]/g;

        if (!regExpNumerical.test(password)){
            setIsPasswordContainingNumber(false);
            setPasswordIsIncorrect(true);
        } else {
            setIsPasswordContainingNumber(true);
        }

        if (isPasswordContainingLetter && isPasswordContainingNumber && isPasswordLenghtMinSix){
            setPasswordIsIncorrect(false);
        }
    }

    const usernameCheck = () => {
        // when the username is empty we do not want to check
        if (username.length === 0){
            setIsUsernameLongEnough(true);
            setUsernameIsIncorrect(false);
            return;
        }

        if (username.length < 8){
            setIsUsernameLongEnough(false);
            setUsernameIsIncorrect(true);
        } else {
            setIsUsernameLongEnough(true);
            setUsernameIsIncorrect(false);
        }
    }

    useEffect(() => {
        if (firstName.length > 0){
            setFirstNameIsEmpty(false);
        }
    }, [firstName])


    useEffect(() => {
        if (lastName.length > 0){
            setLastNameIsEmpty(false);
        }
    }, [lastName])

    
    useEffect(() => {
        usernameCheck();
    }, [username]);

    useEffect(() => { // Checking if username is taken at every change
        setIsUsernameTakenLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_FLASK_BACKEND}/is-username-exists`, {"username": username}).then((res) => {
            if (res.data.isTaken){
                setUsernameIsTaken(true);
            } else {
                setUsernameIsTaken(false);
            }
        }).catch((e) => {
            setUsernameIsTaken(false);
        })
        setIsUsernameTakenLoading(false);
    }, [username])

    useEffect(() => {
        passwordCheck();
        if (passwordAgain !== password){
            setPasswordsAreMatching(false);
        } else {
            setPasswordsAreMatching(true);
        }

    }, [password])

    useEffect(() => {
        if (password !== passwordAgain){
            setPasswordsAreMatching(false);
        } else {
            setPasswordsAreMatching(true);
        }
    }, [passwordAgain])

    useEffect(() => {
        if (email.length === 0){
            setIsEmailValid(true);
            return;
        } else {
            setEmailIsEmpty(false);
        }

        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        if (!emailRegex.test(email)){
            setIsEmailValid(false);
        } else {
            setIsEmailValid(true);
        }
    }, [email])


    const register = async () => {
        let anyError = false;
        
        if (username === ''){
            setUsernameIsIncorrect(true);
            setIsUsernameLongEnough(false);
            anyError = true;
        }

        if (email === ''){
            setEmailIsEmpty(true);
            setIsEmailValid(false);
            anyError = true;
        } else {
            setEmailIsEmpty(false);
        }

        if (password === ''){ 
            setPasswordIsIncorrect(true);
            setIsPasswordLenghtMinSix(false);
            setIsPasswordContainingNumber(false);
            setIsPasswordLenghtMinSix(false);
            anyError = true;
        }

        if (passwordAgain === ''){
            setPasswordAgainIsEmpty(true);
            anyError = true;
        } else {
            setPasswordAgainIsEmpty(false);
        }

        if (passwordAgain !== password){
            setPasswordsAreMatching(false);
            anyError = true;
        } else {
            setPasswordsAreMatching(true);
        }

        if (firstName === ''){
            setFirstNameIsEmpty(true);
            anyError = true;
        } else {
            setFirstNameIsEmpty(false);
        }

        if (lastName === ''){
            setLastNameIsEmpty(true);
            anyError = true;
        } else {
            setLastNameIsEmpty(false);
        }


        if (usernameIsTaken){
            setUsernameIsIncorrect(true);
            anyError = true;
        }

        if (emailIsTaken){
            anyError = true;
        }

        if (usernameIsIncorrect) {
            anyError =  true;
        }

        if (passwordIsIncorrect){
            anyError = true;
        }


        if (anyError){
            setIsRegisterLoading(false);
            return;
        }

        setIsRegisterLoading(true);

        let requestData = {
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            password: password
        }

        try {
            const res = await axiosInstance.post('/user', requestData);
            console.log(res.data)
            setRegistrationDialogVisibile(true);
        } catch (e){
            // @ts-ignore
            toast.current.show({severity: 'error', summary: 'Registration fail', detail: e.response.data.message})
        }

        setIsRegisterLoading(false);
    }
    
    const renderDialogFooter = () => {
        return (
            <div>
                <Button label='Go log in!' className="p-button-success" onClick={() => router.push('/login')}/>
                <Button label='Ok' className="p-button-outlined" onClick={() => setRegistrationDialogVisibile(false)}/>
            </div>
        );
    }

    return (
        <div>
            <Navbar/>
        <div className='relative grid justify-content-center align-content-center auth-bg auth-body py-6 min-h-screen'>
            <Card className='col-4 md:col-4 sm:col-10 text-center'>  
                <h2 className='mb-5 mt-1' >Create your account</h2>
                <div className='p-fluid'>
                <div className="field mb-5">
                    <span className={`p-float-label p-input-icon-left`}>
                        <i className="pi pi-users" />
                        <InputText className={`${firstNameIsEmpty ? 'p-invalid' : ''}`} id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <label htmlFor="firstName">First Name*</label>
                    </span>
                </div>
                <div className="field mb-5">
                    <span className={`p-float-label p-input-icon-left`}>
                        <i className="pi pi-users" />
                        <InputText className={`${lastNameIsEmpty ? 'p-invalid' : ''}`} id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <label htmlFor="lastName">Last Name*</label>
                    </span>
                </div>
                <div className="field mb-5">
                    <span className={`p-float-label p-input-icon-left ${isUsernameTakenLoading ? 'p-input-icon-right' : ''}`}>
                        { isUsernameTakenLoading && <i className="pi pi-spin pi-spinner" />}
                        { !isUsernameTakenLoading && <i className="pi pi-user" />}
                        <InputText className={` ${usernameIsIncorrect || usernameIsTaken ? 'p-invalid' : ''}`} id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <label htmlFor="username">Username*</label>
                    </span>
                    { usernameIsTaken && <small id="username" style={{textAlign:'left'}} className="p-error block">Username is already taken.</small>}
                    { !isUsernameLongEnough && <small id="username" style={{textAlign:'left'}} className="p-error block">Username must be at least 8 characters long.</small> }
                </div>
                <div className="field mb-5">
                    <span className={`p-float-label p-input-icon-left ${isEmailTakenLoading ? 'p-input-icon-right' : ''}`}>
                        { isEmailTakenLoading && <i className="pi pi-spin pi-spinner" />}
                        { !isEmailTakenLoading && <i className="pi pi-at" />}
                        <InputText className={`${emailIsEmpty || emailIsTaken || !isEmailValid ? 'p-invalid' : ''}`} id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="emial">Email*</label>
                    </span>
                    { !isEmailValid && <small id="password" style={{textAlign:'left'}} className="p-error block">Email is not valid.</small>}
                    { emailIsTaken && <small id="password" style={{textAlign:'left'}} className="p-error block">User with this email is already registered.</small>}
                </div>
                <div className="field mb-5">
                    <span className="p-float-label mb-2">
                        <Password id='password' className={`${passwordIsIncorrect ? 'p-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} toggleMask  feedback={true} />
                        <label htmlFor="password">Password*</label>
                    </span>
                    { !isPasswordContainingLetter && <small id="password" style={{textAlign:'left'}} className="p-error block">Password must contain at least one letter.</small>}
                    { !isPasswordContainingNumber && <small id="password" style={{textAlign:'left'}} className="p-error block">Password must contain at least one number.</small>}
                    { !isPasswordLenghtMinSix && <small id="password" style={{textAlign:'left'}} className="p-error block">Password must be at least 6 characters long.</small>}

                </div>
                <div className="field mb-5">
                    <span className="p-float-label mb-2">
                        <Password id='passwordAgain' className={`${passwordAgainIsEmpty || !passowrdsAreMatching ? 'p-invalid' : ''}`} value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} toggleMask  feedback={false} />
                        <label htmlFor="passwordAgain">Password Again*</label>
                    </span>
                    { !passowrdsAreMatching && <small id="username2-help" style={{textAlign: 'left'}} className="p-error block">Passwords are not matching!</small>}
                </div>
                </div>
                <Button className='mb-4' label='Register' onClick={() => {register()}} loading={isRegisterLoading} />
                <p style={{textAlign: 'left'}}>Or if you already registered <Link href={'/login'}><Button label="login here" className="p-button-link inline p-0" /></Link>.</p>
            </Card>
            <Dialog header="Successful registration!" footer={renderDialogFooter()} visible={registrationDialogVisibile} onHide={() => setRegistrationDialogVisibile(false)}>
                You have registered successfully. Now you can create like posts, follow members of the community, anytime!
            </Dialog>
            <Dialog header="Registration failed!" footer={<Button label='Ok' className="p-button-danger" onClick={() => setFailedRegistrationDialogVisible(false)}/>} visible={failedRegistrationDialogVisible} onHide={() => setFailedRegistrationDialogVisible(false)}>
                Something bad happened! Try again later...
            </Dialog>
            <Toast ref={toast} />
    </div>
    </div>
    )
}

export default Register;