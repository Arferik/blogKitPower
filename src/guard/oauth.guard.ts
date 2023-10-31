import { ILogger, InjectLogger, Logger } from '@ddboot/log4js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Request as OAuRequest,
  Response as OAuResponse,
} from '@node-oauth/oauth2-server';
import { OAuthScope } from '~/decorator/oauth-scope.decorator';
import { OAuthService } from '~/modules/oauth/oauth.service';

@Injectable()
export class OAuthGuard implements CanActivate {
  private logger: Logger;

  constructor(
    private readonly oAuthService: OAuthService,
    @InjectLogger() private readonly log: ILogger,
    private readonly reflector: Reflector,
  ) {
    this.logger = this.log.getLogger(OAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const oAuthScope = this.reflector.get(OAuthScope, context.getHandler());
    this.logger.debug('Begin to check oauth token');

    const token = await this.oAuthService.authenticate(
      new OAuRequest(request),
      new OAuResponse({}),
      {
        scope: oAuthScope,
      },
    );

    request['user'] = token.user;
    this.logger.debug('End to check oauth token', token.user.username);
    return true;
  }
}
