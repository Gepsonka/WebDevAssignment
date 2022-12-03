import { Injectable } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService){}

    async createTodo(data: Prisma.TodoCreateInput):Promise<Todo> {
        return this.prisma.todo.create({
            data,
            include: {
                sub_todos: true
            }
        })
    }

    async getTodoById(id: string): Promise<Todo | null> {
        return this.prisma.todo.findFirst({
            where: {
                id: id
            },
            include: {
                sub_todos: true
            }
        })
    }

    async getTodosByUserId(userId: string): Promise<Todo[] | null> {
        return this.prisma.todo.findMany({
            where: {
                user_id: userId
            },
            include: {
                sub_todos: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })
    }

    async updateTodoData( where: Prisma.TodoWhereUniqueInput, data: Prisma.TodoUpdateInput): Promise<Todo | null> {
        return this.prisma.todo.update({
            where,
            data
        })
    }

    async deleteTodo(id: string): Promise<Todo | null> {
        return this.prisma.todo.delete({
            where: {
                id: id
            },
        })
    }

    async completeTodo(id: string) {
        return this.prisma.todo.update({
            where: {
                id: id
            },
            data: {
                completed: true
            }
        })
    }

    async decompleteTodo(id: string) {
        return this.prisma.todo.update({
            where: {
                id: id
            },
            data: {
                completed: false
            }
        })
    }

}