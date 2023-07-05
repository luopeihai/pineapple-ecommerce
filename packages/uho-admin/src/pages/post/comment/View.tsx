import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, message, DatePicker, Breadcrumb } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { queryComment } from '../service';

import { renderBreadcrumb } from '@/components/Breadcrumb';
import QuestionView from '../components/QuestionView';
import { history } from 'umi';

const CommentView: React.FC<> = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [idsObject, setIdsObject] = useState({});

  useEffect(() => {
    queryComment({ commentId: id })
      .then((response) => {
        if (response.data.length > 0) {
          setIdsObject(response.data[0]);
        } else {
          //数据已经删除 跳转到回答list页
          history.push('/post/comment/list');
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);

  //自定义 面包屑
  const pageHeaderRender = (routersInfo) => {
    let {
      breadcrumb: { routes },
    } = routersInfo;

    routes = [
      ...routes,
      { path: '/post/comment', breadcrumbName: '评论列表' },
      { breadcrumbName: '评论详情' },
    ];
    return renderBreadcrumb(routes);
  };

  return (
    <PageHeaderWrapper pageHeaderRender={pageHeaderRender} title={false}>
      <QuestionView
        answerId={idsObject.answerId}
        questionId={idsObject.questionId}
        commentId={idsObject.commentId}
      />
    </PageHeaderWrapper>
  );
};

export default CommentView;
