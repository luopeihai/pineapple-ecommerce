import {
  Button,
  Input,
  Form,
  message as AntMessage,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Row,
  Col,
} from 'antd';
import { connect, AnyAction, Dispatch } from 'umi';
import React, { FC, useEffect, useState, useRef } from 'react';

import SelectSearch from '@/components/SelectSearch';
import RichText from '@/components/rich-editor';
import { UserListModelState } from '@/models/UserList';
import { StateType } from '../model';

interface FormProps {
  dispatch: Dispatch<AnyAction>;
  questionInfo: StateType;
  userList: UserListModelState; //马甲号
  submitting?: boolean;
}

/**
 * userList 马甲号list
 * questionInfo
 */
const QuestionForm: FC<FormProps> = ({ dispatch, questionInfo, userList, submitting }) => {
  const { status, message, coinCount, group } = questionInfo;

  const [form] = Form.useForm();
  //富文本
  const [richInfo, setRichInfo] = useState({
    images: '[]', //图片
    includeMultimediaText: '', //纯文字内容
    originalHtml: '', //原始富文本内容
    videos: '[]', //视频
    wordText: '', //纯文字内容
  });

  //发布者id
  const [questionerId, setQuestionerId] = useState();
  const richTextRef = useRef();

  /**
   * constructor
   */
  useEffect(() => {
    //错误
    if (!submitting && status === 'ok') {
      onReset();
    }
    //获取马甲号
    userList.length === 0 &&
      dispatch({
        type: 'userList/fetchUserList',
      });
  }, [submitting]);

  //监听组别为空是否默认null值
  useEffect(() => {
    if (group.length === 0) {
      form.setFieldsValue({ moduleGroupId: null });
    }
  }, [group]);

  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    dispatch({
      type: 'questionInfo/create',
      payload: {
        ...values,
        ...richInfo,
        questionerId,
      },
    });
  };

  /**
   * 重置表单
   */
  const onReset = () => {
    form.resetFields();
    richTextRef.current.reset('');
  };

  // 获取选中马甲用户 信息
  const handleQuestionerChange = (value) => {
    //记录 选中id
    setQuestionerId(value);

    //更新 CoinCount
    dispatch({
      type: 'questionInfo/updateCoinCount',
      payload: {
        id: value,
      },
    });
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

  const propsSelectSearch = {
    url: '/config/module/listModule',
    formatData: {
      key: 'moduleId',
      value: 'moduleName',
    },
    onChange: function (value) {
      let moduleId = null;
      if (value) {
        moduleId = value.key;
      }

      form.setFieldsValue({
        moduleId,
      });

      dispatch({
        type: 'questionInfo/getModuleGroup',
        payload: {
          moduleId,
        },
      });
    },
  };

  return (
    <Form
      style={{ marginTop: 8 }}
      form={form}
      name="form"
      onFinish={onFinish}
      initialValues={{
        ['bonusNum']: 0,
        ['awardInTime']: 1,
      }}
    >
      <Row justify="space-around">
        <Col span={6}>
          <Form.Item
            label="游戏"
            name="moduleId"
            rules={[
              {
                required: true,
                message: '请选择游戏',
              },
            ]}
          >
            <SelectSearch {...propsSelectSearch} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="组别"
            name="moduleGroupId"
            rules={[
              {
                required: true,
                message: '请选择组别',
              },
            ]}
          >
            <Select showSearch placeholder="请选择组别" optionFilterProp="children">
              {group.map((item) => (
                <Select.Option key={item.groupId} value={item.groupId}>
                  {item.groupName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="发布账号">
            <Form.Item
              label="发布账号"
              name="questionerId"
              noStyle
              rules={[{ required: true, message: '请选择账号' }]}
            >
              <Select
                showSearch
                width="100"
                placeholder="请选择账号"
                onChange={handleQuestionerChange}
                optionFilterProp="children"
              >
                {userList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.nickName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {coinCount > 0 && <Tooltip title="Useful information">ho点:{coinCount}</Tooltip>}
          </Form.Item>
        </Col>
      </Row>

      <Row justify="space-around">
        <Col span={6}>
          <Form.Item
            label="标题"
            name="title"
            rules={[
              { required: true, message: '请填写标题' },
              { max: 40, message: '标题不能超过40个字' },
              { min: 2, message: '标题不能小于2个字' },
            ]}
          >
            <Input placeholder="请填写标题" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="及时将"
            name="awardInTime"
            rules={[{ required: true, message: '请选择及时将' }]}
          >
            <Radio.Group>
              <Radio value={1}>有</Radio>
              <Radio value={0}>无</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="悬赏金"
            name="bonusNum"
            rules={[{ required: true, message: '请填写悬赏金' }]}
          >
            <InputNumber min={0} precision={0} />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="space-around">
        <Col span={24}>
          <RichText ref={richTextRef} onChange={onReceiveHtml} />
        </Col>
      </Row>

      <div className="submit-box ">
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default connect(
  ({
    questionInfo,
    userList: { userList },
    loading,
  }: {
    questionInfo: StateType;
    userList: {
      userList: UserListModelState;
    };
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => {
    return {
      questionInfo,
      userList, //马甲
      submitting: loading.effects['questionInfo/create'],
    };
  },
)(QuestionForm);
