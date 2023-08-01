import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDao } from './post.dao';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ILogger, LOG_PROVIDER } from '@ddboot/log4js';
import { CONFIG } from '@ddboot/config';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory(config: ConfigService, logger: ILogger) {
        const uploadFileConfig = config.get<string>('upload.imageDestPath');
        logger
          .getLogger('uploadConfig')
          .info('upload File Config =', uploadFileConfig);
        return {
          storage: diskStorage({
            destination: join(uploadFileConfig),
            filename: (_, file, callback) => {
              const fileName = `${
                new Date().getTime() + extname(file.originalname)
              }`;
              return callback(null, fileName);
            },
          }),
        };
      },
      inject: [CONFIG, LOG_PROVIDER],
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
