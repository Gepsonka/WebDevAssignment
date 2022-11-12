import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Request } from '@nestjs/common';
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
            throw new HttpException({'msg': 'Subtodo with this id does not exists!'}, HttpStatus.NOT_FOUND);
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
            throw new HttpException({'msg': 'Todo with this id does not exists!'}, HttpStatus.NOT_FOUND);
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
                throw new HttpException({'msg': 'Cannot complete this todo because it is not yours'}, HttpStatus.UNAUTHORIZED);
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
            throw new HttpException({'msg': 'Did not find a Todo with this ID'}, HttpStatus.NOT_FOUND);
        }
        
    }

    @Patch(':id')
    async updateSubTodo(
        @Request() req,
        @Body() updateSubTodoDto: UpdateSubTodoDto,
        @Param() params: {id: string}
    ): Promise<SubTodo> {
        const currentUser = await this.userService.getUserByUsername(req.user.username);
        try{
            const parentTodo = await this.todoService.getTodoById(await (await this.subTodoService.getSubTodoById(params.id)).todo_id);
            if (parentTodo.user_id !== currentUser.id){
                throw new HttpException({'msg': 'Cannot complete this todo because it is not yours'}, HttpStatus.UNAUTHORIZED);
            }

            const where: Prisma.SubTodoWhereUniqueInput = {
                id: params.id
            }

            const data: Prisma.SubTodoUpdateInput = {
                description: updateSubTodoDto.description
            }
            
            return await this.subTodoService.updateSubTodo(where, data);

        } catch (e) {
            throw new HttpException({'msg': 'Did not find a sub-todo with this ID'}, HttpStatus.NOT_FOUND);
        }
    }
}
