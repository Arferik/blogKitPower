import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG, ConfigModule } from '@ddboot/config';
import { LoggerModule } from '@ddboot/log4js';
import { PrismaModule } from '~/prisma';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/posts/post.module';
import { CategoryModule } from './modules/categories/category.module';
import { TagModule } from './modules/tags/tag.module';
import { ImagesModule } from './modules/images/images.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

import {
  HttpLoggerInterceptor,
  ResponseTransformInterceptor,
} from '@ddboot/core';
import { OAuthModule } from './modules/oauth/oauth.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      inject: [CONFIG],
    }),
    PrismaModule.forRootAsync({
      inject: [CONFIG],
    }),
    OAuthModule,
    ClientModule,
    UserModule,
    PostModule,
    CategoryModule,
    TagModule,
    ImagesModule,
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
