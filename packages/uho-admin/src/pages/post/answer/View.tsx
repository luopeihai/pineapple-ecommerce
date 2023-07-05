import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { queryAnswer } from '../service';
import { renderBreadcrumb } from '@/components/Breadcrumb';
import QuestionView from '../components/QuestionView';
import { history } from 'umi';

const AnswerView: React.FC<> = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [idsObject, setIdsObject] = useState({});

  useEffect(() => {
    queryAnswer({ answerId: id })
      .then((response) => {
        if (response.data.length > 0) {
          //数据存在
          setIdsObject(response.data[0]);
        } else {
          //数据已经删除 跳转到回答list页
          history.push('/post/answer/list');
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
      { path: '/post/answer', breadcrumbName: '回答列表' },
      { breadcrumbName: '回答详情' },
    ];
    return renderBreadcrumb(routes);
  };

  return (
    <PageHeaderWrapper pageHeaderRender={pageHeaderRender} title={false}>
      <QuestionView {...idsObject} />
    </PageHeaderWrapper>
  );
};

export default AnswerView;
