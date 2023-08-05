import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { BaseException } from '../exceptions/base.exception';
import { ErrorCode } from './base.code';
import { NestLoggerService } from '@ddboot/log4js';

/**
 *  重写 BaseExceptionFilter
 */
@Catch(BaseException)
export class BaseErrorExceptionFilter extends BaseExceptionFilter {
  constructor(
    httpAdapter: AbstractHttpAdapter<any, any, any>,
    private log: NestLoggerService,
  ) {
    super(httpAdapter);
  }
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (ErrorCode[exception.message]) {
      const message = ErrorCode[exception.message];
      const status = HttpStatus.BAD_REQUEST;
      this.log.error(
        '\n Message -' + message + ' \n',
        'Detail - ' + exception.stack + ' \n',
        BaseErrorExceptionFilter.name,
      );
      return response.status(status).json({
        message: message,
        code: exception.message,
        stack: exception?.stack,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
