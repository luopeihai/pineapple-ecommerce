import React, { useEffect } from 'react';
import { Form, Modal, Row, Col, Button, Input } from 'antd';
import { connect, AnyAction, Dispatch } from 'umi';
import { StateType } from './model';

interface FormProps {
  dispatch: Dispatch<AnyAction>;
  modalVisible: boolean;
  onCancel: () => void;
  submitting?: boolean;
  groupList: StateType;
  groupId?: number;
  groupName?: string;
}

const GroupForm: React.FC<FormProps> = ({
  dispatch,
  modalVisible,
  onCancel,
  groupList,
  submitting,
  groupId,
  groupName,
}) => {
  const [form] = Form.useForm();

  const { loading } = groupList;

  useEffect(() => {
    if (loading) {
      form.resetFields();
    }
  }, [groupList]);

  useEffect(() => {
    form.setFieldsValue({
      groupName,
    });
  }, [groupName]);

  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    groupId
      ? dispatch({
          type: 'groupList/update',
          payload: {
            ...values,
            groupId,
          },
        })
      : dispatch({
          type: 'groupList/create',
          payload: {
            ...values,
          },
        });
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      destroyOnClose
      title={groupId ? '修改组别' : '添加组别'}
      visible={modalVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form style={{ marginTop: 8 }} form={form} name="form" onFinish={onFinish}>
        <Row>
          <Col span={17}>
            <Form.Item
              label="组别名称"
              name="groupName"
              rules={[{ required: true, message: '请填写组别名称' }]}
            >
              <Input placeholder="请填写组别名称" />
            </Form.Item>
          </Col>
        </Row>

        <div className="submit-box ">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {groupId ? '确认修改' : '添加'}
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
    groupList,
    loading,
  }: {
    groupList: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    groupList,
    submitting: loading.effects['groupList/create'],
  }),
)(GroupForm);
