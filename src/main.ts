import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestLoggerService } from '@ddboot/log4js';
import { PrismaClientExceptionFilter } from '@ddboot/prisma';
import { BaseErrorExceptionFilter, BaseException } from './exceptions';
import { OAuthErrorExceptionFilter } from './exceptions/oauthError.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  const log4jService = app.get(NestLoggerService);
  app.useLogger(log4jService);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        log4jService.error(errors);
        throw new BaseException('T10000');
      },
    }),
  );
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, log4jService),
    new BaseErrorExceptionFilter(httpAdapter, log4jService),
    new OAuthErrorExceptionFilter(httpAdapter, log4jService),
    // new HttpExceptionFilter(httpAdapter, log4jService),
  );
  await app.listen(3000);
}
bootstrap();
