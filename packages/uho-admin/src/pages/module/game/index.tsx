import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Divider, InputNumber, Modal, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect, AnyAction, Dispatch, Link } from 'umi';

import { GameItem } from '@/data/game';
import { queryGame } from '@/services/game';
import SelectSearch from '@/components/SelectSearch';
import SortInputNumber from '@/components/SortInputNumber';
import GameForm from './_Form';
import { StateType } from './model';

interface tableProps {
  dispatch: Dispatch<AnyAction>;
  gameList: StateType;
}

//其他游戏排序最大值
const gameCommunityMax = 9999998;

const GameList: React.FC<tableProps> = ({ dispatch, gameList }) => {
  const actionRef = useRef<ActionType>();
  const { loading } = gameList;

  const [collapsed, setCollapsed] = useState(false);
  //时间戳
  const [rangePicker, setRangePicker] = useState({});
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  //选中的游戏
  const [moduleId, setModuleId] = useState(0);

  /**
   * constructor
   */
  useEffect(() => {
    if (loading && actionRef.current) {
      actionRef.current.reload();
      handleModalVisible(false);
      setModuleId(0);
    }
  }, [gameList]);

  const isIntegratedCommunityMax = (row) => row.moduleName === '综合讨论区';

  const columns: ProColumns<GameItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: '游戏名称',
      dataIndex: 'moduleName',
      width: 200,
      ellipsis: true,
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/config/module/listModule',
          formatData: {
            key: 'moduleId',
            value: 'moduleName',
          },
          onChange: function (value) {
            value ? config.onChange(value.value) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '包含组别',
      dataIndex: 'groupId',
      renderText: (val, record) => record.groupName.join(' '),
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/config/group',
          formatData: {
            key: 'groupId',
            value: 'groupName',
          },
          onChange: function (value) {
            value ? config.onChange(value.key) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '排序',
      hideInSearch: true,
      dataIndex: 'moduleSort',
      render: (val, record) => {
        const { moduleId } = record;

        return isIntegratedCommunityMax(record) ? (
          val
        ) : (
          <SortInputNumber
            initValue={val}
            maxSort={gameCommunityMax}
            onChange={(sort) => {
              dispatch({
                type: 'gameList/editSort',
                payload: {
                  moduleId,
                  sort,
                },
              });
            }}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <DatePicker.RangePicker
            showTime
            {...rest}
            onChange={(_, data) => {
              //当选择为空时候 清空
              const pickerObj =
                data[0].length > 0
                  ? {
                      createStartDate: new Date(data[0]).getTime(),
                      createEndDate: new Date(data[1]).getTime(),
                    }
                  : {};
              setRangePicker({ ...pickerObj });
            }}
          />
        );
      },
    },
    {
      title: '修改时间',
      hideInSearch: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Link
            to={`/module/game/${JSON.stringify({
              moduleId: record.moduleId,
              moduleName: record.moduleName,
            })}`}
          >
            查看
          </Link>

          {!isIntegratedCommunityMax(record) && (
            <>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  handleModalVisible(true);
                  setModuleId(record.moduleId);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  Modal.confirm({
                    okText: '确认',
                    cancelText: '取消',
                    title: '确定要删除？',
                    onOk: () =>
                      dispatch({
                        type: 'gameList/delete',
                        payload: record.moduleId,
                      }),
                  })
                }
              >
                删除
              </a>
            </>
          )}
        </>
      ),
    },
  ];

  const onCancel = () => {
    handleModalVisible(false);
    setModuleId(0);
  };

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<GameItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="moduleId"
        request={(params) => queryGame(params)}
        columns={columns}
        params={{
          ...rangePicker,
        }}
        onReset={() => {
          setRangePicker({});
        }}
        form={{ labelCol: { span: 4 } }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 添加
          </Button>,
        ]}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
      />
      <GameForm onCancel={onCancel} moduleId={moduleId} modalVisible={modalVisible} />
    </PageHeaderWrapper>
  );
};

export default connect(({ gameList }: { gameList: StateType }) => ({
  gameList,
}))(GameList);
