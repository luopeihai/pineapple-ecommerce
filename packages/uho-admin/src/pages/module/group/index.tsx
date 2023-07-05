import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Divider, Modal, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect, AnyAction, Dispatch, Link } from 'umi';
import { GroupItem } from './data.d';
import { queryGroup } from './service';
import SelectSearch from '@/components/SelectSearch';
import Form from './Form';
import { StateType } from './model';

interface tableProps {
  dispatch: Dispatch<AnyAction>;
  groupList: StateType;
}

const GroupList: React.FC<tableProps> = ({ dispatch, groupList }) => {
  const actionRef = useRef<ActionType>();
  const { loading } = groupList;

  const [collapsed, setCollapsed] = useState(false);
  //时间戳
  const [rangePicker, setRangePicker] = useState({});
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  //修改info
  const [editInfo, setEditInfo] = useState({});

  /**
   * constructor
   */
  useEffect(() => {
    if (loading && actionRef.current) {
      actionRef.current.reload();
      handleModalVisible(false);
    }
  }, [groupList]);

  const onEdit = (item) => {
    setEditInfo({
      groupName: item.groupName,
      groupId: item.groupId,
    });
    handleModalVisible(true);
  };

  const columns: ProColumns<GroupItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: '组别名称',
      dataIndex: 'groupName',

      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/config/group',
          formatData: {
            key: 'groupId',
            value: 'groupName',
          },
          onChange: function (value) {
            value ? config.onChange(value.value) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
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
          <a onClick={() => onEdit(record)}>修改</a>

          <Divider type="vertical" />
          <a
            onClick={() =>
              Modal.confirm({
                okText: '确认',
                cancelText: '取消',
                title: '确定要删除？',
                onOk: () =>
                  dispatch({
                    type: 'groupList/delete',
                    payload: record.groupId,
                  }),
              })
            }
          >
            删除
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<GroupItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="moduleId"
        request={(params) => queryGroup(params)}
        columns={columns}
        params={{
          ...rangePicker,
        }}
        onReset={() => {
          setRangePicker({});
        }}
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
      <Form
        onCancel={() => {
          handleModalVisible(false);
          setEditInfo({});
        }}
        modalVisible={createModalVisible}
        {...editInfo}
      ></Form>
    </PageHeaderWrapper>
  );
};

export default connect(({ groupList }: { groupList: StateType }) => ({
  groupList,
}))(GroupList);
