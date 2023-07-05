import React from 'react';
import { Upload, Modal, message } from 'antd';
import { FileImageOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import ImageUpload from '@/components/ImageUpload';

const addImage = (change, src) => {
  try {
    change.insertBlock({
      type: 'image',
      isVoid: true,
      data: { src },
    });
    change.insertBlock({
      type: 'paragraph',
    });
  } catch (err) {
    message.error('插入失败');
  }
  return change;
};

const addImages = (change, imageList) => {
  try {
    imageList.forEach((item, index) => {
      //错误的文件不插入
      if (item.status !== 'error') {
        if (index) {
          change.insertBlock({
            type: 'paragraph',
          });
        }
        change.insertBlock({
          type: 'image',
          isVoid: true,
          data: { src: item.url },
        });
      }
    });
  } catch (err) {
    message.error('插入失败');
  }
  return change;
};

class ControlButton extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      file: null,
      clear: false,
    };
  }

  hideModal = () => {
    this.setState({ modalVisible: false, clear: true });
    this.image.cleanImage();
  };

  showModal = (event) => {
    this.setState({ modalVisible: true });
  };

  //确认关闭
  onOk = () => {
    const { actionProps, value, onChange } = this.props;
    const { fileList } = this.image.state;

    if (fileList.length > 0) {
      //有上传图片 需要回调

      // actionProps(fileList);

      onChange(addImages(value.change(), fileList));
      // //初始化 file
      this.setState({
        modalVisible: false,
        clear: true,
      });

      this.image.cleanImage();
    }
  };

  render() {
    const { modalVisible, clear } = this.state;
    return (
      <span>
        <FileImageOutlined onClick={this.showModal} />
        <Modal
          onCancel={this.hideModal}
          onOk={this.onOk}
          visible={modalVisible}
          title="添加图片"
          okText="确定"
          cancelText="取消"
        >
          <ImageUpload clear={clear} ref={(ele) => (this.image = ele)} />
        </Modal>
      </span>
    );
  }
}

class Image extends React.Component {
  get status() {
    return this.props.status || 'SUCCESS';
  }

  componentDidMount() {}

  render() {
    const { isSelected, src } = this.props;
    return (
      <p>
        <img className={`image ${isSelected ? 'selected' : ''}`} src={src} />
      </p>
    );
  }
}

export default (options) => {
  return {
    action: 'image', //名称
    changes: {
      addImage,
    },
    components: {
      ControlButton,
    },
    plugins: {
      renderNode: (props) => {
        const { node, isSelected, key, editor } = props;
        if (node.type === 'image') {
          return (
            <Image
              src={node.data.get('src')}
              isSelected={isSelected}
              editorKey={key}
              editor={editor}
              status={node.data.get('status')}
            />
          );
        }
      },
    },
  };
};
