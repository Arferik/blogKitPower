import { CONFIG, ConfigService, ILogger, LOG_PROVIDER } from '@ddboot/log4js';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImageDAO } from './images.dao';

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
    MulterModule.registerAsync({
      useFactory(config: ConfigService, logger: ILogger) {
        const uploadFile = config.get<string>('assets.base');
        const uploadFileImg = config.get<string>('assets.img.path');
        const fullPath = join(uploadFile, uploadFileImg);
        logger.getLogger('uploadConfig').info('upload File Config =', fullPath);
        return {
          limits: {
            fileSize: 3 * 1024 * 1024, // 3M
          },
          storage: diskStorage({
            destination: fullPath,
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
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImageDAO],
})
export class ImagesModule {}
