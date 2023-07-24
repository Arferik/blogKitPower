import { Log4j, Logger } from '@ddboot/log4js';
import { PostDao } from './post.dao';
import { Injectable } from '@nestjs/common';
import { QueryParam } from '~/models/queryParam.dto';
import { from, map } from 'rxjs';

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
            data: item,
          };
        }),
      );
    }
    this.log.info('[listPost]  queryParam = ', queryParam);
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
}
