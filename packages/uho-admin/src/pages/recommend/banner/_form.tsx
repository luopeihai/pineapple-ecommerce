import React, { useEffect, useState, useRef } from 'react';
import { Form, Modal, Row, Col, Button, Input, message as antdMessage } from 'antd';
import { getDetailById } from '@/services/game';
import { connect, AnyAction, Dispatch } from 'umi';
import ImageUpload from '@/components/ImageUpload';
import { validatorImagePx } from '@/utils/tool';
import SelectSearch from '@/components/SelectSearch';
import { StateType } from './model';

const bannerImageWidth = 1020; //1020
const bannerImageHeight = 510; //510
const manageIconWidth = 180; 
const manageIconHeight = 180; 


interface FormProps {
  dispatch: Dispatch<AnyAction>;
  modalVisible: boolean;
  onCancel: () => void;
  submitting?: boolean;
  bannerList: StateType;
  rowId?: number; //更新 有值
}

const OpForm: React.FC<FormProps> = ({
  dispatch,
  modalVisible,
  onCancel,
  bannerList,
  submitting,
  rowId = 0,
}) => {
  const [form] = Form.useForm();
  const { loading, detail } = bannerList;

  const bannerImageRef = useRef();
  const manageIconRef = useRef();

  const [defaultValue, setDefaultValue] = useState(null);

  //修改 请求详情
  useEffect(() => {
    //大于0 请求详情
    if (rowId) {
      dispatch({
        type: 'bannerList/detail',
        payload: rowId,
      });
    }
  }, [rowId]);

  useEffect(() => {
    //修改 设置详情

    form.setFieldsValue({
      bannerDesc: detail.bannerDesc,
      bannerImage: detail.bannerImage,
      bannerTitle: detail.bannerTitle,
      manageIcon: detail.manageIcon,
    });

    //有模块Id,获取 模块名称
    if (detail.moduleId) {
      getDetailById(detail.moduleId).then((res) => {
        setDefaultValue({
          key: detail.moduleId,
          value: res.data.moduleName,
        });

        form.setFieldsValue({
          moduleId: {
            key: detail.moduleId,
            value: res.data.moduleName,
          },
        });
      });
    }

    if (bannerImageRef.current && detail.bannerImage) {
      bannerImageRef.current.setFileList([detail.bannerImage]);
    }

    if (manageIconRef.current && detail.manageIcon) {
      manageIconRef.current.setFileList([detail.manageIcon]);
    }
  }, [detail]);

  /**
   *
   * @param values 表单值
   * 提交表单
   */
  const onFinish = (values) => {
    let dispatchType = 'bannerList/create';
    if (rowId) {
      values.bannerId = rowId;
      values.moduleId = detail.moduleId;
      dispatchType = 'bannerList/update';
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
      rowId = 0;
    }
  }, [bannerList]);

  const onClose = () => {
    form.resetFields();
    onCancel();
    setDefaultValue(null);
  };

  const propsSelectSearch = {
    url: '/config/module/listModule',
    formatData: {
      key: 'moduleId',
      value: 'moduleName',
    },
    defaultValue,
    selectProps: {
      disabled: rowId,
    },
    onChange: function (value) {
      let moduleId = null;
      if (value) {
        moduleId = value.key;
      }

      form.setFieldsValue({
        moduleId,
      });
    },
  };

  return (
    <Modal
      destroyOnClose
      title={rowId ? '修改' : '添加'}
      visible={modalVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form style={{ marginTop: 8 }} form={form} name="form" onFinish={onFinish}>
        <Row>
          <Col span={22}>
            <Form.Item
              label="banner标题"
              name="bannerTitle"
              rules={[
                { required: true, message: '请填写banner标题' },
                { max: 15, message: '最多输入15个字' },
              ]}
            >
              <Input placeholder="最多输入15个字" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item
              label="游戏名称"
              name="moduleId"
              rules={[{ required: true, message: '请选择游戏' }]}
            >
              {rowId === 0 ? (
                <SelectSearch {...propsSelectSearch} />
              ) : (
                defaultValue && <SelectSearch {...propsSelectSearch} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item
              label="banner描述"
              name="bannerDesc"
              rules={[
                { required: true, message: '请填写banner描述' },
                { max: 40, message: '最多输入40个字' },
              ]}
            >
              <Input.TextArea placeholder="最多输入40个字" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              label="banner图片"
              name="bannerImage"
              rules={[
                {
                  validator: (_, value) =>
                    validatorImagePx(value, bannerImageWidth, bannerImageHeight),
                },
                { required: true, message: '请上传banner图片' },
              ]}
            >
              
              <ImageUpload
                ref={bannerImageRef}
                maxSize={1}
                onChange={([item = null]) =>
                  form.setFieldsValue({ bannerImage: item ? item.url : null })
                }
              />  
              <span>图片尺寸：{`${bannerImageWidth}*${bannerImageHeight}`}（长*高）</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              label="合辑图标"
              name="manageIcon"
              rules={[
                { required: true, message: '请上传合辑图标' },
                {
                  validator: (_, value) =>
                    validatorImagePx(value, manageIconWidth, manageIconHeight),
                },
              ]}
            >
              <ImageUpload
                ref={manageIconRef}
                maxSize={1}
                onChange={([item = null]) =>
                  form.setFieldsValue({ manageIcon: item ? item.url : null })
                }
              />
              <span>图片尺寸：{`${manageIconWidth}*${manageIconHeight}`}（长*高）</span>
            </Form.Item>
          </Col>
        </Row>

        <div className="submit-box ">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {rowId ? '确认修改' : '添加'}
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
    bannerList,
    loading,
  }: {
    bannerList: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    bannerList,
    submitting: loading.effects['bannerList/create'],
  }),
)(OpForm);
