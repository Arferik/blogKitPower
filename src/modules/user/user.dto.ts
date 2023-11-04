import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  id: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  email: string;

  @IsBoolean()
  @IsOptional()
  is_locked: boolean;

  @IsBoolean()
  @IsOptional()
  enable: boolean;
}

export class UpdateUserDTO extends UserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  id: string;

  @IsBoolean()
  is_locked: boolean;

  @IsBoolean()
  enable: boolean;
}
