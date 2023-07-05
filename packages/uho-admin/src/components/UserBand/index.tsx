import { Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { setUserBand, setUserUnBand } from '@/services/user';

interface props {
  userId: number; //用户id
  userBand: boolean; //true-禁言 false-不禁言
}

const UserBand: React.FC<props> = (props) => {
  const [userBand, setUserBandState] = useState(props.userBand);

  useEffect(() => {
    setUserBandState(props.userBand);
  }, [props.userBand]);

  //返回 解禁 or 禁言
  const getUserBandfun = () =>
    userBand ? setUserUnBand({ userId: props.userId }) : setUserBand({ userId: props.userId });

  const onSetUserBand = () => {
    // const hide = message.loading('正在操作');
    getUserBandfun()
      .then(function (response) {
        // hide();
        if (response.data.result) {
          message.success('操作成功');
          // _this.fetchData();
          setUserBandState(!userBand);
        } else {
          message.error(response.message);
        }
      })
      .catch(function (error) {
        // hide();
        message.error(error.message);
      });
  };

  return (
    <div className="user-band-box">
      <Button type="primary" onClick={onSetUserBand}>
        {userBand ? ' 已禁言' : '禁言此用户'}
      </Button>
    </div>
  );
};

export default UserBand;
