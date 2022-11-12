import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubTodoService } from './sub-todo.service';
import { SubTodoController } from './sub-todo.controller';
import { UserService } from 'src/user/user.service';
import { TodoService } from 'src/todo/todo.service';

@Module({
  providers: [SubTodoService, PrismaService, UserService, TodoService],
  controllers: [SubTodoController]
})
export class SubTodoModule {}
