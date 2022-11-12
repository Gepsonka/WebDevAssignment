import { Module } from '@nestjs/common';
import { AutocorrectService } from './autocorrect.service';
import { AutocorrectController } from './autocorrect.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AutocorrectService, PrismaService],
  controllers: [AutocorrectController]
})
export class AutocorrectModule {}
