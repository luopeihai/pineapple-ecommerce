import { Pagination } from '../global.d';

export interface queryListParams extends Pagination {
  createEndDate?: number; //创建结束时间 - 传毫秒时间戳
  createStartDate?: number; //创建开始时间 - 传毫秒时间戳
  groupName?: string; //游戏名称
}

export interface GroupItem {
  createTime: number; //创建结束时间 - 传毫秒时间戳
  creator: number; //创建者
  editors: number; //修改者
  groupDesc: string; //组别描述
  groupId: number; //	组别id
  groupName: string; //	组别名称
  updateTime: number; //创建开始时间 - 传毫秒时间戳
}
