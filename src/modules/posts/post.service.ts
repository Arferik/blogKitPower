import { Log4j, Logger } from '@ddboot/log4js';
import { PostDao } from './post.dao';
import { Injectable } from '@nestjs/common';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';
import { Observable, concatMap, from, map, of } from 'rxjs';
import { AddPostDTO, PostReleaseDTO, UpdatePostDTO } from './post.dto';
import { BaseException, ErrorCode } from '~/exceptions';
import { ICurl } from '~/interfaces';

@Injectable()
export class PostService implements ICurl<AddPostDTO, UpdatePostDTO> {
  @Log4j()
  private log: Logger;
  constructor(private readonly postDao: PostDao) {}
  list(
    queryParam: QueryParam,
    keyWord: string,
    id?: string,
  ): Observable<any> | Promise<any> {
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
          pageSize: queryParam.page_size,
        };
      }),
    );
  }

  post(
    addDTO: AddPostDTO,
  ): Observable<{ id: string }> | Promise<{ id: string }> {
    this.log.info('begin add post');
    this.log.debug('add post param = ', addDTO);
    return from(this.postDao.addPost(addDTO)).pipe(
      concatMap((result) => {
        if (!result.id) {
          this.log.error('add post failed');
          throw new BaseException(ErrorCode.P10000);
        }
        const postId = result.id;
        return from(this.postDao.addPostTag(postId, addDTO.tag_ids)).pipe(
          concatMap(() => {
            const postImage = addDTO.images.filter((item) => item.id);
            if (postImage.length === 0) {
              this.log.info('add post on tag success, but no image');
              return of({});
            }
            this.log.info('add post on tag success, then update image info');
            return from(this.postDao.updatePostImage(addDTO, postId));
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

  put(updateDTO: UpdatePostDTO): Observable<{ id: string }> {
    return from(this.postDao.updatePost(updateDTO)).pipe(
      map(() => ({
        id: updateDTO.id,
      })),
    );
  }

  batchDel(batchDel: BatchDeleteDTO): Promise<object> | Observable<object> {
    this.log.info('begin to delete post');
    this.log.info('the delete ids = ', batchDel.ids);
    return from(this.postDao.batchDel(batchDel.ids)).pipe(
      map(() => {
        return {};
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

  latestPost() {
    this.log.info('begin to get latest post');
    return from(this.postDao.latestPost()).pipe(
      map((postResult) => {
        return postResult.map((post) => ({
          ...post,
          cover: post.images[0]?.url || '',
          tags: post.tags.map((tag) => tag.tag.name),
        }));
      }),
    );
  }
}
