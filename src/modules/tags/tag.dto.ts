import { Post } from '@prisma/client';
import { IsString, Length } from 'class-validator';

export class TagDTO {
  @IsString()
  @Length(10, 30)
  name: string;
}

export class UpdateTagDTO extends TagDTO {
  @IsString()
  id: string;
}
