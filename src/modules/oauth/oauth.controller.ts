import { OAuthService } from './oauth.service';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('oauth2')
export class OAuthController {
  constructor(private readonly oAuthService: OAuthService) {}

  @Post('token')
  token(@Req() request: Request, @Res() response: Response) {
    return this.oAuthService.oauthToken(request, response);
  }
}
