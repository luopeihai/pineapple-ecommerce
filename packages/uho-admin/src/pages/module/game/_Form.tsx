import React, { useEffect, useState, useRef } from 'react';
import { Form, Modal, Row, Col, Button, Input, message as antdMessage } from 'antd';
import { connect, AnyAction, Dispatch } from 'umi';
import ImageUpload from '@/components/ImageUpload';
import { validatorImagePx } from '@/utils/tool';
import { StateType } from './model';

interface FormProps {
  dispatch: Dispatch<AnyAction>;
  modalVisible: boolean;
  onCancel: () => void;
  submitting?: boolean;
  gameList: StateType;
  moduleId?: number; //更新 有值
}

const moduleImageWidth = 1125;
const moduleImageHeight = 420;
const manageImageWidth = 60; //60
const manageImageHeight = 60; //60

const GameForm: React.FC<FormProps> = ({
  dispatch,
  modalVisible,
  onCancel,
  gameList,
  submitting,
  moduleId = 0,
}) => {
  const moduleImageRef = useRef();
  const manageImageRef = useRef();
  const [form] = Form.useForm();
  const { loading, detail } = gameList;

  //修改 请求详情
  useEffect(() => {
    //大于0 请求详情
    if (moduleId) {
      dispatch({
        type: 'gameList/detail',
        payload: moduleId,
      });
    }
  }, [moduleId]);

  useEffect(() => {
    //修改 设置详情
    form.setFieldsValue({
      moduleImage: detail.moduleImage,
      moduleName: detail.moduleName,
      manageImage: detail.manageImage,
    });

    if (moduleImageRef.current && detail.moduleImage) {
      moduleImageRef.current.setFileList([detail.moduleImage]);
    }

    if (manageImageRef.current && detail.manageImage) {
      manageImageRef.current.setFileList([detail.manageImage]);
    }
  }, [detail]);

  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    let dispatchType = 'gameList/create';
    if (moduleId) {
      values.moduleId = moduleId;
      dispatchType = 'gameList/update';
    }

    dispatch({
      type: dispatchType,
      payload: {
        ...values,
      },
    });
  };

  useEffect(() => {
    if (loading) {
      //重新加载
      form.resetFields();
      moduleId = 0;
    }
  }, [gameList]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      destroyOnClose
      title={moduleId ? '修改游戏' : '添加游戏'}
      visible={modalVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form style={{ marginTop: 8 }} form={form} name="form" onFinish={onFinish}>
        <Row>
          <Col span={17}>
            <Form.Item
              label="游戏名称"
              name="moduleName"
              rules={[{ required: true, message: '请填写游戏名称' }]}
            >
              <Input placeholder="请填写游戏名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              label="背景图片"
              name="moduleImage"
              rules={[
                { required: true, message: '请上传背景图片' },
                {
                  validator: (_, value) =>
                    validatorImagePx(value, moduleImageWidth, moduleImageHeight),
                },
              ]}
            >
              <ImageUpload
                ref={moduleImageRef}
                maxSize={1}
                onChange={([item = null]) =>
                  form.setFieldsValue({ moduleImage: item ? item.url : null })
                }
              />
              <span>图片尺寸：{`${moduleImageWidth}*${moduleImageHeight}`}（长*高）</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              label="游戏管理图片"
              name="manageImage"
              rules={[
                { required: true, message: '请上传游戏管理图片' },
                {
                  validator: (_, value) =>
                    validatorImagePx(value, manageImageWidth, manageImageHeight),
                },
              ]}
            >
              <ImageUpload
                ref={manageImageRef}
                maxSize={1}
                onChange={([item = null]) =>
                  form.setFieldsValue({ manageImage: item ? item.url : null })
                }
              />
              <span>图片尺寸：{`${manageImageWidth}*${manageImageHeight}`}（长*高）</span>
            </Form.Item>
          </Col>
        </Row>

        <div className="submit-box ">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {module ? '确认修改' : '添加'}
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
    gameList,
    loading,
  }: {
    gameList: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    gameList,
    submitting: loading.effects['gameList/create'],
  }),
)(GameForm);
