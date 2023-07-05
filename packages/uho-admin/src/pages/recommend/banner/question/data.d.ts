import { Pagination } from '@/data/global.d';

// 获取banner下的问题
export interface queryListParams extends Pagination {
  acceptStatus?: number; // -1:关闭问题 0:未采纳 1:系统采纳 2:题主采纳;

  bannerId?: number; // bannerId;

  createEndDate?: string; // 创建结束时间 - 传毫秒时间戳;

  createStartDate?: string; // 创建开始时间 - 传毫秒时间戳;

  leftFocusNum?: number; // 关注数检索-左;

  moduleGroupId?: number; // 分组id;

  moduleId?: number; // 模块id;

  questionId?: number; // 问题id;

  questionerId?: number; // 提问者id;

  reviewStatus?: number; // 是否已审核 0未审核 1已审核;

  rightFocusNum?: number; // 关注数检索-右;

  sortType?: number; // 排序类型 1.正序(从小到大) 2.倒序;

  title?: string; // 标题;
}

// undefined
export interface row {
  acceptStatus: number; // -1:关闭问题 0:未采纳 1:系统采纳 2:题主采纳 ;

  answerNum: number; // 回答数 ;

  avatar: string; // 头像 ;

  awardInTime: boolean; // 是否有及时奖 ;

  bonusNum: number; // 悬赏金 ;

  createTime: string; // 创建时间 ;

  focusNum: number; // 关注数 ;

  hasBand: boolean; // 提问者是否被禁言 -- 只有详情才封装，列表不封装该字段 ;

  images: string; // 内容包含的图片集合 ;

  includeMultimediaText: string; // 纯文字内容(去除富文本标签但包含图片视频文字占位表示) ;

  isDeleted: boolean; // 逻辑删除 1 表示删除，0 表示未删除 ;

  isTop: boolean; // 是否已置顶 1.已置顶 0.未置顶 ;

  mainId: number; // 当前列表数据主id 例:banner问题列表 表示 banner-问题关联关系id ;

  moduleGroupId: number; // 分组id ;

  moduleId: number; // 模块id ;

  originalHtml: string; // 原始富文本内容 ;

  questionId: number; // 问题id ;

  questionSort: number; // 问题排序数字 ;

  questionerId: number; // 提问者id ;

  questionerName: string; // 提问者名称 ;

  recommend: boolean; // 该问题是否被推荐 -- 只有详情才封装，列表不封装该字段 ;

  reviewStatus: number; // 是否已审核 0未审核 1已审核 ;

  title: string; // 标题 ;

  updateTime: string; // 更新时间 ;

  videos: string; // 内容包含的视频集合 ;

  wordText: string; // 纯文字内容(去除富文本标签及图片视频) ;
}

// 新增banner下的问题
export interface createParams {
  bannerId?: number; // bannerId;

  questionId?: number; // questionId;
}

// 删除banner下的问题
export interface deleteParams {
  bannerId: number; // bannerId

  mainId: number; // mainId
}
