import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { isString } from 'lodash';
import { ExceptionInfo } from '~/interfaces/http-response.interface';
import { NestLoggerService } from '@ddboot/log4js';

/**
 * 过滤异常 http 请求
 * @returns {
 *   error_code: string
 *   error_message: string
 * }
 */
@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(
    httpAdapter: AbstractHttpAdapter<any, any, any>,
    private log: NestLoggerService,
  ) {
    super(httpAdapter);
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const exceptionStatus = exception.getStatus
      ? exception?.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = exception.getResponse
      ? (exception.getResponse() as ExceptionInfo)
      : '';
    const errorMessage = isString(errorResponse)
      ? errorResponse
      : errorResponse.error_message;
    const errorInfo = isString(errorResponse) ? null : errorResponse.error;
    this.log.error(
      errorMessage,
      errorInfo?.stack || exception.stack,
      HttpExceptionFilter.name,
    );

    const data: any = {
      message: errorMessage,
      code:
        errorInfo?.message ||
        (isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
      stack: errorInfo?.stack || exception.stack,
    };
    // default 404
    if (exceptionStatus === HttpStatus.NOT_FOUND) {
      data.error = data.error || `Not found`;
      data.message =
        data.message || `Invalid API: ${request.method} > ${request.url}`;
    }

    return response.status(errorInfo?.status || exceptionStatus).json(data);
  }
}
