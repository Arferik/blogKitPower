import { Injectable } from '@nestjs/common';
import { Log4j, Logger } from '@ddboot/log4js';
import { UserDao } from '~/modules/user/user.dao';
import { concatMap, from, map } from 'rxjs';
import { Value } from '@ddboot/config';
import { Pbkdf2 } from '@ddboot/secure';
import { QueryParam } from '~/models/queryParam.dto';
import { UpdateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  @Log4j()
  private logger: Logger;

  @Value('crypto.pbk')
  private pbkKey: string;

  constructor(private readonly userDao: UserDao) {}

  listUser(queryParam: QueryParam, keyWord: string, id?: string) {
    this.logger.info('get User list');
    if (id) {
      return from(this.userDao.getUserById(id)).pipe(
        map((item) => {
          return {
            data: item || [],
          };
        }),
      );
    }
    return from(this.userDao.listUser(queryParam, keyWord)).pipe(
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

  delBatchById({ ids }: { ids: string[] }) {
    return from(this.userDao.delBatchById(ids)).pipe(
      map(() => {
        return {};
      }),
    );
  }

  updateUser(userInfo: UpdateUserDTO) {
    return from(this.userDao.updateUser(userInfo)).pipe(
      map(() => {
        return {};
      }),
    );
  }

  createUser(username: string, password: string) {
    return from(Pbkdf2.Key(password, this.pbkKey)).pipe(
      concatMap((pbk) => {
        return this.userDao.createUser$(username, pbk).pipe(
          map(() => {
            return {};
          }),
        );
      }),
    );
  }
}
