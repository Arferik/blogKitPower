import { IsString, Length } from 'class-validator';

export class TagDTO {
  @IsString()
  @Length(2, 30)
  name: string;
}

export class UpdateTagDTO extends TagDTO {
  @IsString()
  id: string;
}
