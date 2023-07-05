import React from 'react';
import { Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { querySelect } from './services';
import { debounce } from 'lodash';
import './index.less';

//请求参数
interface paramsType {
  pageSize?: number; //请求页数
  pageNum?: number; //请求页码
}

//option 参数
interface optionType {
  key: string;
  value: string;
}

//state 类型
interface state {
  loading: boolean; // 搜索
  list: optionType[]; //select list
  defaultValue: optionType;
}

// props 类型
interface props {
  url: string; //请求地址
  params: paramsType; //请求方式
  formatData: optionType; //key 为id value 为text
  method?: string; //请求方法
  onChange(): void; //回调函数
  // selectProps?: any;
  filter():optionType[] //过滤 获取的data
}

class SelectSearch extends React.Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
    };
    this.fetchSearch = debounce(this.fetchSearch, 600);
  }

  //默认 defaultProps
  static defaultProps = {
    url: '', //url
    formatData: {},
    params: {
      pagination: true,
      // orderType: 1, //1-倒序 2-正序
    }, //传参数
    method: 'GET', // 提交方式
    defaultValue: null,
    selectProps: {},
    filter:null
  };

  componentDidMount() {
    const { url } = this.props;
    url.length > 0 && this.fetchSearch();
  }

  //获取关键词
  fetchSearch = (keyword) => {
    let { formatData, url, params, method, defaultValue,filter } = this.props;
    const { key, value } = formatData;

    //区分分页与不分页
    params = params.pagination ? { pageSize: 20, pageNum: 1, ...params } : params;

    //删除 pagination
    Reflect.deleteProperty(params, 'pagination');

    params[value] = keyword;

    const _this = this;

    querySelect(url, { method, params }).then((response) => {
      let data = [];
      //有list的数据结构
      if (response.data.list) {
        data = response.data.list;
      } else if (Array.isArray(data)) {
        //数据为data的数据结构
        data = response.data;
      }

      let list = [];

      //当没有搜索内容是否 显示初始值

      if (data.length > 0) {

         //过滤data
        if(filter){
          data = filter(data)
        }


        list = data.map((item) => ({
          key: item[key],
          value: item[value],
        }));
 
       
      }

      //存在默认值
      if (defaultValue) {
        //不存在
        if (list.length === 0 || list.findIndex((item) => item.key === defaultValue.key) === -1) {
          list.push(defaultValue);
        }
      }

      _this.setState({
        loading: false,
        list,
      });
    });
  };

  hanldefetchSearch = (keyword) => {
    this.setState({ loading: true, list: [] }, () => {
      this.fetchSearch(keyword);
    });
  };

  //点击值 回调给父类
  hanldeOnChange = (selectValue, option) => {
    if (selectValue) {
      const { list } = this.state;
      //清空返回null
      this.props.onChange(
        option && option.key ? list.find((item) => option.key == item.key) : null,
      );
    } else {
      //清空
      this.props.onChange(null);
    }
  };

  render() {
    const { list, loading } = this.state;
    let { defaultValue, selectProps } = this.props;
    const { Option } = Select;

    selectProps = {
      allowClear: true,
      labelInValue: true,
      showSearch: true,
      ...selectProps,
    };

    if (defaultValue) {
      selectProps['defaultValue'] = defaultValue;
    }

    return (
      <Select
        {...selectProps}
        placeholder="请选择"
        onSearch={this.hanldefetchSearch}
        onChange={this.hanldeOnChange}
        className="search"
        notFoundContent={loading ? <LoadingOutlined /> : '暂无数据'}
      >
        {list.map((item) => (
          <Option key={item.key} value={item.value}>
            {item.value}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SelectSearch;
