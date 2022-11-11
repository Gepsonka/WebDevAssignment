import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';
const bcrypt = require('bcrypt');


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(data: Prisma.UserCreateInput): Promise<User>{
        data.password_hash = bcrypt.hashSync(data.password_hash, 10);
        console.log(data.password_hash)
        
        return this.prisma.user.create({
            data,
        });
    }

    async getUserById(id: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                id: id
            }
        })
    }

    async getUserByUsername(username: string): Promise<User | null>{
        return this.prisma.user.findFirst({
            where: {
                username: username
            }
        })
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                email: email
            }
        })
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User | null> {
        if (params.data.password_hash !== undefined){
            params.data.password_hash = await bcrypt.hash(params.data.password_hash, process.env.HASH_ROUNDS);
        }
        return this.prisma.user.update({
            where: params.where,
            data: params.data
        })
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.delete({
            where: where
        })
    }

    async deleteUserById(id: string): Promise<User | null> {
        return this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async searchUsersByUsername(username: string): Promise<Prisma.JsonObject | null> {
        return this.prisma.user.aggregateRaw({
            pipeline:[
                {
                    "$search": {
                        "compound": {
                            'must': [
                                {
                                    'text': username,
                                    'path': ['username']
                                }
                            ]
                        }
                    }
                }
            ]
        })
    }

    
}
