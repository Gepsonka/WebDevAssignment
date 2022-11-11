import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core/constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import { SubTodoModule } from './sub-todo/sub-todo.module';

@Module({
  imports: [AuthModule, UserModule, UserModule, ConfigModule.forRoot(), TodoModule, SubTodoModule,],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}



