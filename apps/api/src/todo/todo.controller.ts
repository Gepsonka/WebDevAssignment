import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Request, UnauthorizedException } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { Public } from 'src/public.provider';
import { UserService } from 'src/user/user.service';
import {CreateTodoDto, UpdateTodoDto} from './todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(
        private userService: UserService, 
        private todoService: TodoService
    )
    {}

    @Public()
    @Get(':id')
    async getTodoById(
        @Request() req,
        @Param() param
    ): Promise<Todo>{
        try{
            return await this.todoService.getTodoById(param.id)
        } catch (e) {
            throw new NotFoundException('Todo with this id does not exists');
        }
    }

    @Get()
    async getUsersTodos(
        @Request() req
    ): Promise<Todo[]> {
        const userId = (await this.userService.getUserByUsername(req.user.username)).id
        return await this.todoService.getTodosByUserId(userId)
    }

    @Public()
    @Get('user/:userId')
    async getTodosByUserId(
        @Request() req,
        @Param() param
    ): Promise<Todo[]> {
        console.log(param.userId);
        try{
            return await this.todoService.getTodosByUserId(param.userId);
        } catch (e) {
            console.log(e)
            throw new NotFoundException('User with this id does not exists');
        }
    }

    @Post()
    async createTodo(
        @Request() req,
        @Body() createTodoDto: CreateTodoDto
    ): Promise<Todo>{
        try{
            const data: Prisma.TodoCreateInput = {
                title: createTodoDto.title,
                description: createTodoDto.description,
                sub_todos: {
                    create: createTodoDto.subTodos
                },
                user: {
                    connect: {
                        username: req.user.username,
                    }
                }
            }
            return await this.todoService.createTodo(data)
        } catch (e) {
            console.log(e)
            throw new BadRequestException('You already have a TODO with the same title and description!');
        }
        
    }

    @Put(':id')
    async updateTodo(
        @Request() req,
        @Param() param: {id: string},
        @Body() updateTodoDto: UpdateTodoDto
    ): Promise<Todo> {
        try{
            const notUpdatedTodo = await this.todoService.getTodoById(param.id);
            if ((await this.userService.getUserByUsername(req.user.username)).id != notUpdatedTodo.user_id){
                throw new ForbiddenException('Cannot update this todo because it is not yours');
            }
            const where: Prisma.TodoWhereUniqueInput = {id: param.id};
            return await this.todoService.updateTodoData(where, updateTodoDto);
        } catch (e) {
            throw new NotFoundException('Todo with id does not exists');
        }
    }

    @Delete(':id')
    async deleteTodo(
        @Request() req,
        @Param() params: {id: string}
    ): Promise<Todo> {
        try {
            const currentUser = await this.userService.getUserByUsername(req.user.username);
            const currentTodo = await this.todoService.getTodoById(params.id);
            if (currentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot delete this todo because it is not yours');
            }
            return await this.todoService.deleteTodo(params.id);
        } catch (e) {
            console.log(e)
            throw new NotFoundException('Todo with id does not exists');
        }
    }

    @Put('/complete/:id')
    async completeTodo(
        @Request() req,
        @Param() params: {id: string}
    ): Promise<Todo> {
        try {
            const currentUser = await this.userService.getUserByUsername(req.user.username);
            const currentTodo = await this.todoService.getTodoById(params.id);
            if (currentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot complete this todo because it is not yours');
            }

            return await this.todoService.completeTodo(params.id);
        } catch (e) {
            throw new NotFoundException('Todo with id does not exists');
        }
    }

    @Put('/decomplete/:id')
    async decompleteTodo(
        @Request() req,
        @Param() params: {id: string}
    ): Promise<Todo> {
        try {
            const currentUser = await this.userService.getUserByUsername(req.user.username);
            const currentTodo = await this.todoService.getTodoById(params.id);
            if (currentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot decomplete this todo because it is not yours');
            }

            return await this.todoService.decompleteTodo(params.id);
        } catch (e) {
            throw new NotFoundException('Todo with id does not exists');
        }
    }
}
