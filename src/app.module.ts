import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG, ConfigModule } from '@ddboot/config';
import { LoggerModule } from '@ddboot/log4js';
import { PrismaModule } from '@ddboot/prisma';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/posts/post.module';
import { CategoryModule } from './modules/categories/category.module';
import { TagModule } from './modules/tags/tag.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    LoggerModule.forRootAsync({
      inject: [CONFIG],
    }),
    PrismaModule.forRootAsync({
      inject: [CONFIG],
    }),
    UserModule,
    PostModule,
    CategoryModule,
    TagModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
