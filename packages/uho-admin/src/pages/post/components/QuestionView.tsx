import React from 'react';
import { Row, Col, message, Avatar, Button, Modal } from 'antd';

import { getModuleBymoduleId, getGroupByGroupId } from '@/services/game';
import PageInnerLoading from '@/components/PageInnerLoading';
import UserBand from '@/components/UserBand';
import {
  queryQuestion,
  questionPassReview,
  setRecommendedQuestion,
  setCancelRecommendedQuestion,
  questionDeleted,
  questionTopQuestion,
  questionCancelTopQuestion,
} from '../service';
import { getListAdminUser } from '@/services/user';
import { history } from 'umi';
import AnswerView from './AnswerView';
import AnswerForm from './AnswerForm';

import moment from 'moment';
import style from './QuestionView.less';

//state 类型
interface state {
  loading: boolean; // 搜索
}

// props 类型
interface props {
  questionId: number; //问题ID
  answerId?: number; //答案ID
  commentId?: number; //评论ID
}

class QuestionView extends React.Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      questionId: 0,
      answerId: 0,
      commentId: 0,
      createModalVisible: false,
      reloadingAnswer: false,
    };
  }

  //默认 defaultProps
  static defaultProps = {};

  componentDidMount() {
    //获取马甲用户
    getListAdminUser().then((response) => {
      // console.log(response.data);
      //马甲用户 写入 localstorage
      localStorage.setItem('listAdmin', JSON.stringify(response.data));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.questionId && nextProps.questionId !== this.props.questionId) {
      const { questionId, answerId, commentId } = nextProps;

      this.setState(
        {
          questionId,
          answerId,
          commentId,
        },
        () => {
          this.fetchData();
        },
      );
    }
  }

  //获取 问题
  fetchData = () => {
    const { questionId } = this.state;

    this.setState({
      loading: true,
    });

    queryQuestion({ questionId })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          this.setState({
            data: response.data[0],
            loading: false,
          });
        }
      })
      .catch((errs) => {
        message.error(errs.message);
      });
  };

  //问题审核通过
  onQuestionPassReview = () => {
    const { data, questionId } = this.state;

    const _this = this;
    //const hide = message.loading('正在操作');
    questionPassReview({ questionId })
      .then(function (response) {
        //hide();
        if (response.data.result) {
          message.success('审核通过');
          data.reviewStatus = 1;
          _this.setState({
            data,
          });
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        // hide();
        message.error(error.message);
      });
  };

  //问题推荐
  onSetRecommendedQuestion = () => {
    const { questionId } = this.state;

    // const hide = message.loading('正在操作');
    const _this = this;
    setRecommendedQuestion({ questionId })
      .then(function (response) {
        //hide();
        if (response.data.result) {
          message.success('推荐成功');
          _this.fetchData();
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  };

  //问题取消推荐
  onSetCancelRecommendedQuestion() {
    const { questionId } = this.state;
    const _this = this;
    //onst hide = message.loading('正在操作');
    setCancelRecommendedQuestion(questionId)
      .then(function (response) {
        //hide();
        if (response.data.result) {
          message.success('推荐取消成功');
          _this.fetchData();
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  }

  //问题删除
  handleRemove = () => {
    const { questionId } = this.state;

    //const hide = message.loading('正在操作');
    questionDeleted(questionId)
      .then(function (response) {
        // hide();
        if (response.data.result) {
          message.success('删除成功');
          history.goBack();
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  };

  async opTop() {
    const { data } = this.state;
    const { questionId, isTop } = data;
    try {
      if (isTop) {
        await questionCancelTopQuestion({ questionId });
      } else {
        await questionTopQuestion({ questionId });
      }
      message.success('操作成功，即将刷新');
      // if (actionRef.current) {
      //   actionRef.current.reload();
      // }
      this.fetchData();
    } catch (error) {
      message.error('操作失败，请重试');
    }
  }

  _renderQuestion = () => {
    const { data, createModalVisible } = this.state;

    return (
      <div className="question-info">
        <Row className={style.row} justify="space-between">
          <Col span={6}>
            <div className={style.rowDiv}>问题ID :{data.questionId}</div>
            <div className={style.rowDiv}>关注数 :{data.focusNum}</div>
            <div className={style.rowDiv}>回答数 :{data.answerNum}</div>
            <div className={style.rowDiv}>及时奖 :{data.awardInTime ? '有' : '无'}</div>

            <div className={style.rowDiv}>
              <Avatar size="small" src={data.avatar} alt="avatar" />
              <span className={style.nickname}>{data.questionerName}</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.rowDiv}>
              游戏 :
              {getModuleBymoduleId(data.moduleId) && getModuleBymoduleId(data.moduleId).moduleName}
            </div>
            <div className={style.rowDiv}>
              组别 :
              {getGroupByGroupId(data.moduleGroupId) &&
                getGroupByGroupId(data.moduleGroupId).groupName}
            </div>
            <div className={style.rowDiv}>
              创建时间 :{moment(data.createTime).format('YYYY/MM/DD HH:mm:ss')}
            </div>
            <div className={style.rowDiv}>
              修改时间 :{moment(data.updateTime).format('YYYY/MM/DD HH:mm:ss')}
            </div>
            <div className={style.rowDiv}>ho点 :{data.bonusNum}</div>
          </Col>
        </Row>
        <div className={style.contentBox}>
          <div className={style.content}>
            <h2>{data.title}</h2>

            <div className="html" dangerouslySetInnerHTML={{ __html: data.originalHtml }} />
          </div>
          <ul className={style.btnBox}>
            <li>
              <UserBand userId={data.questionerId} userBand={data.hasBand} />
            </li>
            {data.acceptStatus !== -1 && (
              <li>
                {data.reviewStatus === 0 ? (
                  <Button type="primary" onClick={this.onQuestionPassReview}>
                    等待审核
                  </Button>
                ) : (
                  <Button type="primary">通过审核</Button>
                )}
              </li>
            )}

            {data.acceptStatus === 0 && (
              <li>
                <Button
                  type="primary"
                  onClick={() =>
                    this.setState({
                      createModalVisible: true,
                    })
                  }
                >
                  写回答
                </Button>
              </li>
            )}

            {data.acceptStatus !== -1 && (
              <>
                <li>
                  {data.recommend ? (
                    <li>
                      <Button type="primary" onClick={() => this.onSetCancelRecommendedQuestion()}>
                        已添加到推荐页
                      </Button>
                    </li>
                  ) : (
                    <li>
                      <Button type="primary" onClick={this.onSetRecommendedQuestion}>
                        添加到推荐页
                      </Button>
                    </li>
                  )}
                </li>
                <li>
                  <Button type="primary" onClick={() => this.opTop()}>
                    {data.isTop ? '取消置顶' : '置顶'}
                  </Button>
                </li>
              </>
            )}

            <li>
              <Button
                type="primary"
                onClick={() => {
                  const title = data.recommend
                    ? '此问题在推荐页面也有,是否删除此问题?'
                    : '确定要删除？';
                  return Modal.confirm({
                    okText: '确认',
                    cancelText: '取消',
                    title,
                    onOk: () => this.handleRemove(),
                  });
                }}
              >
                删除并警告
              </Button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  //创建答案 成功
  createAnswerSucess = () => {
    this.setState({
      createModalVisible: false,
      reloadingAnswer: true,
    });
  };

  render() {
    const { data, loading, answerId, commentId, createModalVisible, reloadingAnswer } = this.state;
    const { questionId } = this.props;

    return (
      <PageInnerLoading loading={loading}>
        <div className={style.page}>
          {this._renderQuestion()}
          {JSON.stringify(data) !== '{}' && (
            <div>
              <h1>回答</h1>
              <AnswerView
                reloadingAnswer={reloadingAnswer}
                questionId={questionId}
                answerId={answerId}
                commentId={commentId}
                acceptStatus={data.acceptStatus}
              />

              <Modal
                destroyOnClose
                title="回答"
                visible={createModalVisible}
                onCancel={() =>
                  this.setState({
                    createModalVisible: false,
                  })
                }
                footer={null}
              >
                <AnswerForm questionId={questionId} callback={this.createAnswerSucess} />
              </Modal>
            </div>
          )}
        </div>
      </PageInnerLoading>
    );
  }
}

export default QuestionView;
