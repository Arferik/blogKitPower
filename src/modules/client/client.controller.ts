import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BatchDeleteDTO,
  ClientRegisterDTO,
  ScopeDTO,
  UpdateAllClientDTO,
} from './client.dto';
import { ClientService } from './client.service';
import { Message, Pagination } from '@ddboot/core';
import { QueryParam } from '~/models/queryParam.dto';
import { OAuthGuard } from '~/guard/oauth.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Message('register client success')
  @UseGuards(OAuthGuard)
  addClient(@Body() client: ClientRegisterDTO) {
    return this.clientService.addClient(client);
  }

  @Post('scope')
  @Message('add client scope success')
  @UseGuards(OAuthGuard)
  addClientScope(@Body() scope: ScopeDTO) {
    return this.clientService.addClientScope(scope.name);
  }

  @Message('get scope list success')
  @UseGuards(OAuthGuard)
  @Get('scope')
  listScope(@Query('client_id') client_id: string) {
    return this.clientService.listScope(client_id);
  }

  @Put()
  @Message('update client success')
  @UseGuards(OAuthGuard)
  update(@Body() client: UpdateAllClientDTO) {
    return this.clientService.updateClient(client);
  }

  @Message('get client list success')
  @Pagination()
  @UseGuards(OAuthGuard)
  @Get()
  listPost(
    @Query() queryParam: QueryParam,
    @Query('name') clientName: string,
    @Query('id') id: string,
  ) {
    return this.clientService.listClient(queryParam, clientName, id);
  }

  @Delete()
  @UseGuards(OAuthGuard)
  @Message('delete client success')
  del(@Body() delId: BatchDeleteDTO) {
    return this.clientService.del(delId);
  }
}
