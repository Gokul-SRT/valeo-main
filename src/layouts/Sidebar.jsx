import React, { useMemo, useState, useEffect } from "react";
import { Menu } from "antd";
import * as Icons from "@ant-design/icons";

const Sidebar = ({ collapsed, selectedApp, selectedMenu, onMenuClick }) => {
  const host = window.location.hostname;
  const [openKeys, setOpenKeys] = useState([]);

  const ScreenData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("ModuleData") || "[]");
    } catch {
      return [];
    }
  }, []);

  const getIcon = (iconName) => {
    if (!iconName) return null;
    const formatted = iconName;
    return Icons[formatted] ? React.createElement(Icons[formatted]) : null;
  };

  const menuItems = useMemo(() => {
    if (!Array.isArray(ScreenData)) return [];

    return ScreenData.slice(0, 4).map((module, index) => ({
      key: module.description?.toLowerCase(),
      icon: getIcon(module.materialIcon),
      label: module.displayName,
      children: (module.uiScreenMstList || []).map((screen) => ({
        key: screen.description,
        label: screen.displayName,
        url: `http://${host}:${(index === 2 || index === 3) ? '3001' : "3000"}${screen.linkUrl}`,
      })),
    }));
  }, [ScreenData, host]);

  // Initialize with first module open on mount (optional)
  useEffect(() => {
    if (menuItems.length > 0) {
      // Option 1: Open only the first module initially
      // setOpenKeys([menuItems[0].key]);
      
      // Option 2: Keep all closed initially
      setOpenKeys([]);
    }
  }, [menuItems]);

  const handleOpenChange = (keys) => {
    // Get the latest opened key (the one that was just clicked)
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    
    // If there's a new key opened and it's different from the current ones
    if (latestOpenKey && !openKeys.includes(latestOpenKey)) {
      // Close all other modules and open only the new one
      setOpenKeys([latestOpenKey]);
    } else {
      // If clicking the same module or closing, just use the keys as is
      setOpenKeys(keys);
    }
  };

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
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={onMenuClick}
        style={{ border: "none", marginTop: "8px" }}
        items={menuItems}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};

export default Sidebar;