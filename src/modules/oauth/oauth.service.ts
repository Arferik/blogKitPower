import { Log4j, Logger } from '@ddboot/log4js';
import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientCredentialsModel,
  Falsey,
  Token,
  User,
} from '@node-oauth/oauth2-server';

@Injectable()
export class OAuthService implements ClientCredentialsModel {
  @Log4j()
  private log: Logger;

  getUserFromClient(client: Client): Promise<User | Falsey> {
    throw new Error('Method not implemented.');
  }
  validateScope?(
    user: User,
    client: Client,
    scope: string[],
  ): Promise<string[] | Falsey> {
    throw new Error('Method not implemented.');
  }
  generateAccessToken?(
    client: Client,
    user: User,
    scope: string[],
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getClient(clientId: string, clientSecret: string): Promise<Client | Falsey> {
    throw new Error('Method not implemented.');
  }
  saveToken(token: Token, client: Client, user: User): Promise<Falsey | Token> {
    throw new Error('Method not implemented.');
  }
  getAccessToken(accessToken: string): Promise<Falsey | Token> {
    throw new Error('Method not implemented.');
  }
  verifyScope?(token: Token, scope: string[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
