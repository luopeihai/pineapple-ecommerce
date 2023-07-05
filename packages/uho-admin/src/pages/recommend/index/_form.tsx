import React, { useEffect } from 'react';
import { Form, Modal, Row, Col, Button, Input } from 'antd';
import { connect, AnyAction, Dispatch } from 'umi';
import SelectSearch from '@/components/SelectSearch';
import { StateType } from './model';

interface FormProps {
  dispatch: Dispatch<AnyAction>;
  modalVisible: boolean;
  onCancel: () => void;
  submitting?: boolean;
  recommendList: StateType;
}

const OpForm: React.FC<FormProps> = ({
  dispatch,
  modalVisible,
  onCancel,
  recommendList,
  submitting,
}) => {
  const [form] = Form.useForm();

  const { loading } = recommendList;

  useEffect(() => {
    if (loading) {
      form.resetFields();
    }
  }, [recommendList]);

  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    dispatch({
      type: 'recommendList/create',
      payload: {
        ...values,
      },
    });
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const propsSelectSearch = {
    url: '/community/question',
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
          <Col span={17}>
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
    recommendList,
    loading,
  }: {
    recommendList: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    recommendList,
    submitting: loading.effects['recommendList/create'],
  }),
)(OpForm);
