import { PrismaService } from '@ddboot/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientDAO {
  constructor(private readonly prismaService: PrismaService) {}
}
