import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, message, DatePicker, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { QuestionTableListItem } from '../data.d';
import {
  queryQuestion,
  questionDeleted,
  questionTopQuestion,
  questionCancelTopQuestion,
  questionCheckRecommend,
} from '../service';
import { getModuleBymoduleId, getGroupByGroupId } from '@/services/game';

import { Link } from 'umi';
import SelectSearch from '@/components/SelectSearch';
import RangeNumber from '@/components/RangeNumber';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  //排序 1-倒序 2-正序
  const [orderType, setOrderType] = useState<number>(1);
  const [collapsed, setCollapsed] = useState(false);

  //时间戳
  const [rangePicker, setRangePicker] = useState({});
  //number区间
  const [numInfo, setNumInfo] = useState({});

  async function opTop(questionId: string, isTop: boolean) {
    try {
      if (isTop) {
        await questionCancelTopQuestion({ questionId });
      } else {
        await questionTopQuestion({ questionId });
      }
      message.success('操作成功，即将刷新');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      message.error('操作失败，请重试');
      return false;
    }
  }

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
      renderText: (moduleId, _) => getModuleBymoduleId(moduleId).moduleName,
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/config/module/listModule',
          formatData: {
            key: 'moduleId',
            value: 'moduleName',
          },
          onChange: function (value) {
            value ? config.onChange(value.key) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
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
      dataIndex: 'title',
      ellipsis: true,
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
          {record.acceptStatus !== -1 && (
            <>
              <a onClick={() => opTop(record.questionId, record.isTop)}>
                {record.isTop ? '取消置顶' : '置顶'}
              </a>
              <Divider type="vertical" />
            </>
          )}

          <a
            onClick={() => {
              questionCheckRecommend(record.questionId).then((res) => {
                const title = res.data.result
                  ? '此问题在推荐页面也有,是否删除此问题?'
                  : '确定要删除？';
                return Modal.confirm({
                  okText: '确认',
                  cancelText: '取消',
                  title,
                  onOk: () => handleRemove(record.questionId),
                });
              });
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  useEffect(() => {}, []);

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (questionId: number) => {
    const hide = message.loading('正在删除');
    if (!questionId) return true;
    try {
      await questionDeleted(questionId);
      hide();
      message.success('删除成功，即将刷新');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<QuestionTableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        columns={columns}
        rowKey="questionId"
        // request={async (params) => {
        //   const data = await queryQuestion(params);
        //   return data;
        // }}
        request={(params) => queryQuestion(params)}
        // onReset={() => {
        //   setRangePicker({});
        //   setNumInfo({});
        // }}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<CommentTableListItem>;
          if (sorterResult.field && sorterResult.field === 'createTime') {
            setOrderType(sorterResult.order === 'ascend' ? 1 : 2);
          }
        }}
        params={{
          ...rangePicker,
          ...numInfo,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Link to="/post/question/add">
            <Button type="primary">
              <PlusOutlined /> 写提问
            </Button>
          </Link>,
        ]}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
