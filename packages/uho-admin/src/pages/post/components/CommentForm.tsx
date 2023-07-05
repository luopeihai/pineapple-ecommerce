import { Button, Card, Col, DatePicker, Form, Input, Popover, Row, Select, message } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { createComment } from '../service';
import { isHasShield } from '@/data';

const CommentForm: FC<> = (props) => {
  const [form] = Form.useForm();
  const [commentText, setCommentText] = useState('');
  const [reviewerId, setReviewerId] = useState(0);
  const [propsInfo, setPropsInfo] = useState(props);

  useEffect(() => {
    setPropsInfo(props);
  }, [props]);

  //提交
  const onFinish = (values: { [key: string]: any }) => {
    const { commentText } = values;
    // const { answerId, questionId, replayCommentId, parentId } = props;

    //const hide = message.loading('正在操作');
    const shieldValue = isHasShield(commentText);
    if (shieldValue) {
      //有屏蔽词 true
      message.error(`存在敏感词汇${shieldValue}`);
      return;
    }

    createComment({
      reviewerId,
      commentText,
      ...propsInfo,
    })
      .then(function (response) {
        //hide();
        message.success('评论成功');
        props.callback();
      })
      .catch(function (error) {
        //hide();
        message.error(error.message);
      });
  };

  const userList = localStorage.getItem('listAdmin')
    ? JSON.parse(localStorage.getItem('listAdmin'))
    : []; //马甲用户

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const OnChange = (value, option) => {
    if (value) {
      setReviewerId(option.key);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item
        label="发布账号"
        name="name"
        rules={[{ required: true, message: '请选择发布账号' }]}
      >
        <Select allowClear labelInValue placeholder="请选择发布账号" showSearch onChange={OnChange}>
          {userList.map((item) => (
            <Select.Option key={item.id} value={item.nickName}>
              {item.nickName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="发布内容"
        name="commentText"
        rules={[
          { required: true, message: '请填写评论内容' },
          { max: 200, message: '标题不能超过200个字' },
        ]}
      >
        <Input.TextArea
          value={commentText}
          onChange={(value) => setCommentText(value)}
          placeholder="请输入发布内容"
          rows={4}
        />
      </Form.Item>
      <div className="submit-box ">
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default CommentForm;
