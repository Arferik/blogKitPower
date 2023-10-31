import { Message } from '@ddboot/core';
import { OAuthService } from './oauth.service';
import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('oauth2')
export class OAuthController {
  constructor(private readonly oAuthService: OAuthService) {}

  @Post('token')
  @Message('get token success')
  token(@Req() request: Request) {
    return this.oAuthService.oauthToken(request);
  }
}
