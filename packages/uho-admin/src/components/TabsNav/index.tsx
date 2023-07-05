import React, { useState, useEffect } from 'react';
import './index.less';
import { DownOutlined } from '@ant-design/icons';
import { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import { Layout, Tabs, Dropdown, Button, Menu } from 'antd';
const { Content } = Layout;
const { TabPane } = Tabs;

export interface TabsNavType extends ProLayoutProps {}

//获取 router 数组
const getRouterArray = function (routes): array {
  let newArray = [];
  routes.map((item) => {
    //有子节点
    if (item.name) {
      if (item.children && item.children.length > 0) {
        newArray = [...newArray, ...getRouterArray(item.children)];
      } else {
        newArray.push({
          path: item.path,
          name: item.name,
        });
      }
    }
  });
  return newArray;
};

class TabsNav extends React.Component {
  constructor(props) {
    super(props);
    const {
      route,
      location: { pathname },
      children,
    } = this.props.propsList;

    //获取 router
    this.routeArray = getRouterArray(route.routes);

    const currentRoute = this.routeArray.find((item) => item.path === pathname);
    this.state = {
      activeKey: pathname,
      pane: [
        {
          path: pathname,
          children,
          name: currentRoute ? currentRoute.name : '',
        },
      ],
    };
  }

  shouldComponentUpdate(nextProps) {
    const { pane } = this.state;
    const {
      location: { pathname },
      children,
    } = nextProps.propsList;

    // 常見用法（別忘了比較 prop）：
    if (pathname !== this.props.propsList.location.pathname) {
      const existPane = pane.some((item) => item.path === pathname);
      if (existPane) {
        this.setState({
          activeKey: pathname,
        });

        //不存在的添加
        if (!existPane) {
          this.setState({
            pane: [
              ...pane,
              {
                path: pathname,
                children,
                name: existPane.name,
              },
            ],
          });
        }
      }
    }
    return true;
  }

  //删除tab item
  onRemove = (targetKey: string): void => {
    const { pane, activeKey } = this.state;
    //不能删除最后一个节点
    if (pane.length === 1) return;

    //如果删除的节点 为现选中节点 , 则需要选中当前删除节点的前一兄弟节点
    if (activeKey === targetKey) {
      //获取 删除节点的 前节点
      let previousIndex: number;
      pane.forEach((item, i) => {
        if (item.path === targetKey) {
          previousIndex = i - 1;
        }
      });
      this.onChange(pane[previousIndex].path);
    }

    const newpanes = pane.filter((item) => item.path !== targetKey);
    this.setState({
      pane: newpanes,
    });
  };

  //切换选项卡
  onChange = (activeKey: string): void => {
    this.setState({
      activeKey,
    });

    this.props.propsList.history.push(activeKey);
  };

  //删除其他
  onRemoveOther = (): void => {
    const { pane } = this.state;
    const newpanes = pane.filter((item) => item.path === pathname);
    this.setState({
      pane: newpanes,
    });
  };

  onRemoveAll = (): void => {
    this.setState({
      pane: [],
    });
  };

  onTabsActions = ({ key: string }): void => {
    switch (key) {
      case 'close':
        this.onRemove(this.state.activeKey);
        break;
      case 'closeother':
        this.onRemoveOther();
        break;
      case 'closeall':
        this.onRemoveAll();
        break;
      default:
        break;
    }
  };

  render() {
    const { activeKey, pane } = this.state;

    return (
      <Layout className="tabs-layout">
        <Content>
          <Tabs
            animated={false}
            type="editable-card"
            className="tabs-content"
            activeKey={activeKey}
            onEdit={this.onRemove}
            onChange={this.onChange}
            tabBarExtraContent={
              <Dropdown
                overlay={
                  <Menu onClick={this.onTabsActions}>
                    <Menu.Item key="close">关闭当前</Menu.Item>
                    <Menu.Item key="closeother">关闭其它</Menu.Item>
                    {/* <Menu.Item key="closeall">关闭所有</Menu.Item> */}
                  </Menu>
                }
              >
                <Button type="primary" ghost>
                  操作
                  <DownOutlined />
                </Button>
              </Dropdown>
            }
          >
            {pane.map((item) => (
              <TabPane key={item.path} tab={item.name}>
                {item.children}
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Layout>
    );
  }
}
export default TabsNav;

// const TabsNav: React.FC<TabsNavType> = ({ propsList }) => {
//   const {
//     route,
//     location: { pathname },
//     children,
//   } = propsList;

//   console.log('children', children);

//   //获取 router
//   const routeArray = getRouterArray(route.routes);

//   const routeItem = routeArray.find((item) => pathname === item.path);
//   //初始化 or 赋值
//   const changePaneItem = routeItem
//     ? [
//         {
//           path: pathname,
//           children,
//           name: routeItem.name,
//         },
//       ]
//     : [];

//   //设置 tab item
//   const [pane, setPane] = useState(changePaneItem);

//   //active key
//   const [activeKey, setActiveKey] = useState(pathname);

//   //监听 propsList 传值变化
//   useEffect(() => {
//     console.log('propsList', propsList);
//     const existPane = pane.some((item) => item.path === pathname);
//     //不存在的添加
//     if (!existPane) {
//       setPane([...pane, ...changePaneItem]);
//     }
//   }, [propsList]);

//   //删除tab item
//   const onRemove = (targetKey: string): void => {
//     //不能删除最后一个节点
//     if (pane.length === 1) return;

//     //如果删除的节点 为现选中节点 , 则需要选中当前删除节点的前一兄弟节点
//     if (activeKey === targetKey) {
//       //获取 删除节点的 前节点
//       let previousIndex: number;
//       pane.forEach((item, i) => {
//         if (item.path === targetKey) {
//           previousIndex = i - 1;
//         }
//       });
//       onChange(pane[previousIndex].path);
//     }

//     const newpanes = pane.filter((item) => item.path !== targetKey);

//     setPane(newpanes);
//   };

//   //切换选项卡
//   const onChange = (activeKey: string): void => {
//     setActiveKey(activeKey);
//     propsList.history.push(activeKey);
//   };

//   //删除其他
//   const onRemoveOther = (): void => {
//     const newpanes = pane.filter((item) => item.path === pathname);
//     setPane(newpanes);
//   };

//   const onRemoveAll = (): void => {
//     setPane([]);
//   };

//   const onTabsActions = ({ key: string }): void => {
//     switch (key) {
//       case 'close':
//         onRemove(pathname);
//         break;
//       case 'closeother':
//         onRemoveOther();
//         break;
//       case 'closeall':
//         onRemoveAll();
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <Layout className="tabs-layout">
//       <Content>
//         <Tabs
//           animated={false}
//           type="editable-card"
//           className="tabs-content"
//           activeKey={activeKey}
//           onEdit={onRemove}
//           onChange={onChange}
//           tabBarExtraContent={
//             <Dropdown
//               overlay={
//                 <Menu onClick={onTabsActions}>
//                   <Menu.Item key="close">关闭当前</Menu.Item>
//                   <Menu.Item key="closeother">关闭其它</Menu.Item>
//                   {/* <Menu.Item key="closeall">关闭所有</Menu.Item> */}
//                 </Menu>
//               }
//             >
//               <Button type="primary" ghost>
//                 操作
//                 <DownOutlined />
//               </Button>
//             </Dropdown>
//           }
//         >
//           {pane.map((item) => (
//             <TabPane key={item.path} tab={item.name}>
//               {item.children}
//             </TabPane>
//           ))}
//         </Tabs>
//       </Content>
//     </Layout>
//   );
// };

// export default TabsNav;
