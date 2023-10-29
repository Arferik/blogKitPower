import { Injectable } from '@nestjs/common';
import { PaginationParam, PrismaHelper, PrismaService } from '~/prisma';
import { from, of } from 'rxjs';
import { User } from '@prisma/client';
import { Log4j, Logger } from '@ddboot/log4js';
import { UpdateUserDTO } from './user.dto';

@Injectable()
export class UserDao {
  @Log4j()
  private log: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  getUserByName$(name: string) {
    if (name === 'admin') {
      return of({
        id: 'admin_a',
        username: 'admin',
        password: 'admin',
      });
    }
    return from(
      this.prismaService.user.findFirst({
        where: {
          username: name,
        },
      }),
    );
  }

  /**
   *  用户列表
   * @param pagination
   * @param keyWord
   * @returns
   */
  listUser(pagination: PaginationParam, keyWord?: string) {
    const containName = this.prismaHelper.likeQuery<User>(keyWord, 'username');
    const pageParams = this.prismaHelper.paginationParams(pagination);
    this.log.debug('call listPost ,pageParams', pageParams);
    const data = this.prismaService.user.findMany({
      ...pageParams,
      select: {
        id: true,
        username: true,
        created_at: true,
        modified_at: true,
        is_locked: true,
        enable: true,
      },
      where: {
        ...containName,
      },
    });
    const count = this.prismaService.user.count({
      where: {
        ...containName,
      },
    });
    return this.prismaService.$transaction([data, count]);
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        is_locked: true,
        enable: true,
        created_at: true,
        modified_at: true,
      },
    });
  }

  updateUser(userUpdate: UpdateUserDTO) {
    return this.prismaService.user.update({
      data: {
        is_locked: userUpdate.is_locked,
        enable: userUpdate.enable,
      },
      where: {
        id: userUpdate.id,
      },
    });
  }

  createUser$(name: string, password: string) {
    return from(
      this.prismaService.user.create({
        data: {
          username: name,
          password: password,
        },
      }),
    );
  }

  delBatchById(delId: string[]) {
    return this.prismaService.$transaction([
      this.prismaService.user.deleteMany({
        where: {
          id: {
            in: delId,
          },
        },
      }),
      this.prismaService.userOnTerminal.deleteMany({
        where: {
          user_id: {
            in: delId,
          },
        },
      }),
    ]);
  }
}
