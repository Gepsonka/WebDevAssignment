import { IsEmail, IsNotEmpty, Length } from 'class-validator';


export class CreateUserDto {
    @Length(6,16)
    username: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    email: string;

    @Length(8,16)
    password: string;
}


export class UpdateUserDto {
    
}