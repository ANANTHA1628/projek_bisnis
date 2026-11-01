import React from 'react';

export default function AdminHeader({ title, children }) {
  return (
    <div className="posa-admin-top-header">
      <div className="posa-header-title-box">
        <h1 className="posa-header-title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
