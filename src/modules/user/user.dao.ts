import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ddboot/prisma';
import { from, of } from 'rxjs';

@Injectable()
export class UserDao {
  constructor(private readonly prismaService: PrismaService) {}

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
}
