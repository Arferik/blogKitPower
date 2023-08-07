import { Injectable } from '@nestjs/common';
import { ImageDAO } from './images.dao';
import { QueryParam } from '~/models/queryParam.dto';
import { Log4j, Logger } from '@ddboot/log4js';
import { catchError, concatMap, from, map, of } from 'rxjs';
import { unlink } from 'fs/promises';

@Injectable()
export class ImagesService {
  @Log4j()
  private log: Logger;

  constructor(private readonly imageDAO: ImageDAO) {}

  listImg(queryParam: QueryParam, keyWord: string) {
    this.log.info('begin to query list img ');
    this.log.info('get post list, the query Param = ', queryParam);
    return from(this.imageDAO.listImgs(queryParam, keyWord)).pipe(
      map(([data, count]) => {
        this.log.info('end img list');
        return {
          data,
          total: count,
          current: queryParam.current,
          pageSize: queryParam.page_size,
        };
      }),
    );
  }

  /**
   * 提交图片新增地址和名称，此时类别为空
   */
  uploadImage(fileInfo: { filename: string; path: string }) {
    this.log.info('upload post image');
    return from(this.imageDAO.uploadImage(fileInfo)).pipe(
      map((result) => {
        return {
          url: result.url,
          name: result.name,
          id: result.id,
        };
      }),
    );
  }

  batchRemoveImage(ids: string[]) {
    this.log.info('batch remove image');
    return from(ids).pipe(
      concatMap((id) => {
        return this.removeImage(id);
      }),
    );
  }

  removeImage(id: string) {
    this.log.info('remove image');
    return from(this.imageDAO.getImagePathById(id)).pipe(
      concatMap(({ url }) => {
        this.log.info('begin remove image from disk, the image path = ', url);
        return from(unlink(url));
      }),
      catchError((err) => {
        this.log.warn('remove image error, the error = ', err);
        return of({});
      }),
      concatMap(() => {
        this.log.info(
          'end remove success ,begin remove image from db, the image id = ',
          id,
        );
        return from(this.imageDAO.removeImage(id)).pipe(
          map((result) => {
            return {
              id: result.id,
            };
          }),
        );
      }),
    );
  }
}
