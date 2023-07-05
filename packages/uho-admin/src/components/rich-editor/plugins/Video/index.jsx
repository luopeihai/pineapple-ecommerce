import React from 'react';
import { Upload, Modal, message } from 'antd';
import {
  FileImageOutlined,
  PlusOutlined,
  LoadingOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import request from '@/utils/request';
import ImageUpload from '@/components/ImageUpload';
import VideoUpload from '@/components/VideoUpload';

const addVideo = (change, src, poster) => {
  try {
    change.insertBlock({
      type: 'video',
      data: {
        src,
        poster,
      },
      isVoid: true,
    });
    change.insertBlock({
      type: 'paragraph',
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
      clear: false,
    };
    this.file = null;
    this.poster = null;
  }

  hideModal = (event) => {
    this.setState({ modalVisible: false });
  };

  showModal = (event) => {
    this.setState({ modalVisible: true });
  };

  //确认关闭
  onOk = () => {
    const { actionProps, value, onChange } = this.props;
    const { fileList } = this.image.state;

    //有上传图片 需要回调
    if (this.file && fileList.length > 0) {
      // actionProps(this.file, this.poster);
      onChange(addVideo(value.change(), this.file, fileList[0].url));
      // //初始化 file
      this.setState({
        modalVisible: false,
        clear: true,
      });
    } else {
      message.error('视频或封面图不能为空');
    }
  };

  render() {
    const { modalVisible, clear } = this.state;
    return (
      <span>
        <VideoCameraAddOutlined onClick={this.showModal} />
        <Modal
          onCancel={() => this.setState({ modalVisible: false, clear: true })}
          onOk={this.onOk}
          visible={modalVisible}
          title="添加视频"
          okText="确定"
          cancelText="取消"
        >
          <VideoUpload
            clear={clear}
            callback={(file) => {
              this.file = file;
            }}
          />
          <h4>视频封面图</h4>
          <ImageUpload clear={clear} maxSize={1} ref={(ele) => (this.image = ele)} />
        </Modal>
      </span>
    );
  }
}

class Video extends React.Component {
  get status() {
    return this.props.status || 'SUCCESS';
  }

  componentDidMount() {}

  render() {
    const { isSelected, src, poster } = this.props;
    return (
      <video
        className={`image ${isSelected ? 'selected' : ''}`}
        src={src}
        poster={poster}
        controls={true}
        playsInline={true}
        controlsList="nodownload"
      />
    );
  }
}

export default (options) => {
  return {
    action: 'video', //名称
    changes: {
      addVideo,
    },
    components: {
      ControlButton,
    },
    plugins: {
      renderNode: (props) => {
        const { node, isSelected, key, editor } = props;
        if (node.type === 'video') {
          return (
            <Video
              src={node.data.get('src')}
              poster={node.data.get('poster')}
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
