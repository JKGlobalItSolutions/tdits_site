import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb as BootstrapBreadcrumb } from 'react-bootstrap';

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <BootstrapBreadcrumb className="mt-3">
      <BootstrapBreadcrumb.Item
        linkAs={Link}
        linkProps={{ to: '/' }}
        style={{
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
      >
        <span style={{ color: '#000', textDecoration: 'none' }}>Home</span>
      </BootstrapBreadcrumb.Item>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <BootstrapBreadcrumb.Item
            active
            key={name}
            style={{
              color: '#00008B',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </BootstrapBreadcrumb.Item>
        ) : (
          <BootstrapBreadcrumb.Item
            key={name}
            linkAs={Link}
            linkProps={{ to: routeTo }}
            style={{
              fontWeight: 'bold',
              textDecoration: 'none',
              color: '#000',
            }}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </BootstrapBreadcrumb.Item>
        );
      })}
    </BootstrapBreadcrumb>
  );
}

export default Breadcrumb;
