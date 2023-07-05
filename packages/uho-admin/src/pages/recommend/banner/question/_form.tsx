import React, { useEffect, useState, useRef } from 'react';
import { Form, Modal, Row, Col, Button, Input, message as antdMessage } from 'antd';
import { connect, AnyAction, Dispatch } from 'umi';
import SelectSearch from '@/components/SelectSearch';
import ImageUpload from '@/components/ImageUpload';
import { StateType } from './model';

interface FormProps {
  dispatch: Dispatch<AnyAction>;
  modalVisible: boolean;
  onCancel: () => void;
  submitting?: boolean;
  bannerQuestionList: StateType;
  bannerId: number;
  moduleId: number;
}

const OpForm: React.FC<FormProps> = ({
  dispatch,
  modalVisible,
  onCancel,
  bannerQuestionList,
  submitting,
  bannerId,
  moduleId,
}) => {
  const [form] = Form.useForm();
  const { loading, detail } = bannerQuestionList;

  useEffect(() => {
    //修改 设置详情
    form.setFieldsValue({});
  }, [detail]);

  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    let dispatchType = 'bannerQuestionList/create';

    dispatch({
      type: dispatchType,
      payload: {
        ...values,
        bannerId,
      },
    });
  };

  useEffect(() => {
    if (loading) {
      //重新加载
      form.resetFields();
    }
  }, [bannerQuestionList]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const propsSelectSearch = {
    url: `/community/question?moduleId=${moduleId}`,
    formatData: {
      key: 'questionId',
      value: 'title',
    },
    filter: function (data) {
      return data.filter((item) => item.acceptStatus !== -1);
    },
    onChange: function (value) {
      form.setFieldsValue({
        questionId: value ? value.key : null,
      });
    },
  };

  return (
    <Modal destroyOnClose title="添加问题" visible={modalVisible} onCancel={onClose} footer={null}>
      <Form style={{ marginTop: 8 }} form={form} name="form" onFinish={onFinish}>
        <Row>
          <Col span={22}>
            <Form.Item
              label="问题名称"
              name="questionId"
              rules={[{ required: true, message: '请选择问题' }]}
            >
              <SelectSearch {...propsSelectSearch} />
            </Form.Item>
          </Col>
        </Row>

        <div className="submit-box ">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              添加
            </Button>
            <Button onClick={onClose}>取消</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(
  ({
    bannerQuestionList,
    loading,
  }: {
    bannerQuestionList: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    bannerQuestionList,
    submitting: loading.effects['bannerQuestionList/create'],
  }),
)(OpForm);
