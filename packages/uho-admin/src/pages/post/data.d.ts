import { Pagination } from '@/data/global.d';

export interface QuestionTableListItem {
  acceptStatus: -1 | 0 | 1 | 2; //	-1:关闭问题 0:未采纳 1:系统采纳 2:题主采纳	integer(int32)
  answerNum: number; //回答数	integer(int32)
  awardInTime: boolean; //	是否有及时奖	boolean
  bonusNum: number; //悬赏金	integer(int32)
  createTime: string; //	创建时间	string(date-time)
  focusNum: number; //关注数	integer(int32)
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
  title: string; //标题	string
  updateTime: string; //	更新时间	string(date-time)
  videos: string; //	内容包含的视频集合	string
  wordText: string; //	纯文字内容(去除富文本标签及图片视频)	string
  isTop: boolean; //是否已置顶
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

export interface AnswerTableListParams extends TableListPagination {
  answerId?: number; //回答id
  answererId?: number; //	回答者id
  createEndDate?: string; //	创建结束时间
  createStartDate?: string; //	创建开始时间 - 传毫秒时间戳
  moduleGroupId?: number; //分组id
  moduleId?: number; //	模块id
  orderType?: number; //排序规则 1.创建时间倒序 2.创建时间正序
  questionId?: number; //	问题id
  reviewStatus?: number; //	是否已审核 0未审核 1已审核
  title?: string; //	问题标题
  wordText?: string; //	xx内容
  leftLikeNum?: number; //	点赞数检索-左
  rightLikeNum?: number; //	点赞数检索-右
}

export interface AnswerTableListItem {
  acceptStatus: number; //	0:未采纳 1:系统采纳 2:题主采纳
  answerId: number; //
  answererId: number; //	回答者id
  answererName: string; //	回答者名称
  avatar: string; //	回答者头像
  commentNum: number; //	评论数
  createTime: string; //	创建时间
  focusNum: number; //关注数
  images: string; //	内容包含的图片集合
  includeMultimediaText: string; //纯文字内容(去除富文本标签但包含图片视频文字占位表示)
  isDeleted: boolean; //逻辑删除 1 表示删除，0 表示未删除
  likeNum: number; //	点赞数
  moduleGroupId: number; //	分组id
  moduleId: number; //	模块id
  originalHtml: string; //	原始富文本内容
  questionId: number; //	问题id
  likeNum: number; //点赞数
  questionIncludeMultimediaText: string; //	问题纯文字内容(去除富文本标签但包含图片视频文字占位表示)
  questionTitle: string; //		问题标题
  questionerId: number; //	提问者id
  reviewStatus: number; //	是否已审核 0未审核 1已审核
  updateTime: string; //		更新时间
  videos: string; //		内容包含的视频集合
  wordText: string; //		纯文字内容(去除富文本标签及图片视频)
}

export interface CommentTableListItem {
  answerId: number; //	回答id
  answerIncludeMultimediaText: string; //	答案纯文字内容(去除富文本标签但包含图片视频文字占位表示)
  answererId: number; //	回答者id
  commentId: number; // 	评论Id
  commentText: string; //	评论内容
  createTime: string; //	创建时间
  isDeleted: boolean; //	逻辑删除 1 表示删除，0 表示未删除
  moduleGroupId: number; //	分组id
  moduleId: number; //	模块id
  parentId: number; //	父级评论id(没有传0)
  questionId: number; //	问题id
  questionTitle: string; //	问题标题
  questionerId: number; //	提问者id
  replayCommentId: number; // 	回复的评论id(没有传0)
  replayCommentReviewerAvatar: string; //	回复的评论,其评论者头像
  replayCommentReviewerId: number; //	回复的评论,其评论者id
  replayCommentReviewerName: string; // 回复的评论,其评论者名称
  reviewStatus: number; //	是否已审核 0未审核 1已审核
  reviewerAvatar: string; //	评论者头像
  reviewerId: number; //	评论者id
  reviewerName: string; //	评论者名称
  updateTime: string; //	更新时间
}

export interface CommentTableListParams extends TableListPagination {
  answerId?: number; //	回答id
  commentText?: string; //	评论内容
  createEndDate?: string; //	创建结束时间 - 传毫秒时间戳
  createStartDate?: string; //	创建开始时间 - 传毫秒时间戳
  moduleGroupId?: number; //	分组id
  moduleId?: number; //	模块id
  orderType?: number; //	排序规则 1.创建时间倒序 2.创建时间正序
  pageNum?: number; //	页码 默认为1
  pageSize?: number; //	每页条数 默认为20
  questionId?: number; //	问题id
  reviewStatus?: number; //	是否已审核 0未审核 1已审核
  reviewerId?: string; //	评论者id
  title?: string; // 问题标题
  token?: string; // 登录凭证(选填)
  wordText?: string; //	xx内容
}
