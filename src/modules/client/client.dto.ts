import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ClientRegisterDTO {
  @IsString()
  @Length(2, 30)
  name: string;
  type: string;
  client_id?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  scopes?: string;
  @IsArray()
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
