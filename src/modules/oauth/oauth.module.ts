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
        const originPass = Aes256CBC.Decrypt(
          config.get('redis.password'),
          config.get('crypto.saltKey', ''),
        );

        let url = `redis://:${originPass}@${config.get(
          'redis.host',
        )}:${config.get('redis.port')}`;
        const redisUser = config.get('redis.user');
        if (redisUser) {
          url = `redis://${redisUser}:${originPass}@${config.get(
            'redis.host',
          )}:${config.get('redis.port')}`;
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
