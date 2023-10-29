//src/prisma-client-exception.filter.ts

import { NestLoggerService } from '@ddboot/log4js';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(
    httpAdapter: AbstractHttpAdapter<any, any, any>,
    private log: NestLoggerService,
  ) {
    super(httpAdapter);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    if (exception.code) {
      const status = HttpStatus.CONFLICT;
      this.log.error(
        'Error Message is [ ' + message + ' ] \n',
        'Detail [ ' + exception.stack + ' ] \n',
        PrismaClientExceptionFilter.name,
      );
      return response.status(status).json({
        code: exception.code,
        message: message,
        stack: exception.stack,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
