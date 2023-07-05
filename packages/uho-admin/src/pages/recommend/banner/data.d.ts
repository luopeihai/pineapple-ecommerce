import { Pagination } from '@/data/global.d';

//条件查询banner列表
export interface queryListParams extends Pagination {
  bannerSortType?: number; // 1.正序 2.倒序;

  bannerTitle?: string; // banner 标题;

  createEndDate?: string; // 创建结束时间 - 传毫秒时间戳;

  createStartDate?: string; // 创建开始时间 - 传毫秒时间戳;

  leftQuestionNum?: number; // banner 中包含的问题数;

  moduleId?: number; // 模块id;

  rightQuestionNum?: number; // banner 中包含的问题数;
}

//配置-banner信息
export interface row {
  bannerDesc: string; // banner 描述 ;

  bannerId: number; // banner id ;

  bannerImage: string; // banner 展示图片 ;

  bannerSort: number; // 排序 越大越靠前 ;

  bannerTitle: string; // banner 标题 ;

  createTime: string; // 创建时间 ;

  creator: number; // 创建者 ;

  editors: number; // 修改者 ;

  isDeleted: boolean; // 逻辑删除 1 表示删除，0 表示未删除 ;

  manageIcon: string; // banner 图标 ;

  moduleId: number; // 模块id ;

  questionNum: number; // banner 中包含的问题数 ;

  updateTime: string; // 更新时间 ;
}

// 新增banner下的问题
export interface createParams {
  bannerDesc: string; // banner 描述

  bannerImage: string; // banner 展示图片

  bannerTitle: string; // banner 标题

  manageIcon: string; // banner 图标

  moduleId: number; // 模块id
}

// 修改banner
export interface updateParams {
  bannerDesc: string; // banner 描述

  bannerId: number; // banner id

  bannerImage: string; // banner 展示图片

  bannerSort: number; // 排序 越大越靠前

  bannerTitle: string; // banner 标题

  manageIcon: string; // banner 图标

  moduleId: number; // 模块id
}

// 删除banner下的问题
export interface deleteParams {
  bannerId: number; // bannerId

  mainId: number; // mainId
}

export interface updateBannerSortParams {
  bannerId: number; // bannerId
  sort: number;
  moduleId: number;
}
