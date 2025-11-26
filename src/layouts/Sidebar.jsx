import React, { useMemo } from "react";
import { Menu } from "antd";
import * as Icons from "@ant-design/icons";

const Sidebar = ({ collapsed, selectedApp, selectedMenu, onMenuClick }) => {
  const host = window.location.hostname;

  const ScreenData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("ModuleData") || "[]");
    } catch {
      return [];
    }
  }, []);

  const getIcon = (iconName) => {
    if (!iconName) return null;
    const formatted =
      iconName
    return Icons[formatted] ? React.createElement(Icons[formatted]) : null;
  };

  const menuItems = useMemo(() => {
  if (!Array.isArray(ScreenData)) return [];

  return ScreenData.slice(0, 4).map((module,index) => ({
    key: module.description?.toLowerCase(),
    icon: getIcon(module.materialIcon),
    label: module.displayName,
    children: (module.uiScreenMstList || []).map((screen) => ({
      key: screen.description,
      label: screen.displayName,
      url: `http://${host}:${(index===2 ||index===3)?'3001':"3000"}${screen.linkUrl}`,
    })),
  }));
}, [ScreenData, host]);


  return (
    <div
      style={{
        width: collapsed ? 80 : 250,
        background: "#fff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        height: "calc(100vh - 64px)",
        position: "fixed",
        left: 0,
        top: 64,
        overflow: "auto",
        transition: "width 0.2s",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={selectedApp ? [selectedApp.key] : [selectedMenu]}
        defaultOpenKeys={menuItems.map((item) => item.key)}
        onClick={onMenuClick}
        style={{ border: "none", marginTop: "8px" }}
        items={menuItems}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};

export default Sidebar;
