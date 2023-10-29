import { Module } from '@nestjs/common';
import { ClientDAO } from './client.dao';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

@Module({
  imports: [],
  providers: [ClientDAO, ClientService],
  controllers: [ClientController],
  exports: [],
})
export class ClientModule {}
