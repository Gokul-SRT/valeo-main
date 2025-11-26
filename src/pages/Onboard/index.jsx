import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import Header from "../../layouts/Header";
import Sidebar from "../../layouts/Sidebar";
import MainLayout from "../../layouts/MainLayout";
import "./Onboard.css";

const Onboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultApp = queryParams.get("default");


  const host = window.location.hostname;

  const [selectedApp, setSelectedApp] = useState(() => {
    if (defaultApp === "ProductionDashboard") {
      return {
        key: "ProductionDashboard",
        label: "Production Dashboard",
        url: `http://${host}:3000/ProductionDashboard`,
      };
    }
    return null;
  });

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(defaultApp || "dashboard");
  const ScreenData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("ModuleData") || "[]");
    } catch {
      return [];
    }
  }, []);


    const dynamicMenu = useMemo(() => {
    if (!Array.isArray(ScreenData)) return [];

    return ScreenData.map((module,index) => ({
      key: module.description?.toLowerCase() ?? "module",
      label: module.displayName ?? module.description,
      children: (module.uiScreenMstList || []).map((screen) => ({
        key: screen.description,
        label: screen.displayName,
        url: `http://${host}:${(index===2||index===3)?'3001':"3000"}${screen.linkUrl}`,
      })),
    }));
  }, [ScreenData, host]);
  useEffect(() => {
    if (defaultApp === "ProductionDashboard" && !selectedApp) {
   dynamicMenu.forEach((module) => {
        module.children.forEach((screen) => {
          if (screen.key === defaultApp) {
            setSelectedApp(screen);
            setSelectedMenu(screen.key);
          }
        })
      })
    }
  }, [defaultApp,dynamicMenu, selectedApp, host]);

    const handleMenuClick = (item) => {
    let selectedItem = null;

    dynamicMenu.forEach((module) => {
      if (module.key === item.key) {
        selectedItem = module;
      } else {
        const child = module.children?.find((screen) => screen.key === item.key);
        if (child) selectedItem = child;
      }
    });

    if (selectedItem?.url) {
      setSelectedApp({
        key: selectedItem.key,
        label: selectedItem.label,
        url: selectedItem.url,
      });
      setSelectedMenu(selectedItem.key);
    } else {
      setSelectedApp(null);
      setSelectedMenu(selectedItem?.key || "");
    }
  };

  const handleBackToHub = () => {
    setSelectedApp(null);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
        showBackButton={!!selectedApp}
        onBack={handleBackToHub}
      />
      <Layout>
        <Sidebar
          collapsed={collapsed}
          selectedApp={selectedApp}
          selectedMenu={selectedMenu}
          onMenuClick={handleMenuClick}
        />
        <MainLayout collapsed={collapsed} selectedApp={selectedApp} />
      </Layout>
    </Layout>
  );
};

export default Onboard;
