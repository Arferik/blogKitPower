import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDao } from './post.dao';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@ddboot/log4js';
import { CONFIG } from '@ddboot/config';

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
  controllers: [PostController],
  providers: [PostService, PostDao],
})
export class PostModule {}
