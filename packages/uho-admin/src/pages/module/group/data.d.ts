import { Pagination } from '@/data/global.d';

//查询
export interface queryListParams extends Pagination {
  //创建结束时间 - 传毫秒时间戳
 
}

//group table list
export interface GroupItem {
  createTime: number; //创建结束时间 - 传毫秒时间戳
  creator: number; //创建者
  editors: number; //修改者
  groupDesc: string; //组别描述
  groupId: number; //模块id
  groupName: string; //组别名称
  isDeleted: 1 | 0; //逻辑删除 1 表示删除，0 表示未删除
  updateTime: number; //创建开始时间 - 传毫秒时间戳
}

export interface createState {
  groupName: number;
}

export interface updateState {
  groupName: number;
  groupId: number; //模块id
}
