import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Request } from '@nestjs/common';
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
            throw new HttpException({'msg': 'Todo with this id does not exists'}, HttpStatus.NOT_FOUND);
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
            throw new HttpException({'message': 'User with this id does not exists'}, HttpStatus.NOT_FOUND);
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
            throw new HttpException({'msg': 'You already have a TODO with the same title and description!'}, HttpStatus.BAD_REQUEST);
        }
        
    }

    @Patch(':id')
    async updateTodo(
        @Request() req,
        @Param() param: {id: string},
        @Body() updateTodoDto: UpdateTodoDto
    ): Promise<Todo> {
        try{
            const notUpdatedTodo = await this.todoService.getTodoById(param.id);
            if ((await this.userService.getUserByUsername(req.user.username)).id != notUpdatedTodo.user_id){
                throw new HttpException({'msg': 'Cannot update this todo because it is not yours'}, HttpStatus.UNAUTHORIZED);
            }
            const where: Prisma.TodoWhereUniqueInput = {id: param.id};
            return await this.todoService.updateTodoData(where, updateTodoDto);
        } catch (e) {
            throw new HttpException({'msg': 'Todo with id does not exists'}, HttpStatus.NOT_FOUND);
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
                throw new HttpException({'msg': 'Cannot delete this todo because it is not yours'}, HttpStatus.UNAUTHORIZED);
            }
            return await this.todoService.deleteTodo(params.id);
        } catch (e) {
            throw new HttpException({'msg': 'Todo with id does not exists'}, HttpStatus.NOT_FOUND);
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
                throw new HttpException({'msg': 'Cannot complete this todo because it is not yours'}, HttpStatus.UNAUTHORIZED);
            }

            return await this.todoService.completeTodo(params.id);
        } catch (e) {
            throw new HttpException({'msg': 'Todo with id does not exists'}, HttpStatus.NOT_FOUND);
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
                throw new HttpException({'msg': 'Cannot decomplete this todo because it is not yours'}, HttpStatus.UNAUTHORIZED);
            }

            return await this.todoService.decompleteTodo(params.id);
        } catch (e) {
            throw new HttpException({'msg': 'Todo with id does not exists'}, HttpStatus.NOT_FOUND);
        }
    }
}
