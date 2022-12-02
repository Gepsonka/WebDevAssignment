import { Body, Controller, Request , Get, Param, Patch, Post, HttpException, HttpStatus, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User, User as UserModel } from '@prisma/client';
import { Public } from 'src/public.provider';
import { CreateUserDto, UpdateUserDto } from './user.dto';


  

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService, 
    )
    {}

    @Public()
    @Post()
    async createUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<any> {
        if (await this.userService.getUserByEmail(createUserDto.email) !== null){
            throw new BadRequestException("User with this email is already registered!");
        }

        if (await this.userService.getUserByUsername(createUserDto.username) !== null){
            throw new BadRequestException("User with username already exists!")
        }

        const newUser = await this.userService.createUser({
            username: createUserDto.username,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            email: createUserDto.email,
            password_hash: createUserDto.password // hashed in user.service
        });

        delete newUser.password_hash;
        return newUser;
    }

    @Public()
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserModel | {message: string}> {
        try{
            const user = await this.userService.getUserById(id);
            if (user === null) {
                return new NotFoundException("User with id does not exists!")
            }
            delete user.password_hash;
            return user;
        } catch (e) {
            console.log(e)
            return new BadRequestException("Bad requset!")
        }
        
    }

    @Patch()
    async updateUser(
        @Request() req,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const where: Prisma.UserWhereUniqueInput = {username: req.user.username};

        const data: Prisma.UserUpdateInput = updateUserDto
        try{
            const user = await this.userService.updateUser({where, data});
            delete user.password_hash;

            return user;
        } catch (e) {
            
        }
        
        
    }

    @Delete()
    async deleteUser(
        @Request() req,
    ): Promise<User> {
        const where = {username: req.user.username}

        return await this.userService.deleteUser(where);
    }

    
}
