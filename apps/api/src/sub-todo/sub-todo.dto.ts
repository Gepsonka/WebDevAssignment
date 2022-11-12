import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';


export class CreateSubTodoDto {
    @IsNotEmpty()
    ParentTodoId: string;

    @IsNotEmpty()
    description: string;
}

export class UpdateSubTodoDto {
    @IsNotEmpty()
    description: string;
}