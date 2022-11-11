import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  providers: [UserService, PrismaService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
  },],
  exports: [UserService],
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule) ]
})
export class UserModule {}
