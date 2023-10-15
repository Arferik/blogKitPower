import { JwtService } from '@nestjs/jwt';
import { Log4j, Logger } from '@ddboot/log4js';
import { Inject, Injectable } from '@nestjs/common';
import {
  Client,
  ClientCredentialsModel,
  Falsey,
  PasswordModel,
  Token,
  User,
} from '@node-oauth/oauth2-server';
import { OAuthDAO } from './oauth.dao';
import { Pbkdf2 } from '@ddboot/secure';
import { Value } from '@ddboot/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { md5, randomUUID } from '@ddboot/core';

@Injectable()
export class OAuthModel implements ClientCredentialsModel, PasswordModel {
  @Log4j()
  private log: Logger;

  @Value('crypto.pbk')
  private pbkKey: string;

  constructor(
    private readonly oauthDao: OAuthDAO,
    private readonly jwtService: JwtService,
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
    const checkResult = scope.every(
      (evScope) => client.scopes.indexOf(evScope) >= 0,
    );
    if (!checkResult) {
      return false;
    }
    return scope;
  }
  async generateAccessToken(
    client: Client,
    user: User,
    scope: string[],
  ): Promise<string> {
    this.log.info('begin to generate access token >>>>');
    const accessToken = await this.jwtService.signAsync(
      {
        username: user.userId,
        clientId: client.id,
        scope: scope,
        saveId: client.saveId,
      },
      {
        issuer: 'ddboot',
        expiresIn: client.accessTokenLifetime,
      },
    );
    this.log.info('end to generate access token <<<<<');
    return accessToken;
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
    if (is_locked) {
      this.log.error('client is locked');
      return false;
    }
    const isEqualSecret = await Pbkdf2.Compare(
      clientSecret,
      this.pbkKey,
      client_secret,
    );
    if (!isEqualSecret) {
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
      scopes: clientInfo.scopes.split(',') || [],
      saveId: md5(randomUUID(), clientId),
    };
  }
  async saveToken(
    token: Token,
    client: Client,
    user: User,
  ): Promise<Falsey | Token> {
    this.log.info('begin to save token >>>>');
    await this.cache.set(client.saveId, token, client.accessTokenLifetime || 0);
    this.log.info('end to save token <<<<<');
    return {
      ...token,
      client,
      user,
    };
  }
  async getAccessToken(accessToken: string): Promise<Falsey | Token> {
    this.log.info('begin to get access token >>>>');
    let token: Token;
    try {
      token = await this.jwtService.verifyAsync(accessToken, {
        issuer: 'ddboot',
      });
    } catch (error) {
      this.log.error('error', error);
      return false;
    }

    const { saveId } = token;
    const cacheToken = await this.cache.get<Token>(saveId);
    if (!cacheToken) {
      this.log.error('cache token is not found');
      return false;
    }
    this.log.info('end to get access token <<<<<');
    return cacheToken;
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

  generateRefreshToken?(
    client: Client,
    user: User,
    scope: string[],
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getUser(username: string, password: string): Promise<User | Falsey> {
    throw new Error('Method not implemented.');
  }
}
