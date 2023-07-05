import { Button, Card, Col, DatePicker, Form, Input, Popover, Row, Select, message } from 'antd';

import React, { FC, useState, useRef } from 'react';
import RichText from '@/components/rich-editor';
import { createAnswer } from '../service';
import { isHasShield } from '@/data';

const AnswerForm: FC<> = (props) => {
  const [form] = Form.useForm();

  const richTextRef = useRef();

  const [reviewerId, setReviewerId] = useState(0);

  //富文本
  const [richInfo, setRichInfo] = useState({
    images: '[]', //图片
    includeMultimediaText: '', //纯文字内容
    originalHtml: '', //原始富文本内容
    videos: '[]', //视频
    wordText: '', //纯文字内容
  });

  // useEffect(() => {

  // }, [props]);

  //提交
  const onFinish = (values: { [key: string]: any }) => {
    const { questionId } = props;
    if (!reviewerId) {
      message.error('请选择发布账号!');
      hide();
      return false;
    }

    if (richInfo.wordText.length < 5) {
      message.error('回答内容不能小于5个字');
      return false;
    }

    const shieldValue = isHasShield(richInfo.wordText);
    if (shieldValue) {
      //有屏蔽词 true
      message.error(`存在敏感词汇${shieldValue}`);
      return;
    }

    // const hide = message.loading('正在操作');

    createAnswer({
      questionId,
      answererId: reviewerId,
      ...richInfo,
    })
      .then(function (response) {
        //  hide();
        message.success('回答发布成功');
        form.resetFields();
        richTextRef.current.reset('');
        props.callback(); //成功 回调
      })
      .catch(function (error) {
        // hide();
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
    richTextRef.current.reset('');
  };

  const onReceiveHtml = (values) => {
    setRichInfo({
      images: `[${values.images.join()}]`, //图片
      includeMultimediaText: values.includeMultimediaText, //纯文字内容
      originalHtml: values.originalHtml, //原始富文本内容
      videos: `[${values.videos.map((item) => JSON.stringify(item)).join()}]`, //视频 需要拼凑约定格式
      wordText: values.wordText, //纯文字内容
    });
  };

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item label="发布账号" name="name">
        <Select allowClear labelInValue placeholder="请选择发布账号" showSearch onChange={OnChange}>
          {userList.map((item) => (
            <Select.Option key={item.id} value={item.nickName}>
              {item.nickName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div>
        <RichText ref={richTextRef} onChange={onReceiveHtml} />
      </div>
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

export default AnswerForm;
