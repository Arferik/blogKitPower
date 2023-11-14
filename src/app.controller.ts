import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { OAuthGuard } from './guard/oauth.guard';
import { OAuthScope } from './decorator/oauth-scope.decorator';
import { Message } from '@ddboot/core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(OAuthGuard)
  @OAuthScope(['read'])
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Message('get server health')
  getHealth(): string {
    return 'OK';
  }
}
