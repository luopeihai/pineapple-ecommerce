import { Pagination } from '@/data/global.d';

export interface QuestionTableListItem {
  acceptStatus: -1 | 0 | 1 | 2; //	-1:关闭问题 0:未采纳 1:系统采纳 2:题主采纳	integer(int32)
  answerNum: number; // 回答数	integer(int32)
  awardInTime: boolean; //	是否有及时奖	boolean
  bonusNum: number; // 悬赏金	integer(int32)
  createTime: string; //	创建时间	string(date-time)
  focusNum: number; // 关注数	integer(int32)
  images: string; //	内容包含的图片集合	string
  includeMultimediaText: string; //	纯文字内容(去除富文本标签但包含图片视频文字占位表示)	string
  isDeleted: boolean; //	逻辑删除 1 表示删除，0 表示未删除	boolean
  moduleGroupId: number; //	分组id	integer(int64)
  moduleId: number; //	模块id	integer(int64)
  originalHtml: string; //	原始富文本内容	string
  questionId: number; //	问题id	integer(int64)
  questionerId: number; //	提问者id	integer(int64)
  questionerName: string; // 提问者姓名
  reviewStatus: number; //	是否已审核 0未审核 1已审核	integer(int32)
  title: string; // 标题	string
  updateTime: string; //	更新时间	string(date-time)
  videos: string; //	内容包含的视频集合	string
  wordText: string; //	纯文字内容(去除富文本标签及图片视频)	string
  isTop: boolean; // 是否已置顶
}

export interface TableListPagination extends Pagination {
  orderType: 1; //1.创建时间倒序 2.创建时间正序
}

export interface QuestionTableListParams extends TableListPagination {
  acceptStatus?: -1 | 0 | 1 | 2; // -1:关闭问题 0:未采纳 1:系统采纳 2:题主采纳
  createEndDate?: number; //创建结束时间 - 传毫秒时间戳
  createStartDate?: number; //创建开始时间 - 传毫秒时间戳
  moduleGroupId?: number; //分组id
  moduleId?: number; //模块id
  questionId?: number; //问题Id
  questionerId?: number; //问题创建人Id
  reviewStatus?: 0 | 1; //是否已审核 0未审核 1已审核
  title?: string; //标题
  leftFocusNum?: number; //	关注数检索-左
  rightFocusNum?: number; //	关注数检索-右
}

export interface editParams {
  questionId: number;
  sort: number;
}
