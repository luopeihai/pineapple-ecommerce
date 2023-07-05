import { Link } from 'umi';

export const renderBreadcrumb = (routers) => {
  return (
    <div className="ant-pro-grid-content">
      <div className="ant-page-header has-breadcrumb ant-page-header-ghost">
        <div className="ant-breadcrumb">
          {routers.map((item, index) => {
            return (
              <span key={index}>
                <span className="ant-breadcrumb-link">
                  {item.path ? (
                    <Link to={item.path}>{item.breadcrumbName}</Link>
                  ) : (
                    <span>{item.breadcrumbName}</span>
                  )}
                </span>
                <span className="ant-breadcrumb-separator">/</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
