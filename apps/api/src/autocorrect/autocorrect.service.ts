import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AutocorrectService {
    constructor(private prisma: PrismaService){}

    async userSuggestions(searchText: string): Promise<User> {
        // @ts-ignore
        return this.prisma.user.aggregateRaw({
            pipeline: [
                {
                    $search: {
                        index: 'UserSearchWebDev',
                        "autocomplete": {
                          "path": "username",
                          "query": searchText
                        }
                    }
                }
            ]
        })
    }

}
