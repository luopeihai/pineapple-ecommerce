import { MinusOutlined } from '@ant-design/icons';
import { InputNumber, message } from 'antd';
import React, { useState } from 'react';
import style from './index.less';

interface RangeNumberProps {
  onChange: (rangeArray: Array<number>) => void;
}

const RangeNumber: React.FC<RangeNumberProps> = (props) => {
  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();

  /**
   * 失去焦点后 对比值
   */
  const contrast = () => {
    //排除未填写
    if (minValue !== undefined && maxValue !== undefined) {
      if (minValue === '') {
        message.error('请填写最小值');
        props.onChange(null);
      } else if (maxValue === '') {
        message.error('请填写最大值');
        props.onChange(null);
      } else if (minValue > maxValue) {
        message.error('最小值不能大于最大值');
      } else {
        props.onChange({
          minValue,
          maxValue,
        });
      }
    }
  };

  return (
    <div className="">
      <InputNumber
        min={0}
        precision={0}
        onChange={(value) => setMinValue(value)}
        onBlur={contrast}
      />
      <MinusOutlined className={style.between} />
      <InputNumber
        min={0}
        precision={0}
        onChange={(value) => setMaxValue(value)}
        onBlur={contrast}
      />
    </div>
  );
};

export default RangeNumber;
