import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDao } from './post.dao';

@Module({
  controllers: [PostController],
  providers: [PostService, PostDao],
})
export class PostModule {}
