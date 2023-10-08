import { Injectable } from '@nestjs/common';
import {
  Request as OAURequest,
  Response as OAUResponse,
  TokenOptions,
} from '@node-oauth/oauth2-server';
import { OAuthModel } from './oauth.model';
import { Request, Response } from 'express';
import * as OAuth2Server from '@node-oauth/oauth2-server';

@Injectable()
export class OAuthService extends OAuth2Server {
  constructor(oauthModel: OAuthModel) {
    super({
      model: oauthModel,
      allowExtendedTokenAttributes: true,
    });
  }

  async oauthToken(
    request: Request,
    response: Response,
    options?: TokenOptions,
  ) {
    const token = await this.token(
      new OAURequest(request),
      new OAUResponse(response),
      options,
    );
    return response
      .json({
        access_token: token.accessToken,
        token_type: token.tokenType,
        expires_in: token.accessTokenExpiresAt,
        refresh_token: token.refreshToken,
        scope: token.scope,
      })
      .status(200);
  }
}
