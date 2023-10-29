import { PrismaService } from '~/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthDAO {
  constructor(private readonly prismaService: PrismaService) {}

  getClientById(clientId: string) {
    return this.prismaService.oAuthClientDetails.findUnique({
      select: {
        client_id: true,
        client_secret: true,
        is_locked: true,
        authorized_grant_types: true,
        web_server_redirect_uri: true,
        access_token_validity: true,
        refresh_token_validity: true,
        scopes: {
          select: {
            scope: true,
          },
        },
      },
      where: {
        client_id: clientId,
      },
    });
  }

  getUserByName(name: string) {
    return this.prismaService.user.findFirst({
      where: {
        username: name,
      },
    });
  }
}
