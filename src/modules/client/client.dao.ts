import { PaginationParam, PrismaHelper, PrismaService } from '@ddboot/prisma';
import { Injectable } from '@nestjs/common';
import { ClientRegisterDTO, UpdateAllClientDTO } from './client.dto';
import { Log4j, Logger } from '@ddboot/log4js';
import { OAuthClientScope, OAuthTerminal } from '@prisma/client';

@Injectable()
export class ClientDAO {
  @Log4j()
  logger: Logger;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  addClient(client: ClientRegisterDTO) {
    return this.prismaService.oAuthTerminal.create({
      data: {
        name: client.name,
        type: client.type,
        description: client.description,
        OAuthClientDetails: {
          create: {
            client_id: client.client_id,
            client_secret: client.client_secret,
            additional_information: '',
            authorized_grant_types: client.authorized_grant_types,
            web_server_redirect_uri: client.web_server_redirect_uri,
            access_token_validity: client.access_token_validity,
            refresh_token_validity: client.refresh_token_validity,
          },
        },
      },
      select: {
        OAuthClientDetails: {
          select: {
            client_id: true,
            client_secret: true,
          },
        },
      },
    });
  }

  addClientScope(clientScope: Pick<OAuthClientScope, 'scope'>) {
    return this.prismaService.oAuthClientScope.create({
      data: {
        ...clientScope,
      },
      select: {
        id: true,
      },
    });
  }

  updateClientScope(clientId: string, scopeIds: string[]) {
    return this.prismaService.oAuthClientOnScope.createMany({
      data: scopeIds.map((scopeId) => ({
        client_id: clientId,
        scope_id: scopeId,
      })),
    });
  }

  updateClient(client: UpdateAllClientDTO) {
    return this.prismaService.oAuthTerminal.update({
      data: {
        name: client.name,
        type: client.type,
        OAuthClientDetails: {
          connect: {
            client_id: client.client_id,
            authorized_grant_types: client.authorized_grant_types,
            web_server_redirect_uri: client.web_server_redirect_uri,
            access_token_validity: client.access_token_validity,
            refresh_token_validity: client.refresh_token_validity,
          },
        },
      },
      where: {
        id: client.id,
      },
      select: {
        id: true,
      },
    });
  }

  list(pagination: PaginationParam, keyWord?: string) {
    const containName = this.prismaHelper.likeQuery<OAuthTerminal>(
      keyWord,
      'name',
    );
    const pageParams = this.prismaHelper.paginationParams(pagination);
    this.logger.debug('call client ,pageParams', pageParams);
    const data = this.prismaService.oAuthTerminal.findMany({
      ...pageParams,
      select: {
        id: true,
        name: true,
        engine: true,
        modified_at: true,
        is_locked: true,
        is_online: true,
        created_at: true,
        type: true,
        os: true,
      },
      where: {
        ...containName,
      },
    });
    const count = this.prismaService.oAuthTerminal.count({
      where: {
        ...containName,
      },
    });
    return this.prismaService.$transaction([data, count]);
  }

  getById(id: string) {
    return this.prismaService.oAuthTerminal.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        engine: true,
        modified_at: true,
        is_locked: true,
        is_online: true,
        created_at: true,
        type: true,
        os: true,
        OAuthClientDetails: {
          select: {
            client_id: true,
            client_secret: true,
            scopes: true,
            authorized_grant_types: true,
            web_server_redirect_uri: true,
            access_token_validity: true,
            refresh_token_validity: true,
          },
        },
      },
    });
  }

  del(delId: string[]) {
    const batchResult = this.prismaService.oAuthClientOnScope.deleteMany({
      where: {
        client_id: {
          in: delId,
        },
      },
    });
    const batchResultClient = this.prismaService.oAuthClientDetails.deleteMany({
      where: {
        client_id: {
          in: delId,
        },
      },
    });
    return this.prismaService.$transaction([batchResult, batchResultClient]);
  }
}
