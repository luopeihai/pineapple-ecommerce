import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { renderBreadcrumb } from '@/components/Breadcrumb';
import { QuestionTableListItem } from '../data.d';
import { queryList } from './services';
import { getModuleBymoduleId, getGroupByGroupId } from '@/services/game';
import SortInputNumber from '@/components/SortInputNumber';
import { StateType } from './model.ts';

import { Link, connect } from 'umi';
import SelectSearch from '@/components/SelectSearch';
import RangeNumber from '@/components/RangeNumber';
import OpForm from './_form';

interface tableProps {
  dispatch: Dispatch<AnyAction>;
  bannerQuestionList: StateType;
  match: any;
}

const TableList: React.FC<tableProps> = ({ dispatch, bannerQuestionList, match }) => {
  const actionRef = useRef<ActionType>();
  const { loading } = bannerQuestionList;
  const { bannerId, moduleId, title } = JSON.parse(match.params.data);

  //排序 1-倒序 2-正序
  const [sortType, setSortType] = useState<number>(2);
  const [collapsed, setCollapsed] = useState(false);

  //时间戳
  const [rangePicker, setRangePicker] = useState({});
  //number区间
  const [numInfo, setNumInfo] = useState({});
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  /**
   * constructor
   */
  useEffect(() => {
    if (loading && actionRef.current) {
      actionRef.current.reload();
      handleModalVisible(false);
    }
  }, [bannerQuestionList]);

  const columns: ProColumns<QuestionTableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: '问题ID',
      dataIndex: 'questionId',
    },
    {
      title: '游戏',
      dataIndex: 'moduleId',
      hideInSearch: true,
      renderText: (moduleId, _) => getModuleBymoduleId(moduleId).moduleName,
    },
    {
      title: '组别',
      dataIndex: 'moduleGroupId',
      renderText: (groupId, _) => getGroupByGroupId(groupId).groupName,

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
      title: '标题',
      width: 150,
      ellipsis: true,
      dataIndex: 'title',
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/community/question',
          formatData: {
            key: 'questionId',
            value: 'title',
          },
          onChange: function (value) {
            value ? config.onChange(value.value) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '内容',
      dataIndex: 'includeMultimediaText',
      valueType: 'textarea',
      hideInSearch: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: '排序',
      hideInSearch: true,
      sorter: true,
      dataIndex: 'questionSort',
      render: (val, record) => (
        <SortInputNumber
          initValue={val}
          onChange={(sort) => {
            dispatch({
              type: 'bannerQuestionList/editSort',
              payload: {
                mainId: record.mainId,
                sort,
              },
            });
          }}
        />
      ),
    },
    {
      title: '及时奖',
      dataIndex: 'awardInTime',
      hideInSearch: true,
      render: (_, row) => {
        return row.awardInTime ? row.bonusNum : '无';
      },
    },
    {
      title: 'ho点',
      hideInSearch: true,
      dataIndex: 'bonusNum',
    },
    {
      title: '审查状态',
      dataIndex: 'reviewStatus',
      valueEnum: {
        0: { text: '等待审核', status: 'Default' },
        1: { text: '通过审核', status: 'Success' },
      },
    },
    {
      title: '关注数(总数)',
      dataIndex: 'focusNum',
      renderFormItem: (type, config, form) => {
        if (type === 'form') {
          return null;
        }

        const onChange = (rangeValue) => {
          const rangeObj = rangeValue
            ? {
                leftFocusNum: rangeValue.minValue,
                rightFocusNum: rangeValue.maxValue,
              }
            : {};

          setNumInfo(rangeObj);
        };

        return <RangeNumber onChange={onChange} />;
      },
    },
    {
      title: '回答数量',
      hideInSearch: true,
      dataIndex: 'answerNum',
    },
    {
      // title: '采纳情况',
      title: '采纳情况',
      dataIndex: 'acceptStatus',
      valueEnum: {
        '-1': { text: '关闭问题', status: 'Error' },
        '0': { text: '未采纳', status: 'Default' },
        '1': { text: '系统采纳', status: 'Success' },
        '2': { text: '题主采纳', status: 'Success' },
      },
    },
    {
      dataIndex: 'questionerId',
      title: (_, type) => (type === 'table' ? '提问者ID' : '提问者昵称'),
      renderFormItem: (item, config, form) => {
        const propsSelectSearch = {
          url: '/user/info/listUserByName',
          formatData: {
            key: 'id',
            value: 'nickName',
          },
          onChange: function (value) {
            value ? config.onChange(value.key) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '提问者昵称',
      hideInSearch: true,
      dataIndex: 'questionerName',
    },

    {
      title: '发布时间',
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
          <Link to={`/post/question/${record.questionId}`}>查看</Link>
          <Divider type="vertical" />

          <a
            onClick={() =>
              Modal.confirm({
                okText: '确认',
                cancelText: '取消',
                title: '是否要删除?',
                onOk: () =>
                  dispatch({
                    type: 'bannerQuestionList/deleteItem',
                    payload: {
                      bannerId,
                      mainId: record.mainId,
                    },
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
    routes = [
      ...routes,
      { path: '/post/recommend/banner/list', breadcrumbName: 'banner列表' },
      { breadcrumbName: title },
    ];
    return renderBreadcrumb(routes);
  };

  return (
    <PageHeaderWrapper title={false} pageHeaderRender={pageHeaderRender}>
      <ProTable<QuestionTableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        columns={columns}
        rowKey="questionId"
        request={(params) => queryList(params)}
        onReset={() => {
          setRangePicker({});
          setNumInfo({});
        }}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<CommentTableListItem>;
          if (sorterResult.field && sorterResult.field === 'questionSort') {
            setSortType(sorterResult.order === 'ascend' ? 1 : 2);
          }
        }}
        params={{
          sortType,
          bannerId,
          ...rangePicker,
          ...numInfo,
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
      <OpForm
        onCancel={() => {
          handleModalVisible(false);
        }}
        modalVisible={modalVisible}
        bannerId={bannerId}
        moduleId={moduleId}
      ></OpForm>
    </PageHeaderWrapper>
  );
};

export default connect(({ bannerQuestionList }: { bannerQuestionList: StateType }) => ({
  bannerQuestionList,
}))(TableList);
