import React, { useEffect } from 'react';
import { Form, Modal, Row, Col, Button, Input } from 'antd';
import { connect, AnyAction, Dispatch } from 'umi';
import SelectSearch from '@/components/SelectSearch';
import { StateType } from './model';

interface CreateFormProps {
  dispatch: Dispatch<AnyAction>;
  modalVisible: boolean;
  onCancel: () => void;
  submitting?: boolean;
  gameGroupList: StateType;
}

const CreateForm: React.FC<CreateFormProps> = ({
  dispatch,
  modalVisible,
  onCancel,
  gameGroupList,
  submitting,
  moduleId,
}) => {
  const [form] = Form.useForm();

  const { loading } = gameGroupList;
  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    dispatch({
      type: 'gameGroupList/create',
      payload: {
        ...values,
        moduleId,
      },
    });
  };

  useEffect(() => {
    if (loading) {
      form.resetFields();
    }
  }, [gameGroupList]);

  const propsSelectSearch = {
    url: '/config/group',
    formatData: {
      key: 'groupId',
      value: 'groupName',
    },
    formatData: {
      key: 'groupId',
      value: 'groupName',
    },
    onChange: function (value) {
      value ? form.setFieldsValue({ groupId: value.key }) : form.setFieldsValue({ groupId: null });
    },
  };

  const onClose = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal destroyOnClose title="添加组别" visible={modalVisible} onCancel={onClose} footer={null}>
      <Form style={{ marginTop: 8 }} form={form} name="form" onFinish={onFinish}>
        <Row>
          <Col span={17}>
            <Form.Item
              label="游戏组别"
              name="groupId"
              rules={[{ required: true, message: '请选择组别' }]}
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
            <Button onClick={onCancel}>取消</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(
  ({
    gameGroupList,
    loading,
  }: {
    gameGroupList: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    gameGroupList,
    submitting: loading.effects['gameGroupList/create'],
  }),
)(CreateForm);
