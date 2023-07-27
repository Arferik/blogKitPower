import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDao } from './post.dao';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';
import { diskStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@ddboot/log4js';
import { CONFIG } from '@ddboot/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.key');
        return {
          secret,
        };
      },
      inject: [CONFIG],
    }),
    // MulterModule.register({
    //   storage: diskStorage({
    //     // destination: join(__dirname, '../images'),
    //     destination: join('./public/uploaded'),
    //     filename: (_, file, callback) => {
    //       const fileName = `${
    //         new Date().getTime() + extname(file.originalname)
    //       }`;
    //       return callback(null, fileName);
    //     },
    //   }),
    // }),
  ],
  controllers: [PostController],
  providers: [PostService, PostDao],
})
export class PostModule {}
