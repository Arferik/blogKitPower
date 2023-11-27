import { Global, Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { OAuthDAO } from './oauth.dao';
import { OAuthModel } from './oauth.model';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CONFIG, ConfigService } from '@ddboot/config';
import { Aes256CBC } from '@ddboot/secure';
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [CONFIG],
      useFactory: async (config: ConfigService) => {
        const redis = config.get<any>('redis');
        if (
          redis.password === undefined ||
          redis.password === null ||
          redis.password === ''
        ) {
          return {
            store: await redisStore({
              url: `redis://${redis.host}:${redis.port}`,
            }),
          };
        }
        const originPass = Aes256CBC.Decrypt(
          redis.password,
          config.get('crypto.saltKey', ''),
        );
        let url = `redis://:${originPass}@${redis.host},
        )}:${redis.port}`;
        if (redis.user) {
          url = `redis://${redis.user}:${originPass}@${redis.host},
          )}:${redis.port}`;
        }

        return {
          store: await redisStore({
            url: url,
          }),
        };
      },
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService, OAuthDAO, OAuthModel],
  exports: [OAuthService],
})
@Global()
export class OAuthModule {}
