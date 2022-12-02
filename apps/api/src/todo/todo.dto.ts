import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';



export class CreateTodoDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    subTodos: Prisma.SubTodoCreateWithoutTodoInput;
}


export class UpdateTodoDto {
    title: string;

    @IsOptional()
    description: string;
}