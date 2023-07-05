import React, { useState } from 'react';
import { Row, Col, message, Avatar, Button, Modal } from 'antd';

import PageInnerLoading from '@/components/PageInnerLoading';
import { queryAnswer, answerDeleted, answerPassReview, acceptAnswer } from '../service';
import UserBand from '@/components/UserBand';
import CommentView from './CommentView';

import moment from 'moment';
import style from './AnswerView.less';

//state 类型
interface state {
  loading: boolean; // 搜索
}

// props 类型
interface props {
  questionId: number; //问题ID
  answerId?: number; //答案ID
  commentId?: number; //评论ID
  acceptStatus?: number; //采纳状态
  reloadingAnswer?: boolean; //重新加载回答
}

class AnswerView extends React.Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      pageName: 1,
      pageSize: 10,
      pageMore: true,
    };
  }

  //默认 defaultProps
  static defaultProps = {};

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadingAnswer) {
      //重新加载答案
      this.setState(
        {
          data: [],
          pageName: 1,
          pageSize: 10,
        },
        () => {
          this.fetchData();
        },
      );
    }
  }

  //获取 问题
  fetchData = () => {
    const { questionId, answerId } = this.props;
    const { pageName, pageSize, pageMore, data } = this.state;
    this.setState({
      loading: true,
    });

    //为回答详情进入
    if (answerId && data.length === 0) {
      queryAnswer({ answerId, pageName: 1, pageSize: 1 }).then((response) => {
        this.setState({
          data: response.data,
        });
        this.fetchData();
      });
    } else {
      queryAnswer({ questionId, pageName, pageSize })
        .then((response) => {
          const responseData = response.data.filter((item) => item.answerId !== answerId);

          this.setState({
            data: [...data, ...responseData],
            pageSize: pageSize + 1,
            pageMore: response.total > pageSize * pageName,
            loading: false,
          });
        })
        .catch((errs) => {
          message.error(errs.message);
        });
    }
  };

  _renderAnswer = () => {
    const { data } = this.state;
    const { commentId, questionId, acceptStatus, pageMore } = this.props;

    return (
      <div className={style.answerInfo}>
        <ul>
          {data.map((item, index) => (
            <AnswerViewList
              acceptStatus={acceptStatus}
              item={item}
              commentId={commentId}
              questionId={questionId}
              key={index}
            />
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
              加载更多回答
            </Button>
          ) : (
            <p>无更多回答数据</p>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { data, loading } = this.state;

    return (
      <PageInnerLoading loading={loading}>
        {data.length > 0 ? <div>{this._renderAnswer()}</div> : <div>无回答数据</div>}
      </PageInnerLoading>
    );
  }
}

const AnswerViewList: FC<> = (props) => {
  const { item, commentId, questionId, acceptStatus } = props;

  //设置值
  const [data, setData] = useState(item);

  //评论内容
  const [createCommentByAnswer, setCreateCommentByAnswer] = useState({
    parentId: 0, //一级评论的id
    replayCommentId: 0, //回复评论的id
    questionId,
    answerId: data && data.answerId,
  });

  //开启评论框
  const [createCommentByAnswerModalVisible, setCreateCommentByAnswerModalVisible] = useState(false);

  //答案采纳
  const onAcceptAnswer = (answerId) => {
    // const hide = message.loading('正在操作');
    acceptAnswer({ answerId })
      .then(function (response) {
        // hide();
        if (response.data.result) {
          message.success('采纳成功');
          location.reload();
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  };

  //回答审核
  const onAnswerPassReview = (answerId) => {
    //const hide = message.loading('正在操作');

    answerPassReview({ answerId })
      .then(function (response) {
        //hide();
        if (response.data.result) {
          message.success('审核通过');
          //修改状态
          setData({ ...data, reviewStatus: 1 });
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  };

  //问题删除
  const handleRemove = (answerId) => {
    //const hide = message.loading('正在操作');

    answerDeleted(answerId)
      .then(function (response) {
        //hide();
        if (response.data.result) {
          message.success('删除成功');
          setData(null);
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  };

  const onCreateComment = () => {
    setCreateCommentByAnswer({
      parentId: 0, //一级评论的id
      replayCommentId: 0, //回复评论的id
      questionId,
      answerId: data.answerId,
    });
    setCreateCommentByAnswerModalVisible(true);
  };

  //评论创建成功
  const createCommentSuccess = () => {
    setCreateCommentByAnswerModalVisible(false);
  };

  return (
    <>
      {data !== null ? (
        <li className={style.li}>
          <div className={style.liHeader}>
            <Avatar className={style.avatar} size="small" src={data.avatar} alt="avatar" />
            <span>{data.answererName}</span>
            {data.acceptStatus === 1 && <span className={style.accap}>系统采纳</span>}
            {data.acceptStatus === 2 && <span className={style.accap}>题主采纳</span>}
            <span> 赞数:{data.likeNum}</span>
            <span> 创建时间 :{moment(data.createTime).format('YYYY/MM/DD HH:mm:ss')}</span>
            <span> 修改时间 :{moment(data.updateTime).format('YYYY/MM/DD HH:mm:ss')}</span>
          </div>
          <div className={style.content} dangerouslySetInnerHTML={{ __html: data.originalHtml }} />
          <ul className={style.btnBox}>
            {acceptStatus === 0 && (
              <li>
                <Button
                  type="primary"
                  onClick={() =>
                    Modal.confirm({
                      okText: '确认',
                      cancelText: '取消',
                      title: '确认采纳此条回答吗？',
                      onOk: () => onAcceptAnswer(data.answerId),
                    })
                  }
                >
                  采纳
                </Button>
              </li>
            )}

            <li>
              <UserBand userId={data.answererId} userBand={data.hasBand} />
            </li>
            <li>
              {data.reviewStatus === 0 ? (
                <Button type="primary" onClick={() => onAnswerPassReview(data.answerId)}>
                  等待审核
                </Button>
              ) : (
                <Button type="primary">通过审核</Button>
              )}
            </li>
            <li>
              <Button type="primary" onClick={onCreateComment}>
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
                    onOk: () => handleRemove(data.answerId),
                  })
                }
              >
                删除并警告
              </Button>
            </li>
          </ul>
          <CommentView
            answerId={data.answerId}
            commentId={commentId}
            createCommentByAnswer={createCommentByAnswer}
            createCommentByAnswerModalVisible={createCommentByAnswerModalVisible}
            createCommentSuccess={createCommentSuccess}
          />
        </li>
      ) : (
        <></>
      )}
    </>
  );
};

export default AnswerView;
