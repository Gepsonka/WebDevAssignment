import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';


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
    @Length(6,16)
    @IsOptional()
    username?: string;

    @IsOptional()
    first_name?: string;

    @IsOptional()
    last_name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @Length(8,16)
    @IsOptional()
    password?: string;
}