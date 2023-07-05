import request from '@/utils/request';
import { queryListParams } from '@/data/group.d';

/**
 *
 * @param params 查询参数
 * @return Promise
 */
export async function queryGroup(params: queryListParams): Promise<any> {
  return request('/config/group', { params }).then((res) => ({
    data: res.data.list,
    page: res.data.pageSize,
    success: res.code === 200,
    total: res.data.total,
  }));
}
