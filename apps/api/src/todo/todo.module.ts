import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TodoService, PrismaService, UserService, AuthService, JwtService],
  controllers: [TodoController],
  imports: [forwardRef(() => AuthModule) ]
})
export class TodoModule {}
