import { IsArray, IsBoolean, IsEnum, IsString, Length } from 'class-validator';

export class ImageDTO {
  @IsString()
  id: string;
  @IsEnum(['COVER', 'AVATAR', 'POST'])
  type: 'COVER' | 'AVATAR' | 'POST';
}

export class PostDTO {
  @IsString()
  @Length(10, 30)
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsArray({
    each: true,
  })
  images: ImageDTO[];

  @IsString()
  category_id: string;

  @IsArray({
    each: true,
  })
  tag_ids: string[];

  @IsBoolean()
  is_release: boolean;
}

export class PostReleaseDTO {
  @IsString()
  id: string;

  @IsBoolean()
  is_release: boolean;
}

export class CategoryDTO {
  @IsString()
  @Length(10, 30)
  name: string;
}

export class Tag extends CategoryDTO {}

export class updateCategoryDTO extends CategoryDTO {
  @IsString()
  id: string;
}

export class updateTagDTO extends CategoryDTO {
  @IsString()
  id: string;
}
