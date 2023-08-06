import { Log4j, Logger } from '@ddboot/log4js';
import { PostDao } from './post.dao';
import { Injectable } from '@nestjs/common';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';
import { concatMap, from, map } from 'rxjs';
import { PostDTO, PostReleaseDTO } from './post.dto';
import { BaseException, ErrorCode } from '~/exceptions';

@Injectable()
export class PostService {
  @Log4j()
  private log: Logger;
  constructor(private readonly postDao: PostDao) {}

  listPost(queryParam: QueryParam, keyWord: string, id?: string) {
    this.log.info('begin to query list post ');
    if (id) {
      this.log.info('[listPost]  id = ', id);
      return from(this.postDao.getPostDetailById(id)).pipe(
        map((item) => {
          return {
            data: item || [],
          };
        }),
      );
    }
    this.log.info('get post list, the query Param = ', queryParam);
    return from(this.postDao.listPost(queryParam, keyWord)).pipe(
      map(([data, count]) => {
        return {
          data,
          total: count,
          current: queryParam.current,
          pageSize: queryParam.pageSize,
        };
      }),
    );
  }

  addPost(postDTO: PostDTO) {
    this.log.info('begin add post');
    this.log.debug('add post param = ', postDTO);
    return from(this.postDao.addPost(postDTO)).pipe(
      concatMap((result) => {
        if (!result.id) {
          this.log.error('add post failed');
          throw new BaseException(ErrorCode.P10000);
        }
        const postId = result.id;
        this.log.info('add post success, then add post on tag');
        return from(this.postDao.addPostTag(postId, postDTO.tag_ids)).pipe(
          concatMap(() => {
            this.log.info('add post on tag success, then update image info');
            return from(this.postDao.updatePostImage(postDTO, postId));
          }),
          map(() => {
            return {
              id: postId,
            };
          }),
        );
      }),
    );
  }

  releasePost(postDTO: PostReleaseDTO) {
    this.log.info('update release status', postDTO.is_release);
    return from(this.postDao.releasePost(postDTO)).pipe(
      map(() => {
        return {
          id: postDTO.id,
        };
      }),
    );
  }

  del(batchDel: BatchDeleteDTO) {
    this.log.info('begin to delete post');
    this.log.info('the delete ids = ', batchDel.ids);
    return from(this.postDao.del(batchDel.ids)).pipe(
      map(() => {
        return {};
      }),
    );
  }
}
