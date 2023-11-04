import { Injectable } from '@nestjs/common';
import { Log4j, Logger } from '@ddboot/log4js';
import { UserDao } from '~/modules/user/user.dao';
import { concatMap, from, map } from 'rxjs';
import { Value } from '@ddboot/config';
import { Pbkdf2 } from '@ddboot/secure';
import { QueryParam } from '~/models/queryParam.dto';
import { UpdateUserDTO, UserDto } from './user.dto';

@Injectable()
export class UserService {
  @Log4j()
  private logger: Logger;

  @Value('crypto.pbk')
  private pbkKey: string;

  constructor(private readonly userDao: UserDao) {}

  listUser(
    queryParam: QueryParam,
    keyWord: string,
    user: Partial<UserDto> = null,
  ) {
    if (user.id) {
      this.logger.info('get User by id');
      return from(this.userDao.getUserById(user.id)).pipe(
        map((item) => {
          return {
            data: item || {},
          };
        }),
      );
    }
    if (user.email) {
      this.logger.info('get User by email');
      return from(this.userDao.getUserByEmail(user.email)).pipe(
        map((item) => {
          return {
            data: item || {},
          };
        }),
      );
    }
    if (user.username) {
      this.logger.info('get User by username');
      return from(this.userDao.getUserByName(user.username)).pipe(
        map((item) => {
          return {
            data: item || {},
          };
        }),
      );
    }
    this.logger.info('get User list');
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

  createUser(user: UserDto) {
    return from(Pbkdf2.Key(user.password, this.pbkKey)).pipe(
      concatMap((pbk) => {
        return this.userDao
          .createUser$({
            ...user,
            password: pbk,
          })
          .pipe(
            map(() => {
              return {};
            }),
          );
      }),
    );
  }
}
