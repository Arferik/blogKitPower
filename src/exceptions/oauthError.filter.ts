import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { NestLoggerService } from '@ddboot/log4js';
import {
  AccessDeniedError,
  InsufficientScopeError,
  InvalidArgumentError,
  InvalidClientError,
  InvalidGrantError,
  InvalidRequestError,
  InvalidScopeError,
  InvalidTokenError,
  OAuthError,
  ServerError,
  UnauthorizedClientError,
  UnauthorizedRequestError,
  UnsupportedGrantTypeError,
  UnsupportedResponseTypeError,
} from '@node-oauth/oauth2-server';

/**
 *  重写 BaseExceptionFilter
 */
@Catch(OAuthError)
export class OAuthErrorExceptionFilter extends BaseExceptionFilter {
  constructor(
    httpAdapter: AbstractHttpAdapter<any, any, any>,
    private log: NestLoggerService,
  ) {
    super(httpAdapter);
  }

  catch(exception: OAuthError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof OAuthError) {
      const message = exception.message;
      const status = HttpStatus.BAD_REQUEST;
      this.log.error(
        '\n OAuthError - ' + message + ' \n',
        'Detail - ' + exception.stack + ' \n',
        OAuthErrorExceptionFilter.name,
      );
      return response.status(status).json({
        message: message,
        code: this.mapErrorCode(exception),
        stack: exception?.stack,
      });
    } else {
      super.catch(exception, host);
    }
  }

  mapErrorCode(exception: OAuthError) {
    switch (true) {
      case exception instanceof AccessDeniedError:
        return 'C40001';
      case exception instanceof InsufficientScopeError:
        return 'C40002';
      case exception instanceof InvalidArgumentError:
        return 'C40003';
      case exception instanceof InvalidClientError:
        return 'C40004';
      case exception instanceof InvalidGrantError:
        return 'C40005';
      case exception instanceof InvalidRequestError:
        return 'C40006';
      case exception instanceof InvalidScopeError:
        return 'C40007';
      case exception instanceof InvalidTokenError:
        return 'C40008';
      case exception instanceof ServerError:
        return 'C40009';
      case exception instanceof UnauthorizedClientError:
        return 'C40010';
      case exception instanceof UnauthorizedRequestError:
        return 'C40011';
      case exception instanceof UnsupportedGrantTypeError:
        return 'C40012';
      case exception instanceof UnsupportedResponseTypeError:
        return 'C40013';
      default:
        return 'C40000';
    }
  }
}
