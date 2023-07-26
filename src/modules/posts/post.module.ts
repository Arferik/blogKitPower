import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDao } from './post.dao';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
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
