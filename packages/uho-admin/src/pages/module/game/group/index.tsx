import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect } from 'umi';
import { renderBreadcrumb } from '@/components/Breadcrumb';
import { GroupItem } from '@/data/game';
import { queryGroupByModuleId } from '@/services/game';
import SelectSearch from '@/components/SelectSearch';
import SortInputNumber from '@/components/SortInputNumber';
import { StateType } from '../model';
import CreateForm from './CreateForm';

const GameGroupList: React.FC<> = (props) => {
  const actionRef = useRef<ActionType>();
  const { gameGroupList, dispatch } = props;
  const { loading } = gameGroupList;
  const { moduleId, moduleName } = JSON.parse(props.match.params.data);

  const [collapsed, setCollapsed] = useState(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  /**
   * constructor
   */
  useEffect(() => {
    if (loading && actionRef.current) {
      location.reload();
      // window.actionRef.current.reload();
      // handleModalVisible(false);
    }
  }, [gameGroupList]);

  const columns: ProColumns<GroupItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: '组别名称',
      dataIndex: 'groupId',
      width: 200,
      ellipsis: true,
      renderText: (_, record) => record.groupName,
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: `/config/module/listModuleGroup`,
          params: {
            moduleId,
            pagination: false,
          },
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
      title: '问题数目',
      hideInSearch: true,
      dataIndex: 'questionCount',
      width: 72,
    },
    {
      title: '排序',
      hideInSearch: true,
      dataIndex: 'linkSort',
      render: (val, record) => {
        const { id } = record;
        return (
          <SortInputNumber
            initValue={val}
            onChange={(sort) => {
              dispatch({
                type: 'gameGroupList/editGroupSort',
                payload: {
                  moduleGroupId: id,
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
      hideInSearch: true,
      valueType: 'dateTime',
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() =>
              Modal.confirm({
                okText: '确认',
                cancelText: '取消',
                title: '确定要删除？',
                onOk: () =>
                  dispatch({
                    type: 'gameGroupList/delete',
                    payload: record.id,
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

  //自定义 面包屑
  const pageHeaderRender = (routersInfo) => {
    let {
      breadcrumb: { routes },
    } = routersInfo;
    routes = [...routes, { breadcrumbName: moduleName }];
    return renderBreadcrumb(routes);
  };

  return (
    <PageHeaderWrapper title={false} pageHeaderRender={pageHeaderRender}>
      <ProTable<GroupItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="groupId"
        request={(params) => queryGroupByModuleId(params)}
        columns={columns}
        params={{
          moduleId,
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
        pagination={false}
      />
      <CreateForm
        onCancel={() => {
          handleModalVisible(false);
        }}
        modalVisible={createModalVisible}
        moduleId={moduleId}
      ></CreateForm>
    </PageHeaderWrapper>
  );
};

export default connect(({ gameGroupList }: { gameGroupList: StateType }) => ({
  gameGroupList,
}))(GameGroupList);
