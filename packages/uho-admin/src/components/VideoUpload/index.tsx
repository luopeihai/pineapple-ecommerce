import React from 'react';
import { Upload, message, Progress } from 'antd';
import { VideoCameraAddOutlined, InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import request from '@/utils/request';

import Crypto from 'crypto';

//上传路劲
const ossFilePath = `${OSS_FILE_NAME}/video/cms/${moment(new Date()).format('YYYYMMDD')}`;
//阿里云 oss host
const uploadHost = 'https://output-mingbo.oss-cn-beijing.aliyuncs.com';

class VideoUpload extends React.Component {
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
      uploadName: 'file',
      STS: null,
      file: null,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    //清空图片
    if (nextProps.clear) {
      this.setState({
        file: null,
        uploadStatus: 'init',
      });
    }
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

  componentDidMount() {}

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
    // 获取临时凭证
    return this.fetchSignature()
      .then(() => {
        // 生成文件MD5
        this.setState({ status: 'uploading' });
        return this.md5(file);
      })
      .then((md5) => {
        return this.setState({
          uploadPath: `${ossFilePath}/${md5}.${this.suffix(file.name)}`,
        });
      });
  };

  handleFileChange = (event) => {
    const status = event.file.status;

    this.setState({ uploadStatus: status });

    if (status === 'error') {
      message.error('服务器处理异常');
    } else if (status === 'done') {
      message.success('上传成功');
      const file = `${uploadHost}/${this.state.uploadPath}`;
      this.props.callback(file);

      this.setState({
        file,
        loading: false,
        progressPercent: 100,
      });
    } else if (status === 'uploading') {
      this.setState({
        loading: true,
        progressPercent: Math.floor(event.file.percent * 0.9 + 10),
      });
    }
  };

  renderFileImage = () => {
    const { uploadStatus, progressPercent } = this.state;

    if (uploadStatus === 'uploading') {
      return <Progress type="circle" percent={progressPercent} width={100} />;
    } else if (uploadStatus === 'init') {
      return (
        <React.Fragment>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">视频上传</p>
        </React.Fragment>
      );
    } else if (uploadStatus === 'done') {
      return (
        <React.Fragment>
          {/* <video src={file}></video> */}
          <p className="ant-upload-drag-icon">
            <VideoCameraAddOutlined />
          </p>
          <p className="ant-upload-text">重新上传</p>
        </React.Fragment>
      );
    } else if (uploadStatus === 'error') {
      return <Progress type="circle" status="exception" width={100} percent={progressPercent} />;
    }
  };

  render() {
    const { uploadData, STS, uploadPath, file } = this.state;

    return (
      <div>
        <Upload.Dragger
          showUploadList={false}
          accept=".mp4"
          name="file"
          beforeUpload={this.beforeUpload}
          onChange={this.handleFileChange}
          action={uploadHost}
          data={{
            ...uploadData,
            ...STS,
            key: uploadPath,
          }}
        >
          {this.renderFileImage()}
        </Upload.Dragger>
      </div>
    );
  }
}

export default VideoUpload;
