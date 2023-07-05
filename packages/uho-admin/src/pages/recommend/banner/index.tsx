import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Divider, Modal, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect, AnyAction, Dispatch, Link } from 'umi';
import RangeNumber from '@/components/RangeNumber';
import { getModuleBymoduleId } from '@/services/game';
import SelectSearch from '@/components/SelectSearch';
import SortInputNumber from '@/components/SortInputNumber';
import { row } from './data.d';
import { queryList } from './services';

import OpForm from './_form';

import { StateType } from './model';

interface tableProps {
  dispatch: Dispatch<AnyAction>;
  bannerList: StateType;
}

const bannerList: React.FC<tableProps> = ({ dispatch, bannerList }) => {
  const actionRef = useRef<ActionType>();
  const { loading } = bannerList;

  const [collapsed, setCollapsed] = useState(false);
  const [bannerSortType, setBannerSortType] = useState(1);
  //时间戳
  const [rangePicker, setRangePicker] = useState({});
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  //选中的游戏
  const [rowId, setRowId] = useState(0);

  //number区间
  const [numInfo, setNumInfo] = useState({});

  /**
   * constructor
   */
  useEffect(() => {
    if (loading && actionRef.current) {
      actionRef.current.reload();
      handleModalVisible(false);
      setRowId(0);
    }
  }, [bannerList]);

  const columns: ProColumns<row>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      width: 150,
      ellipsis: true,
      title: 'banner标题',
      dataIndex: 'bannerTitle',
      renderFormItem: (item, config) => {
        const propsSelectSearch = {
          url: '/config/banner/listBanner?bannerSortType=2',
          formatData: {
            key: 'bannerId',
            value: 'bannerTitle',
          },
          onChange: function (value) {
            value ? config.onChange(value.value) : config.onChange();
          },
        };
        return <SelectSearch {...propsSelectSearch} />;
      },
    },
    {
      title: '游戏',
      width: 150,
      ellipsis: true,
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
      title: '排序',
      hideInSearch: true,
      sorter: true,
      dataIndex: 'bannerSort',
      render: (val, record) => (
        <SortInputNumber
          initValue={val}
          onChange={(sort) => {
            dispatch({
              type: 'bannerList/editSort',
              payload: {
                bannerId: record.bannerId,
                moduleId: record.moduleId,
                sort,
              },
            });
          }}
        />
      ),
    },
    {
      title: '问题数目',
      dataIndex: 'questionNum',
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
      valueType: 'dateTime',
      dataIndex: 'updateTime',
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Link
            to={`/post/recommend/banner/${JSON.stringify({
              bannerId: record.bannerId,
              moduleId: record.moduleId,
              title: record.bannerTitle,
            })}`}
          >
            查看
          </Link>
          <Divider type="vertical" />

          <a
            onClick={() => {
              handleModalVisible(true);
              setRowId(record.bannerId);
            }}
          >
            修改
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
                    type: 'bannerList/deleteItem',
                    payload: {
                      bannerId: record.bannerId,
                      moduleId: record.moduleId,
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

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<row>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="bannerId"
        request={(params) => queryList(params)}
        columns={columns}
        params={{
          bannerSortType,
          ...rangePicker,
          ...numInfo,
        }}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<row>;
          if (sorterResult.field && sorterResult.field === 'bannerSort') {
            setBannerSortType(sorterResult.order === 'ascend' ? 1 : 2);
          }
        }}
        onReset={() => {
          setRangePicker({});
        }}
        form={{ labelCol: { span: 7 } }}
        toolBarRender={(action, { selectedRows }) => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
              setRowId(0);
            }}
          >
            <PlusOutlined /> 添加
          </Button>,
        ]}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
      />
      <OpForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={modalVisible}
        rowId={rowId}
      ></OpForm>
    </PageHeaderWrapper>
  );
};

export default connect(({ bannerList }: { bannerList: StateType }) => ({
  bannerList,
}))(bannerList);
