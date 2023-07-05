import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import './editor.less';
import {
  StrikeThrough,
  Bold,
  Italic,
  Quote,
  Hr,
  Header,
  Link,
  Image,
  Common,
  Emoji,
  Game,
  History,
  Video,
} from './plugins';
import { FullScreen } from './features';
import HtmlSerializer from './utils/html';

export default class FungoEditor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
      value: HtmlSerializer.deserialize(''),
      tools: ['image', 'video'],
    };

    this.plugins = [Image().plugins, Video().plugins];

    this.preview = this.preview.bind(this);
  }

  reset = (html) => {
    this.setState({ value: HtmlSerializer.deserialize(html) });
  };

  preview() {
    return Preview.getHTML(HtmlSerializer.serialize(this.state.value));
  }

  onChange = ({ value }) => {
    this.setState({ value });
    const originalHtml = HtmlSerializer.serialize(value);

    this.props.onChange({
      originalHtml,
      wordText: originalHtml.replace(/<[^>]+>/g, ''),
      ...this.getParamsInfo(originalHtml),
    });
  };

  //获取文字符号 图片 / 视频
  //提交数据 处理格式
  getParamsInfo = (originalHtml) => {
    const images = [],
      videos = [];
    //处理 includeMultimediaText
    let includeMultimediaText = '';
    includeMultimediaText = originalHtml.replace(/<img(?:.|\s)*?>/gi, function (item) {
      return '【图片】';
    });

    includeMultimediaText = includeMultimediaText.replace(/<video(?:.|\s)*?>/gi, function (item) {
      return '【视频】';
    });

    const parser = new DOMParser().parseFromString(originalHtml, 'text/html');

    //处理 images
    for (let img of parser.getElementsByTagName('img')) {
      images.push(`"${img.src}"`);
    }

    //处理 video
    for (let video of parser.getElementsByTagName('video')) {
      videos.push({
        url: video.src,
        cover: video.poster,
      });
    }

    return {
      includeMultimediaText: includeMultimediaText.replace(/<[^>]+>/g, ''),
      images,
      videos,
    };
  };

  handleFullScreen = (isFull) => {
    this.setState({ fullScreen: isFull });
  };

  renderConfigPlugins = () => {
    const { tools, value } = this.state;
    // const { uploadProps } = this.props;

    const configPlugins = tools.map((item) => this.configPlugins(item));

    return configPlugins.map((item, index) => {
      const Button = item().components.ControlButton;

      let actionProps = {};
      if (item().action === 'image') {
        actionProps = this.callbackImage;
      } else if (item().action === 'video') {
        actionProps = this.callbackVideo;
      }

      return (
        <Button key={index} onChange={this.onChange} value={value} actionProps={actionProps} />
      );
    });
  };

  //图片回调
  callbackImage = (url) => {
    // this.images.push(`"${url}"`);
  };

  //视频回调
  callbackVideo = (url, poster) => {
    // this.videos.push({
    //   url,
    //   cover: poster,
    // });
  };

  configPlugins = (value) => {
    if (value === 'bold') {
      return Bold;
    } else if (value === 'italic') {
      return Italic;
    } else if (value === 'hr') {
      return Hr;
    } else if (value === 'header') {
      return Header;
    } else if (value === 'emoji') {
      return Emoji;
    } else if (value === 'link') {
      return Link;
    } else if (value === 'image') {
      return Image;
    } else if (value === 'history') {
      return History;
    } else if (value === 'video') {
      return Video;
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.tools) {
      this.setState({
        tools: nextProps.tools,
      });
    }
  }

  render() {
    const value = this.state.value;

    return (
      <div
        className={`fungo-editor 
				${this.state.fullScreen ? 'full-screen' : ''}`}
      >
        <div className="fungo-toolbar">
          {this.renderConfigPlugins()}

          <FullScreen isFullScreen={this.state.fullScreen} onChange={this.handleFullScreen} />
        </div>
        <Editor
          className="fungo-contenteditable"
          plugins={this.plugins}
          value={value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
