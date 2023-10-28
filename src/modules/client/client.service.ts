import {
  BatchDeleteDTO,
  ClientRegisterDTO,
  UpdateAllClientDTO,
} from './client.dto';
import { Log4j, Logger } from '@ddboot/log4js';
import { Injectable } from '@nestjs/common';
import { ClientDAO } from './client.dao';
import { Pbkdf2 } from '@ddboot/secure';
import { randomUUID } from '@ddboot/core';
import { concatMap, from, map, of } from 'rxjs';
import { QueryParam } from '~/models/queryParam.dto';

@Injectable()
export class ClientService {
  @Log4j()
  logger: Logger;

  constructor(private readonly clientDAO: ClientDAO) {}

  /**
   *  添加客户端授权范围
   * @param scopeName
   * @returns
   */
  addClientScope(scopeName: string) {
    return from(
      this.clientDAO.addClientScope({
        scope: scopeName,
      }),
    );
  }

  listScope(clientId: string) {
    if (clientId) {
      return from(this.clientDAO.getScopeByIds(clientId)).pipe(
        map((item) => {
          return item.map((ev) => ev.scope_id);
        }),
      );
    }
    return from(this.clientDAO.listScope());
  }

  addClient(client: ClientRegisterDTO) {
    this.logger.info('begin to register client');
    return of(client).pipe(
      concatMap((item) => {
        return from(
          Pbkdf2.Key(client.client_name + randomUUID(), randomUUID()),
        ).pipe(
          map((clientSecret) => {
            item.client_secret = `ClientSecure_${clientSecret}`;
            return item;
          }),
        );
      }),
      concatMap((item) => {
        return from(this.clientDAO.addClient(item)).pipe(
          concatMap((result) => {
            return from(
              this.clientDAO.updateClientScope(
                result.client_id,
                client.scope_ids,
              ),
            ).pipe(
              map(() => ({
                client_id: result.client_id,
                client_secret: result.client_secret,
              })),
            );
          }),
        );
      }),
    );
  }

  updateClient(client: UpdateAllClientDTO) {
    this.logger.info('begin to register client');
    return this.clientDAO.updateClient(client);
  }

  listClient(queryParam: QueryParam, keyWord: string, id?: string) {
    this.logger.info('begin to query list client ');
    if (id) {
      this.logger.info('[listPost]  id = ', id);
      return from(this.clientDAO.getById(id)).pipe(
        map((item) => {
          return {
            data: item || [],
          };
        }),
      );
    }
    this.logger.info('get client list, the query Param = ', queryParam);
    return from(this.clientDAO.list(queryParam, keyWord)).pipe(
      map(([data, count]) => {
        return {
          data,
          total: count,
          current: queryParam.current,
          pageSize: queryParam.page_size,
        };
      }),
    );
  }

  del(batchDel: BatchDeleteDTO) {
    this.logger.info('begin to delete client');
    this.logger.info('the delete ids = ', batchDel.ids);
    return from(this.clientDAO.delClient(batchDel.ids)).pipe(
      map(() => {
        return {};
      }),
    );
  }
}
