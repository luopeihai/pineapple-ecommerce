import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import moment from 'moment';
import request from '@/utils/request';
import { generateUUID } from '@/utils/tool';
import Crypto from 'crypto';

//上传路劲
const ossFilePath = `${OSS_FILE_NAME}/image/cms/${moment(new Date()).format('YYYYMMDD')}`;

//阿里云 oss host
const uploadHost = 'https://output-mingbo.oss-cn-beijing.aliyuncs.com';

class ImageUpload extends React.Component {
  static propTypes = {
    maxSize: PropTypes.number,
  };

  static defaultProps = {
    maxSize: 9,
  };

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      uploadStatus: 'init',
      uploadData: {
        success_action_status: 200,
        policy: new Buffer(
          JSON.stringify({
            expiration: '2021-01-01T12:00:00.000Z',
            conditions: [{ bucket: 'output-mingbo' }],
          }),
        ).toString('base64'),
      },
      uploadPath: '',
      STS: null,
      fileList: [], //上传的图片
      maxSize: this.props.maxSize, //默认最多传9张图
      previewVisible: false, //预览弹出框
      previewImage: '', //预览的图片
    };

    //上传的图片
    this.fileUploadIng = [];

    //选择的个数
    this.fileLength = 0;
  }

  /**
   * 获取临时STS凭证
   */
  fetchSignature = () => {
    if (this.state.STS) {
      return Promise.resolve();
    } else {
      const localSTS = this.getLocalSTS();
      if (localSTS) {
        this.setState({ STS: localSTS });
        return Promise.resolve();
      } else {
        return request(`/system/getOssTempToken`).then((res) => {
          const STS = {
            Signature: this.signature(
              new Buffer(
                JSON.stringify({
                  expiration: '2021-01-01T12:00:00.000Z',
                  conditions: [{ bucket: 'output-mingbo' }],
                }),
              ).toString('base64'),
              res.data.accessKeySecret,
            ),
            OSSAccessKeyId: res.data.accessKeyId,
            'x-oss-security-token': res.data.securityToken,
          };
          this.setLocalSTS(STS);
          this.setState({ STS });
          return true;
        });
      }
    }
  };

  //获取图片
  getImageList = () => this.state.fileList.map((item) => item.url);

  //设置图片
  setFileList = (arrayUrl) => {
    this.setState({
      fileList: arrayUrl.map((item) => {
        const guid = generateUUID();
        return {
          name: guid,
          status: 'done',
          uid: guid,
          url: item,
        };
      }),
    });
  };

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    //清空图片
    if (nextProps.clear) {
      this.setState({
        file: [],
      });
    }
  }

  getLocalSTS = () => {
    const STSInfo = JSON.parse(sessionStorage.getItem('STS'));
    if (!STSInfo || !STSInfo.expires) return null;
    if (new Date(STSInfo.expires) < new Date()) return null;
    delete STSInfo.expires;
    return STSInfo;
  };

  setLocalSTS = (data) => {
    data.expires = new Date(new Date().getTime() + 10 * 60 * 1000);
    sessionStorage.setItem('STS', JSON.stringify(data));
  };

  /**
   * 生成上传签名
   * @param {string} policyText
   * @param {string} accesskey
   * @return siginature
   */
  signature = (policyText, accesskey) => {
    const signature = Crypto.Hmac('sha1', accesskey).update(policyText).digest('base64');
    return signature;
  };

  /**
   * 生成MD5签名
   * @param {File} file 文件
   * @return hex 签名
   */
  md5 = (file) => {
    const hash = Crypto.Hash('md5');
    const chunkSize = 2 * 1024 * 1024;
    const chunkLen = Math.ceil(file.size / chunkSize);
    const blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
    const fileReader = new FileReader();
    let bs = fileReader.readAsBinaryString;
    let currentChunk = 0;

    const loadNext = (chunkSize) => {
      let start = currentChunk * chunkSize;
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      if (bs) fileReader.readAsBinaryString(blobSlice.call(file, start, end));
      else fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    return new Promise((resolve, reject) => {
      try {
        loadNext(chunkSize);
      } catch (err) {
        reject(err);
      }

      // 文件读取完毕之后的处理
      fileReader.onload = (e) => {
        try {
          hash.update(e.target.result);
          currentChunk += 1;

          if (currentChunk < chunkLen) {
            loadNext();
          } else {
            resolve(hash.digest('hex'));
          }
        } catch (err) {
          reject(err);
        }
      };
    });
  };

  /**
   * 获取文件后缀名
   * @param {string} name 文件名
   * @return {string} 文件后缀名
   */
  suffix = (file_name) => {
    const index = file_name.lastIndexOf('.');
    const strtype = file_name.substr(index + 1, file_name.length);
    return strtype.toLowerCase();
  };

  beforeUpload = (file) => {
    //选中文件数累加
    this.fileLength = this.fileLength + 1;
    const { maxSize } = this.state;
    //超过上传最大数

    if (maxSize < this.fileLength) {
      message.error(`最多上传${maxSize}张图片`);
      return false;
    }

    // 获取临时凭证
    return this.fetchSignature()
      .then(() => {
        // 生成文件MD5
        this.setState({ status: 'uploading' });
        return this.md5(file);
      })
      .then((md5) => {
        const uploadPath = `${ossFilePath}/${md5}.${this.suffix(file.name)}`;

        //记录 上传图片路劲
        this.fileUploadIng.push({
          uid: file.uid,
          name: file.name,
          status: 'uploading',
          url: uploadHost + '/' + uploadPath,
        });

        return this.setState({
          uploadPath,
        });
      });
  };

  handleChange = ({ file }) => {
    //
    const { fileList } = this.state;
    const { onChange } = this.props;
    const { status, uid } = file;
    //正在上传 并且 为第一次上传
    if (status === 'uploading' && !fileList.some((item) => item.uid === uid)) {
      const changeFile = this.fileUploadIng.find((item) => item.uid === uid);
      changeFile.status = 'uploading';
      this.setState(
        {
          fileList: [...fileList, changeFile],
        },
        () => {
          //有回调 执行回调
          onChange && onChange(this.state.fileList);
        },
      );
    } else {
      //成功 or 错误
      this.setState({
        fileList: fileList.map((item) => {
          if (item.uid === uid) {
            item.status = status;
          }
          return item;
        }),
      });
    }
  };

  //删除图片
  hanleRemove = (file) => {
    this.fileLength = this.fileLength - 1;
    const { fileList } = this.state;
    const { onChange } = this.props;
    this.setState(
      {
        fileList: fileList.filter((item) => item.uid !== file.uid),
      },
      () => {
        //有回调 执行回调
        onChange && onChange(this.state.fileList);
      },
    );
  };

  //预览图片
  handlePreview = (file) => {
    this.setState({
      previewVisible: true,
      previewImage: file.url,
    });
  };

  //清空图片
  cleanImage = () => {
    this.setState({
      fileList: [],
    });
  };

  render() {
    const {
      uploadData,
      STS,
      uploadPath,
      fileList,
      maxSize,
      previewVisible,
      previewImage,
    } = this.state;
    const uploadProps = {
      multiple: maxSize > 1 ? true : false,
    };

    return (
      <div style={{ minHeight: '120px', minWidth: '120px' }}>
        <Upload
          {...uploadProps}
          accept=".jpeg,.png,.gif,.jpg"
          listType="picture-card"
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          fileList={fileList}
          action={uploadHost}
          onRemove={this.hanleRemove}
          onPreview={this.handlePreview}
          data={{
            ...uploadData,
            ...STS,
            key: uploadPath,
          }}
        >
          {fileList.length < maxSize ? (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">上传图片</div>
            </div>
          ) : null}
        </Upload>
        <Modal
          visible={previewVisible}
          title="图片预览"
          footer={null}
          width="1000px"
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;
