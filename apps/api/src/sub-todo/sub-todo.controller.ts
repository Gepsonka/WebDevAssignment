import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Request } from '@nestjs/common';
import { Prisma, SubTodo } from '@prisma/client';
import { Public } from 'src/public.provider';
import { TodoService } from 'src/todo/todo.service';
import { UserService } from 'src/user/user.service';
import { threadId } from 'worker_threads';
import { CreateSubTodoDto, UpdateSubTodoDto } from './sub-todo.dto';
import { SubTodoService } from './sub-todo.service';

@Controller('sub-todo')
export class SubTodoController {
    constructor(
        private todoService: TodoService,
        private subTodoService: SubTodoService,
        private userService: UserService
    )
    {}

    @Public()
    @Get(':id')
    async getSubTodoById(
        @Request() req,
        @Param() params
    ): Promise<SubTodo> {
        try {
            return await this.subTodoService.getSubTodoById(params.id);
        } catch (e) {
            throw new NotFoundException('Subtodo with this id does not exists!');
        }
    }

    @Public()
    @Get('/todo/:todoId')
    async getSubTodosByTodoId(
        @Request() req,
        @Param() params
    ): Promise<SubTodo[]> {
        try {
            return await this.subTodoService.getSubTodoByTodoId(params.todoId);
        } catch (e) {
            throw new NotFoundException('Todo with this id does not exists!');
        }
    }

    @Post()
    async createSubTodo(
        @Request() req,
        @Body() createSubTodo: CreateSubTodoDto
    ): Promise<SubTodo> {
        const currentUser = await this.userService.getUserByUsername(req.user.username);
        try{
            const parentTodo = await this.todoService.getTodoById(createSubTodo.ParentTodoId);
            if (parentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot ceate sub-todo because todo is not yours');
            }
    
            const data: Prisma.SubTodoCreateInput = {
                todo: {                
                    connect: {
                        id: parentTodo.id,
                    }
                },
                description: createSubTodo.description
            }
            return await this.subTodoService.createSubTodo(data);

        } catch (e) {
            throw new NotFoundException('Did not find a Todo with this ID');
        }
        
    }

    @Put(':id')
    async updateSubTodo(
        @Request() req,
        @Body() updateSubTodoDto: UpdateSubTodoDto,
        @Param() params: {id: string}
    ): Promise<SubTodo> {
        const currentUser = await this.userService.getUserByUsername(req.user.username);
        try{
            const parentTodo = await this.todoService.getTodoById(await (await this.subTodoService.getSubTodoById(params.id)).todo_id);
            if (parentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot complete this todo because it is not yours');
            }

            const where: Prisma.SubTodoWhereUniqueInput = {
                id: params.id
            }

            const data: Prisma.SubTodoUpdateInput = {
                description: updateSubTodoDto.description
            }
            
            return await this.subTodoService.updateSubTodo(where, data);

        } catch (e) {
            throw new NotFoundException('Did not find a sub-todo with this ID');
        }
    }


    @Put('/complete/:id')
    async completeTodo(
        @Request() req,
        @Param() params: {id: string}
    ): Promise<SubTodo> {
        try {
            const currentUser = await this.userService.getUserByUsername(req.user.username);
            const currentSubTodo = await this.subTodoService.getSubTodoById(params.id);
            const currentTodo = await this.todoService.getTodoById(currentSubTodo.todo_id);
            if (currentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot complete this todo because it is not yours');
            }

            return await this.subTodoService.completeSubTodo(params.id);
        } catch (e) {
            throw new NotFoundException('Todo with id does not exists');
        }
    }

    @Put('/decomplete/:id')
    async decompleteTodo(
        @Request() req,
        @Param() params: {id: string}
    ): Promise<SubTodo> {
        try {
            const currentUser = await this.userService.getUserByUsername(req.user.username);
            const currentSubTodo = await this.subTodoService.getSubTodoById(params.id);
            const currentTodo = await this.todoService.getTodoById(currentSubTodo.todo_id);
            if (currentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot decomplete this todo because it is not yours');
            }

            return await this.subTodoService.decompleteSubTodo(params.id);
        } catch (e) {
            throw new NotFoundException('Todo with id does not exists');
        }
    }

    @Delete(':id')
    async deleteSubTodo(
        @Request() req,
        @Param() params: {id: string}
    ): Promise<SubTodo> {
        try {
            const currentUser = await this.userService.getUserByUsername(req.user.username);
            const currentSubTodo = await this.subTodoService.getSubTodoById(params.id);
            const currentTodo = await this.todoService.getTodoById(currentSubTodo.todo_id);
            if (currentTodo.user_id !== currentUser.id){
                throw new ForbiddenException('Cannot delete this task because it is not yours');
            }
            return await this.subTodoService.decompleteSubTodo(params.id);
        } catch (e) {
            throw new NotFoundException('Sub-todo with id does not exists');
        }
    }
}
