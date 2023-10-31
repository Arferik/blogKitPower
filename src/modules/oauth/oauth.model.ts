import { Log4j, Logger } from '@ddboot/log4js';
import { Inject, Injectable } from '@nestjs/common';
import {
  Client,
  ClientCredentialsModel,
  Falsey,
  PasswordModel,
  RefreshToken,
  RefreshTokenModel,
  Token,
  User,
} from '@node-oauth/oauth2-server';
import { OAuthDAO } from './oauth.dao';
import { Pbkdf2 } from '@ddboot/secure';
import { Value } from '@ddboot/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { randomUUID } from '@ddboot/core';

@Injectable()
export class OAuthModel
  implements ClientCredentialsModel, PasswordModel, RefreshTokenModel
{
  @Log4j()
  private log: Logger;

  @Value('crypto.pbk')
  private pbkKey: string;

  constructor(
    private readonly oauthDao: OAuthDAO,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async getUserFromClient(client: Client): Promise<User | Falsey> {
    this.log.info(
      'begin to get user info by client , client id is %s >>>>',
      client.id,
    );

    this.log.info('end to get user info by client <<<<<');
    return {
      userId: 'client_credentials_userId',
    };
  }
  async validateScope(
    user: User,
    client: Client,
    scope: string[],
  ): Promise<Falsey | string[]> {
    this.log.info('begin to validate scope >>>>');
    this.log.info(
      'user = %s',
      user,
      'client.scope = ',
      client.scopes,
      'scope =',
      scope,
    );
    if (!scope) {
      this.log.error('scope is empty');
      return false;
    }
    const checkResult = scope.every(
      (evScope) => client.scopes.indexOf(evScope) >= 0,
    );
    if (!checkResult) {
      return false;
    }
    this.log.info('end to validate scope <<<<<');
    return scope;
  }

  async generateAccessToken(
    client: Client,
    user: User,
    scope: string[],
  ): Promise<string> {
    this.log.info('begin to generate access token >>>>');
    const originKey = `${client.id}_${user.userId}_${scope.join(',')}`;
    const accessToken = await Pbkdf2.Key(originKey, randomUUID());
    this.log.info('end to generate access token <<<<<');
    return `Secure_${accessToken}`;
  }

  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<Client | Falsey> {
    this.log.info('begin to get client info by clientId and clientSecret >>>>');
    const clientInfo = await this.oauthDao.getClientById(clientId);
    if (!clientInfo) {
      this.log.error('client info not found');
      return false;
    }
    const { client_secret, is_locked } = clientInfo;
    this.log.debug('client info', clientInfo);
    if (is_locked) {
      this.log.error('client is locked');
      return false;
    }
    if (client_secret !== clientSecret) {
      this.log.error('client secret not match');
      return false;
    }
    this.log.info('end to get client info by clientId and clientSecret <<<<<');
    return {
      id: clientId,
      grants: clientInfo.authorized_grant_types.split(',') || [],
      redirectUris: clientInfo.web_server_redirect_uri.split(',') || [],
      accessTokenLifetime: clientInfo.access_token_validity,
      refreshTokenLifetime: clientInfo.refresh_token_validity,
      scopes: clientInfo.scopes.map((item) => item.scope.scope),
    };
  }

  async saveToken(
    token: Token,
    client: Client,
    user: User,
  ): Promise<Falsey | Token> {
    this.log.info('begin to save token >>>>');
    const accessToken = {
      ...token,
      client,
      user,
    };
    await this.cache.set(
      `oauth:access:${token.accessToken}`,
      accessToken,
      client.accessTokenLifetime * 1000 || 0,
    );
    this.log.debug('accessTokenLifetime = %s', client.accessTokenLifetime);
    await this.cache.set('oauth:token:client', client.id);
    if (token.refreshToken) {
      this.log.info('begin save refresh token');
      await this.cache.set(
        `oauth:refresh:${token.refreshToken}`,
        accessToken,
        client.refreshTokenLifetime * 1000 || 0,
      );
      this.log.debug('refreshTokenLifetime = %s', client.refreshTokenLifetime);
      this.log.info('end save refresh token');
    }

    this.log.info('end to save token <<<<<');
    return {
      ...token,
      client,
      user,
    };
  }

  async getAccessToken(accessToken: string): Promise<Falsey | Token> {
    this.log.info('begin to get access token >>>>');
    const dbAccessToken = (await this.cache.get(
      `oauth:access:${accessToken}`,
    )) as Token;
    if (!dbAccessToken) {
      this.log.error('access token is not found');
      return false;
    }
    this.log.info('end to get access token <<<<<', dbAccessToken);
    return dbAccessToken;
  }

  async verifyScope(token: Token, scope: string[]): Promise<boolean> {
    this.log.info('begin to verify scope >>>>');
    this.log.debug('token = %s , scope = %s', token, scope);
    if (!token.scope) {
      this.log.info('token scope is empty');
      return false;
    }
    this.log.info(
      'authorizedScopes = %s,requestedScopes = %s',
      token.scope,
      scope,
    );
    return scope.every((s) => token.scope.indexOf(s) >= 0);
  }

  async generateRefreshToken(
    client: Client,
    user: User,
    scope: string[],
  ): Promise<string> {
    this.log.info('begin to generate access token >>>>');
    const originKey = `${client.id}_${user.userId}_${scope.join(',')}`;
    const accessToken = await Pbkdf2.Key(originKey, randomUUID());
    this.log.info('end to generate access token <<<<<');
    return `Secure_${accessToken}`;
  }

  async getUser(username: string, password: string): Promise<User | Falsey> {
    const userInfo = await this.oauthDao.getUserByName(username);
    if (!userInfo) {
      this.log.error('user not found');
      return false;
    }
    const isEqualPassword = await Pbkdf2.Compare(
      password,
      this.pbkKey,
      userInfo.password,
    );
    if (!isEqualPassword) {
      this.log.error('password not match');
      return false;
    }
    if (userInfo.is_locked) {
      this.log.error('user is locked');
      return false;
    }
    return {
      userId: userInfo.id,
      username: userInfo.username,
    };
  }

  async getRefreshToken(refreshToken: string): Promise<Falsey | RefreshToken> {
    this.log.info('begin to get refresh token >>>>');
    const dbAccessToken = (await this.cache.get(
      `oauth:refresh:${refreshToken}`,
    )) as RefreshToken;
    if (!dbAccessToken) {
      this.log.error('refresh token is not found');
      return false;
    }
    this.log.info('end to get refresh token <<<<<');
    return dbAccessToken;
  }

  async revokeToken(token: Token | RefreshToken): Promise<boolean> {
    this.log.info('begin to revoke token >>>>');
    this.log.debug('token = %s', token);
    await this.cache.del(`oauth:access:${token.accessToken}`);
    await this.cache.del(`oauth:refresh:${token.refreshToken}`);
    this.log.info('end to revoke token <<<<<');

    return true;
  }
}
