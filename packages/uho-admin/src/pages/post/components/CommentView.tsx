import React from 'react';
import { Row, Col, message, Avatar, Button, Modal } from 'antd';

import PageInnerLoading from '@/components/PageInnerLoading';
import { queryComment, commentDeleted } from '../service';

import UserBand from '@/components/UserBand';
import CommentForm from './CommentForm';
import moment from 'moment';
import style from './CommentView.less';

//state 类型
interface state {
  loading: boolean; // 搜索
}

// props 类型
interface props {
  answerId?: number; //答案ID
  commentId?: number; //评论ID 为评论详情进入才具有
  questionId?: number; //问题ID
}

class CommentView extends React.Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      createModalVisible: false, //评论弹出框
      parentId: 0, //一级评论的id
      replayCommentId: 0, //回复评论的id
      questionId: 0, //问题id
      answerId: 0, //回答id
      pageNum: 1,
      pageSize: 10,
      pageMore: true,
    };
  }

  //默认 defaultProps
  static defaultProps = {};

  componentDidMount() {
    const { commentId, answerId } = this.props;

    const _this = this;
    if (commentId) {
      //为评论详情进入
      //为评论详情进入 需要加载第一条
      queryComment({ commentId, pageName: 1, pageSize: 1 }).then((response) => {
        _this.setState(
          {
            data: response.data,
          },
          () => {
            _this.fetchData();
          },
        );
      });
    } else {
      this.fetchData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createCommentByAnswerModalVisible) {
      //回答
      this.onComment(nextProps.createCommentByAnswer);
    }
  }

  //获取 问题
  fetchData = () => {
    const { answerId, commentId } = this.props;
    const { pageNum, pageSize, data } = this.state;
    this.setState({
      loading: true,
    });

    //commentId 存在说明是评论进入
    //pageNum =1 为首次载入
    //data 为空
    if (commentId && data.length === 0) {
      //首先需要去请求评论数据
      queryComment({ commentId, pageName: 1, pageSize: 1 }).then((response) => {
        this.setState(
          {
            data: response.data,
          },
          () => {
            this.fetchData();
          },
        );
      });
    } else {
      queryComment({ answerId, pageNum, pageSize })
        .then((response) => {
          const responseData = response.data.filter((item) => item.commentId !== commentId);

          this.setState({
            data: [...data, ...responseData],
            loading: false,
            pageNum: pageNum + 1,
            pageMore: response.total > pageSize * pageNum,
          });
        })
        .catch((errs) => {
          message.error(errs.message);
        });
    }
  };

  //问题删除
  handleRemove = (commentId) => {
    // const hide = message.loading('正在操作');

    const _this = this;
    commentDeleted(commentId)
      .then(function (response) {
        // hide();
        if (response.data.result) {
          message.success('删除成功');
          _this.setState(
            {
              pageNum: 1,
              data: [],
            },
            () => {
              _this.fetchData();
            },
          );
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        // hide();
        message.error(error.message);
      });
  };

  //回答点击的评论
  onComment(item) {
    this.setState({
      createModalVisible: true,
      parentId: item.parentId, //一级评论的id
      replayCommentId: item.replayCommentId, //回复评论的id
      questionId: item.questionId, //问题id
      answerId: item.answerId, //回答id
    });
  }

  //从列表 点击的评论
  onListComment = (item) => {
    if (item.parentId !== 0) {
      //有一级评论
      this.setState({
        createModalVisible: true,
        parentId: item.parentId, //一级评论的id
        replayCommentId: item.commentId, //回复评论的id
        questionId: item.questionId, //问题id
        answerId: item.answerId, //回答id
      });
    } else {
      //为评论第一条
      this.setState({
        createModalVisible: true,
        parentId: item.commentId, //一级评论的id
        replayCommentId: item.commentId, //回复评论的id
        questionId: item.questionId, //问题id
        answerId: item.answerId, //回答id
      });
    }
  };

  _renderComment = () => {
    const { data, pageMore } = this.state;
    return (
      <div className={style.answerInfo}>
        <ul>
          {data.map((item, index) => (
            <li className={style.li} key={index}>
              <div className={style.liHeader}>
                <Avatar
                  className={style.avatar}
                  size="small"
                  src={item.reviewerAvatar}
                  alt="avatar"
                />
                <span>{item.reviewerName}</span>
                {item.replayCommentId !== 0 && (
                  <div>
                    <span>评论</span>
                    <span>{item.replayCommentReviewerName}</span>
                  </div>
                )}

                <span> 创建时间 :{moment(item.createTime).format('YYYY/MM/DD HH:mm:ss')}</span>
                <span> 修改时间 :{moment(item.updateTime).format('YYYY/MM/DD HH:mm:ss')}</span>
              </div>
              <div
                className={style.content}
                dangerouslySetInnerHTML={{ __html: item.commentText.replace(/\n/g, '<br>') }}
              />
              <ul className={style.btnBox}>
                <li>
                  <UserBand userId={item.reviewerId} userBand={item.hasBand} />
                </li>
                <li>
                  <Button type="primary" onClick={() => this.onListComment(item)}>
                    写评论
                  </Button>
                </li>
                <li>
                  <Button
                    type="primary"
                    onClick={() =>
                      Modal.confirm({
                        okText: '确认',
                        cancelText: '取消',
                        title: '确定要删除？',
                        onOk: () => this.handleRemove(item.commentId),
                      })
                    }
                  >
                    删除并警告
                  </Button>
                </li>
              </ul>
            </li>
          ))}
        </ul>
        <div className={style.loading}>
          {pageMore ? (
            <Button
              type="primary"
              onClick={() =>
                this.setState({ pageName: this.state.pageName + 1 }, () => {
                  this.fetchData();
                })
              }
            >
              加载更多评论
            </Button>
          ) : (
            <p>无更多评论数据</p>
          )}
        </div>
      </div>
    );
  };

  //创建评论 成功
  createCommentSuccess = () => {
    this.setState(
      {
        createModalVisible: false,
        pageNum: 1,
        parentId: 0,
        replayCommentId: 0,
        data: [],
      },
      () => {
        this.fetchData();
        //如果 为 回答开启的评论则需要 关闭弹出框
        this.props.createCommentByAnswerModalVisible && this.props.createCommentSuccess();
      },
    );
  };

  render() {
    const {
      data,
      loading,
      createModalVisible,
      parentId,
      replayCommentId,
      questionId,
      answerId,
    } = this.state;

    return (
      <PageInnerLoading loading={loading}>
        {data.length > 0 ? (
          <>{this._renderComment()}</>
        ) : (
          <p style={{ textAlign: 'center' }}>无评论数据</p>
        )}
        <Modal
          destroyOnClose
          title="评论"
          visible={createModalVisible}
          onCancel={() =>
            this.setState({
              createModalVisible: false,
            })
          }
          footer={null}
        >
          <CommentForm
            parentId={parentId}
            replayCommentId={replayCommentId}
            questionId={questionId}
            answerId={answerId}
            callback={this.createCommentSuccess}
          />
        </Modal>
      </PageInnerLoading>
    );
  }
}

export default CommentView;
