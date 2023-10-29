import { Observable } from 'rxjs';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';

// 定义增删改查的接口
export interface ICurl<T, P> {
  list(
    queryParam: QueryParam,
    keyWord: string,
    id?: string,
  ): Observable<any> | Promise<any>;

  post(addDTO: T):
    | Observable<{
        id: string;
      }>
    | Promise<{ id: string }>;

  put(updateDTO: P): Observable<{
    id: string;
  }>;

  batchDel(batchDel: BatchDeleteDTO): Promise<object> | Observable<object>;
}
