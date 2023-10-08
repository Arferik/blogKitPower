import { PrismaService } from '@ddboot/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthDAO {
  constructor(private readonly prismaService: PrismaService) {}

  getClientById(clientId: string) {
    return this.prismaService.oAuthClientDetails.findUnique({
      where: {
        client_id: clientId,
      },
    });
  }
}
