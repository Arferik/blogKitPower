import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
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
