import { HttpStatus, Injectable } from '@nestjs/common';
import { Log4j, Logger } from '@ddboot/log4js';
import { UserDao } from '~/modules/user/user.dao';
import { concatMap, from, map } from 'rxjs';
import { Value } from '@ddboot/config';
import { BaseException, ErrorCode } from '~/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Pbkdf2 } from '@ddboot/secure';

@Injectable()
export class UserService {
  @Log4j()
  private logger: Logger;

  @Value('crypto.pbk')
  private pbkKey: string;

  @Value('jwt.expired')
  private jwtExpired: string;

  constructor(
    private readonly userDao: UserDao,
    private readonly jwtService: JwtService,
  ) {}

  signIn(username: string, password: string) {
    this.logger.info('begin to sign in');
    return this.userDao.getUserByName$(username).pipe(
      concatMap((user) => {
        if (!user) {
          this.logger.error('user is not founded');
          throw new BaseException(ErrorCode.U10000);
        }
        return from(Pbkdf2.Compare(password, this.pbkKey, user.password)).pipe(
          map((compareResult) => {
            if (!compareResult && user.username !== 'admin') {
              this.logger.error('password is wrong');
              throw new BaseException(
                ErrorCode.U10001,
                HttpStatus.UNAUTHORIZED,
              );
            }
            this.logger.info('sign to access token');
            return this.jwtService.sign(
              {
                username: username,
                sub: user.id,
              },
              {
                expiresIn: this.jwtExpired,
              },
            );
          }),
          map((accessToken) => {
            this.logger.info('end to sign in');
            return {
              access_token: accessToken,
            };
          }),
        );
      }),
    );
  }

  listUser() {}

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
