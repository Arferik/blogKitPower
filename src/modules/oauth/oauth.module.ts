import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { OAuthDAO } from './oauth.dao';
import { OAuthModel } from './oauth.model';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG, ConfigService } from '@ddboot/config';

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
  ],
  controllers: [OAuthController],
  providers: [OAuthService, OAuthDAO, OAuthModel],
  exports: [OAuthService],
})
export class OAuthModule {}
