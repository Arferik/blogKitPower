import { ILogger, InjectLogger, Logger } from '@ddboot/log4js';
import {
  INestApplication,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  PrismaPerformanceLogMiddleware,
  PrismaUpdateOptionMiddleware,
} from './prisma.middleware';
import { PRISMA_OPTIONS } from './prisma.constant';
import { Aes256CBC } from '@ddboot/secure';
import { Value } from '@ddboot/config';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'error' | 'beforeExit'
  >
  implements OnModuleInit
{
  private readonly LOG: Logger;
  private logList: any;
  private logListFlag: boolean;

  @Value('crypto.saltKey')
  private saltKey: string;

  constructor(
    @Inject(PRISMA_OPTIONS) private readonly database: any,
    @InjectLogger() private readonly logger: ILogger,
  ) {
    super({
      log: [{ emit: 'event', level: 'query' }],
      errorFormat: 'colorless',
    });

    this.LOG = this.logger.getLogger(PrismaService.name);
  }

  initDataBase() {
    process.env.DATABASE_URL = this.generateDatabaseUrl(this.database);
  }

  async onModuleInit() {
    this.initDataBase();
    this.LOG.debug('db connect url =', process.env.DATABASE_URL);
    await this.$connect();
    const performanceMiddleware = PrismaPerformanceLogMiddleware(this.LOG);
    this.$use(PrismaUpdateOptionMiddleware);
    this.$use(performanceMiddleware);
    this.$on('query', ({ query }) => this.toLogger({ query }));
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  generateDatabaseUrl(dataBase: any) {
    const { host, user, password, type, port, database } = dataBase;
    //将加密的密码解密
    const originPass = Aes256CBC.Decrypt(password, this.saltKey);
    if (type === 'postgresql') {
      return `postgresql://${user}:${originPass}@${host}:${port}/${database}?schema=public`;
    }
    if (type === 'mysql') {
      return `mysql://${user}:${originPass}@${host}:${port}/${database}`;
    }
    return `file:./${database}`;
  }

  toLogger({ query }) {
    if (query === 'BEGIN') {
      this.logList = [];
      this.logListFlag = true;
    }
    if (!this.logListFlag) {
      this.LOG.debug('[prisma:query]  ', query);
    } else {
      this.logList.push(query);
    }
    if (query === 'COMMIT') {
      this.logListFlag = false;
      this.LOG.debug('[prisma:query]', this.logList);
    }
  }
}
