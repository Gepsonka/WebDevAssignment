import { Module } from '@nestjs/common';
import { SubTodoService } from './sub-todo.service';

@Module({
  providers: [SubTodoService]
})
export class SubTodoModule {}
