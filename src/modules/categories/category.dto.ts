import { IsString, Length } from 'class-validator';

export class CategoryDTO {
  @IsString()
  @Length(2, 30)
  name: string;
}

export class Tag extends CategoryDTO {}

export class updateCategoryDTO extends CategoryDTO {
  @IsString()
  id: string;
}
