import { Body, Controller, createParamDecorator,Request ,forwardRef, Get, Inject, Param, Patch, Post, Put, RawBodyRequest, Req, UseGuards, ExecutionContext } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User as UserModel } from '@prisma/client';
import { Public } from 'src/public.provider';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';



  

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService, 
        private authService: AuthService
    )
    {}

    @Public()
    @Post()
    async createUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<any> {
        try{
            const newUser = await this.userService.createUser({
                username: createUserDto.username,
                first_name: createUserDto.first_name,
                last_name: createUserDto.last_name,
                email: createUserDto.email,
                password_hash: createUserDto.password // hashed in user.service
            })

            delete newUser.password_hash;
            return newUser;
        } catch(e) {
            console.log(e)
            return {msg: 'error occurred'}
        }
    }

    @Public()
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserModel> {
        const user = await this.userService.getUserById(id);
        delete user.password_hash;
        return user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    updatUser(
        @Request() req,
        @Body() postData: {
            username?: string,
            first_name?: string,
            last_name?: string,
            email?: string,
            password?: string
        },
    ) {
        console.log(req.user)
        return req.user
    }



}
