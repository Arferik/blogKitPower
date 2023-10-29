import { Global, Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { OAuthDAO } from './oauth.dao';
import { OAuthModel } from './oauth.model';

@Module({
  imports: [],
  controllers: [OAuthController],
  providers: [OAuthService, OAuthDAO, OAuthModel],
  exports: [OAuthService],
})
@Global()
export class OAuthModule {}
