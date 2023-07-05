import React from 'react';
import { Spin } from 'antd';

import './index.less';

export default class PageInnerLoading extends React.Component {
  constructor(props) {
    super(props);
    this.defaultTip = 'uho正在努力加载中';
  }

  render() {
    // const loadingIcon = <Icon type="loading" spin />
    const { loading, showTip, className, ...otherProps } = this.props;

    // const wrapperClassName = loading ? 'fc-page-bg fc-page-loading' : 'fc-page-loading'

    return (
      <Spin
        wrapperClassName="fc-page-loading"
        // indicator={loadingIcon}
        spinning={loading}
        tip="uho正在努力加载中"
        {...otherProps}
      />
    );
  }
}
