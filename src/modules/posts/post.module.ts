import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDao } from './post.dao';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PostDao],
})
export class PostModule {}
