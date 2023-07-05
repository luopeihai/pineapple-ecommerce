import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, message, DatePicker, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { QuestionTableListItem } from '../data.d';
import { queryQuestion, questionDeleted } from '../service';

import { Link, FormattedMessage } from 'umi';

import BasicForm from './components/_Form';

const AddQuestion: React.FC<{}> = () => {
  return (
    <PageHeaderWrapper title={false}>
      <Card bordered={false}>
        <BasicForm />
      </Card>
    </PageHeaderWrapper>
  );
};

export default AddQuestion;
