import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, message, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { CommentTableListItem } from '../data';
import { queryComment, commentDeleted } from '../service';
import { getModuleBymoduleId, getGroupByGroupId } from '@/services/game';

import { Link } from 'umi';
import SelectSearch from '@/components/SelectSearch';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  //排序 1-倒序 2-正序
  const [orderType, setOrderType] = useState<number>(1);
  const [collapsed, setCollapsed] = useState(false);
  //时间戳
  const [rangePicker, setRangePicker] = useState({});

  const columns: ProColumns<CommentTableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: '评论ID',
      dataIndex: 'commentId',
    },
    {
      title: '评论内容',
      dataIndex: 'commentText',
      valueType: 'textarea',
      width: 150,
      ellipsis: true,
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/community/comment',
          formatData: {
            key: 'commentId',
            value: 'commentText',
          },
          onChange: function (value) {
            value ? config.onChange(value.value) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: (_, type) => (type === 'table' ? '评论者ID' : '评论者昵称'),
      dataIndex: 'reviewerId',
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
      title: '评论者昵称',
      hideInSearch: true,
      dataIndex: 'reviewerName',
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
      title: '游戏组别',
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
      dataIndex: 'questionId',
      width: 100,
      ellipsis: true,
      renderText: (val, record) => record.questionTitle,
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/community/question',
          formatData: {
            key: 'questionId',
            value: 'title',
          },
          onChange: function (value) {
            value ? config.onChange(value.key) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '回答内容',
      dataIndex: 'wordText',
      valueType: 'textarea',
      width: 150,
      ellipsis: true,

      renderText: (_, record) => record.answerIncludeMultimediaText,
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/community/answer',
          formatData: {
            key: 'answerId',
            value: 'wordText',
          },
          onChange: function (value) {
            value ? config.onChange(value.value) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '审查状态',
      dataIndex: 'reviewStatus',
      valueEnum: {
        0: { text: '未审核', status: 'Default' },
        1: { text: '已审核', status: 'Success' },
      },
    },

    {
      title: '发布时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
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
          <Link to={`/post/comment/${record.commentId}`}>查看</Link>

          <Divider type="vertical" />

          <a
            onClick={() =>
              Modal.confirm({
                okText: '确认',
                cancelText: '取消',
                title: '确定要删除？',
                onOk: () => handleRemove(record.commentId),
              })
            }
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
  const handleRemove = async (commentId: number) => {
    const hide = message.loading('正在删除');
    if (!commentId) return true;
    commentDeleted(commentId)
      .then(function (response) {
        hide();
        message.success('删除成功，即将刷新');
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      })
      .catch(function (error) {
        hide();
        message.error(error.message);
        return false;
      });
  };

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<CommentTableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="answerId"
        request={(params) => queryComment(params)}
        columns={columns}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<CommentTableListItem>;
          if (sorterResult.field && sorterResult.field === 'createTime') {
            setOrderType(sorterResult.order === 'ascend' ? 1 : 2);
          }
        }}
        params={{
          orderType,
          ...rangePicker,
        }}
        onReset={() => {
          setRangePicker({});
        }}
        // toolBarRender={(action, { selectedRows }) => [
        //   <Link to="/post/question/add">
        //     <Button type="primary">
        //       <PlusOutlined /> 新建
        //     </Button>
        //   </Link>,
        // ]}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
