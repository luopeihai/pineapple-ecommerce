import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { queryQuestion } from '../service';

import { renderBreadcrumb } from '@/components/Breadcrumb';
import QuestionView from '../components/QuestionView';

const Question: React.FC<> = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [idsObject, setIdsObject] = useState({});

  useEffect(() => {
    queryQuestion({ questionId: id })
      .then((response) => {
        setIdsObject(response.data[0]);
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
      { path: '/post/question/list', breadcrumbName: '问题列表' },
      { breadcrumbName: '问题详情' },
    ];
    return renderBreadcrumb(routes);
  };

  return (
    <PageHeaderWrapper pageHeaderRender={pageHeaderRender} title={false}>
      <QuestionView {...idsObject} />
    </PageHeaderWrapper>
  );
};

export default Question;
