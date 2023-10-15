import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG, ConfigModule, ConfigService } from '@ddboot/config';
import { LOG_PROVIDER, LoggerModule, ILogger } from '@ddboot/log4js';
import { PrismaModule } from '@ddboot/prisma';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/posts/post.module';
import { CategoryModule } from './modules/categories/category.module';
import { TagModule } from './modules/tags/tag.module';
import { ImagesModule } from './modules/images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
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
    CacheModule.register({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      inject: [CONFIG, LOG_PROVIDER],
      async useFactory(config: ConfigService, logger: ILogger) {
        logger.getLogger(CacheModule.name).info('begin to init cache module');
        if (!config.get<string>('redis.host')) {
          logger
            .getLogger(CacheModule.name)
            .info('redis host is not configed, use memory store');
          return {
            store: 'memory',
            isGlobal: true,
          };
        }
        logger
          .getLogger(CacheModule.name)
          .info('redis host is configed, use redis store');
        return {
          store: redisStore,
          isGlobal: true,
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        };
      },
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
