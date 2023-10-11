import { IsArray, IsNumber, IsString } from 'class-validator';

export class ClientRegisterDTO {
  @IsString()
  name: string;
  @IsString()
  type: string;
  @IsString()
  engine: string;
  @IsString()
  os: string;
  client_id?: string;
  @IsString()
  scopes?: string;
  @IsString()
  authorized_grant_types: string;
  @IsString()
  web_server_redirect_uri: string;
  @IsNumber()
  access_token_validity?: number;
  @IsNumber()
  refresh_token_validity?: number;

  client_secret?: string;
}

export class UpdateAllClientDTO extends ClientRegisterDTO {
  @IsString()
  id: string;
}

export class BatchDeleteDTO {
  @IsArray()
  ids: string[];
}
