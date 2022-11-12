import { Injectable } from '@nestjs/common';
import { Prisma, SubTodo } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubTodoService {
    constructor(private prisma: PrismaService){}

    async createSubTodo(data: Prisma.SubTodoCreateInput): Promise<SubTodo | null>{
        return this.prisma.subTodo.create({
            data
        })
    }

    async getSubTodoById(id: string): Promise<SubTodo | null>{
        return this.prisma.subTodo.findFirst({
            where: {
                id: id
            }
        })
    }

    async getSubTodoByTodoId(TodoId: string): Promise<SubTodo[]> {
        return this.prisma.subTodo.findMany({
            where: {
                todo_id: TodoId
            }
        })
    }

    async updateSubTodo(where: Prisma.SubTodoWhereUniqueInput, data: Prisma.SubTodoUpdateInput): Promise<SubTodo | null> {
        return this.prisma.subTodo.update({
            where,
            data
        })
    }
    
    async deleteSubTodo(id: string): Promise<SubTodo | null> {
        return this.prisma.subTodo.delete({
            where: {
                id: id
            }
        })
    }

    async completeSubTodo(id: string): Promise<SubTodo> {
        return this.prisma.subTodo.update({
            where: {
                id: id
            }, 
            data: {
                completed: true
            }
        })
    }

    async decompleteSubTodo(id: string): Promise<SubTodo> {
        return this.prisma.subTodo.update({
            where: {
                id: id
            }, 
            data: {
                completed: false
            }
        })
    }


}
