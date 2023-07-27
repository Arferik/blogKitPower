import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagDAO } from './tag.dao';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG, ConfigService } from '@ddboot/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.key');
        return {
          secret,
        };
      },
      inject: [CONFIG],
    }),
  ],
  controllers: [TagController],
  providers: [TagService, TagDAO],
})
export class TagModule {}
