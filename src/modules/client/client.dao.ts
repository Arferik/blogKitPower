import { PaginationParam, PrismaHelper, PrismaService } from '~/prisma';
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
    return this.prismaService.oAuthClientDetails.create({
      data: {
        client_name: client.client_name,
        additional_information: '',
        client_secret: client.client_secret,
        authorized_grant_types: client.authorized_grant_types,
        web_server_redirect_uri: client.web_server_redirect_uri,
        access_token_validity: client.access_token_validity,
        refresh_token_validity: client.refresh_token_validity,
      },
      select: {
        client_id: true,
        client_secret: true,
      },
    });
  }

  listScope() {
    return this.prismaService.oAuthClientScope.findMany({});
  }

  getScopeByIds(client_id: string) {
    return this.prismaService.oAuthClientOnScope.findMany({
      where: {
        client_id: client_id,
      },
      select: {
        scope_id: true,
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
    const delClientScope = this.delClientScope(client.client_id);
    const updateClientScope = this.updateClientScope(
      client.client_id,
      client.scope_ids,
    );
    const updateClient = this.prismaService.oAuthClientDetails.update({
      data: {
        client_name: client.client_name,
        is_locked: client.is_locked,
        authorized_grant_types: client.authorized_grant_types,
        web_server_redirect_uri: client.web_server_redirect_uri,
        access_token_validity: client.access_token_validity,
        refresh_token_validity: client.refresh_token_validity,
      },
      where: {
        client_id: client.client_id,
      },
      select: {
        client_id: true,
      },
    });
    return this.prismaService.$transaction([
      delClientScope,
      updateClientScope,
      updateClient,
    ]);
  }

  list(pagination: PaginationParam, keyWord?: string) {
    const containName = this.prismaHelper.likeQuery<OAuthTerminal>(
      keyWord,
      'name',
    );
    const pageParams = this.prismaHelper.paginationParams(pagination);
    this.logger.debug('call client ,pageParams', pageParams);
    const data = this.prismaService.oAuthClientDetails.findMany({
      ...pageParams,
      select: {
        client_id: true,
        modified_at: true,
        is_locked: true,
        created_at: true,
        client_name: true,
        web_server_redirect_uri: true,
        authorized_grant_types: true,
        access_token_validity: true,
        refresh_token_validity: true,
        OAuthTerminal: {
          select: {
            id: true,
            is_online: true,
          },
        },
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
    return this.prismaService.oAuthClientDetails.findUnique({
      where: {
        client_id: id,
      },
      select: {
        client_id: true,
        client_name: true,
        authorized_grant_types: true,
        web_server_redirect_uri: true,
        access_token_validity: true,
        refresh_token_validity: true,
        modified_at: true,
        is_locked: true,
        client_secret: true,
        created_at: true,
        scopes: {
          select: {
            scope: true,
          },
        },
        OAuthTerminal: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  delClientScope(clientId: string) {
    return this.prismaService.oAuthClientOnScope.deleteMany({
      where: {
        client_id: clientId,
      },
    });
  }

  delClient(delId: string[]) {
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
