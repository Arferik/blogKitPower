import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG, ConfigModule, ConfigService } from '@ddboot/config';
import { LoggerModule } from '@ddboot/log4js';
import { PrismaModule } from '@ddboot/prisma';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/posts/post.module';
import { CategoryModule } from './modules/categories/category.module';
import { TagModule } from './modules/tags/tag.module';
import { ImagesModule } from './modules/images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  HttpLoggerInterceptor,
  ResponseTransformInterceptor,
} from '@ddboot/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ServeStaticModule.forRootAsync({
      inject: [CONFIG],
      useFactory(config: ConfigService) {
        return [
          {
            rootPath: config.get<string>('assets.base'),
          },
        ];
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class AppModule {}
