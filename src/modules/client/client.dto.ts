import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ClientRegisterDTO {
  @IsString()
  @Length(2, 30)
  client_name: string;
  type: string;
  @IsString()
  @IsOptional()
  client_id?: string;
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
  scope_ids: string[];
}

export class UpdateAllClientDTO extends ClientRegisterDTO {
  @IsBoolean()
  is_locked: boolean;
}

export class BatchDeleteDTO {
  @IsArray()
  ids: string[];
}

export class ScopeDTO {
  @IsString()
  name: string;
}
