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
  authorized_grant_types: string;
  @IsString()
  @IsOptional()
  web_server_redirect_uri: string;
  @IsNumber()
  @IsOptional()
  access_token_validity?: number;
  @IsNumber()
  @IsOptional()
  refresh_token_validity?: number;
  client_secret?: string;
  @IsArray()
  scopes: string[];
}

export class UpdateAllClientDTO extends ClientRegisterDTO {
  @IsString()
  id: string;
}

export class BatchDeleteDTO {
  @IsArray()
  ids: string[];
}
