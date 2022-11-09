import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';


export interface User

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(){

    }

    async findOne(username: string): Promise<User | null>{
        return this.prisma.user.findFirst({
            where: {
                username: username
            }
        })
    }
}
