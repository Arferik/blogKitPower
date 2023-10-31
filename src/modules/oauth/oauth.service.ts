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

  async oauthToken(request: Request, options?: TokenOptions) {
    const token = await this.token(
      new OAURequest(request),
      new OAUResponse({}),
      options,
    );
    return {
      access_token: token.accessToken,
      token_type: 'Bearer',
      expires_in: token.client.accessTokenLifetime,
      refresh_token: token.refreshToken,
    };
  }
}
