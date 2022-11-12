import { Controller, Get, Param, Request } from '@nestjs/common';
import { User } from '@prisma/client';
import { Public } from 'src/public.provider';
import { AutocorrectService } from './autocorrect.service';

@Controller('autocorrect')
export class AutocorrectController {
    constructor(private autocorrectService: AutocorrectService){}

    @Public()
    @Get(':searchText')
    async getAutocorrectForUsername(
        @Request() res,
        @Param() params: {searchText: string}
    ): Promise<User> {
        return await this.autocorrectService.userSuggestions(params.searchText);
    }
}
