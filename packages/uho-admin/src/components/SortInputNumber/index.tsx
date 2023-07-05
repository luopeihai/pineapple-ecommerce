import React, { Fragment, useState } from 'react';
import { Select, InputNumber, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// props 类型
interface sortInputNumberProps {
  initValue: number; //排序值
  onChange(): void; //回调函数
  maxSort: number; //最大值
}

const SortInputNumber: React.FC<sortInputNumberProps> = ({ onChange, initValue, maxSort = 0 }) => {
  const [value, setValue] = useState(initValue);
  const [isEdit, setIsEdit] = useState(false);

  /**
   * constructor
   */
  //   useEffect(() => {

  //   }, [initValue]);

  const onBlur = () => {
    setIsEdit(false);

    if (maxSort && value > maxSort) {
      message.error('超出最大值!');
      setValue(initValue);
    } else {
      //值修改时候才发请求
      initValue !== value && onChange(value);
    }
  };

  return (
    <Fragment>
      {isEdit ? (
        <InputNumber onBlur={onBlur} value={value} onChange={setValue} min={0} autoFocus />
      ) : (
        <span>
          {value}
          <EditOutlined style={{ marginLeft: '5px' }} onClick={() => setIsEdit(true)} />
        </span>
      )}
    </Fragment>
  );
};

export default SortInputNumber;
