import { Pagination } from '../global.d';

//查询
export interface queryListParams extends Pagination {
  createEndDate?: number; //创建结束时间 - 传毫秒时间戳
  createStartDate?: number; //创建开始时间 - 传毫秒时间戳
  groupId?: number; //分组id
  moduleName?: string; //游戏名称
}

//game table list
export interface GameItem {
  createTime: number; //创建结束时间 - 传毫秒时间戳
  creator: number; //创建者
  editors: number; //修改者
  groupName: String[]; //组别名称
  isDeleted: 1 | 0; //逻辑删除 1 表示删除，0 表示未删除
  moduleDesc: string; //模块描述
  moduleId: number; //模块id
  moduleImage: string; // 模块背景图片
  moduleName: string; // 模块名称
  moduleSort: number; // 排序 越大越靠前
  updateTime: number; //创建开始时间 - 传毫秒时间戳
  manageImage: string; //		管理图片		string
}

//game edit sort
export interface EditSortState {
  sort: number; // 排序
  moduleId: number; //游戏id
}

//game add state
export interface CreateState {
  moduleImage: string; //	模块背景图片	string
  moduleName: string; //	模块名称		string
  manageImage: string; //		管理图片		string
}

//game update state
export interface UpdateState {
  moduleImage: string; //	模块背景图片	string
  moduleName: string; //	模块名称		string
  manageImage: string; //		管理图片		string
  moduleId: number; //	模块id
}

//查询
export interface queryGroupListByModuleIdParams {
  groupId?: number; //分组id
  moduleId: number; //游戏id
}

//game in group table list
export interface GroupItem {
  createTime: number; //创建结束时间 - 传毫秒时间戳
  creator: number; //创建者
  editors: number; //修改者
  groupDesc: string; //组别描述
  groupId: number; //模块id
  groupName: string; //组别名称
  isDeleted: 1 | 0; //逻辑删除 1 表示删除，0 表示未删除
  questionCount: number; //问题数目
  linkSort: number; //排序 越大
  updateTime: number; //创建开始时间 - 传毫秒时间戳
}

//game group create
export interface createGroupState {
  groupId?: number; //分组id
  moduleId: number; //游戏id
}

//game in group edit sort
export interface EditGroupSortState {
  sort: number; // 排序
  moduleGroupId: number; //游戏id
}
