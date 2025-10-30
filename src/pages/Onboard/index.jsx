import React, { useState, useEffect } from "react";
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

  // 👇 dynamically detect the host (localhost or LAN IP)
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

  useEffect(() => {
    if (defaultApp === "ProductionDashboard" && !selectedApp) {
      setSelectedApp({
        key: "ProductionDashboard",
        label: "Production Dashboard",
        url: `http://${host}:3000/ProductionDashboard`,
      });
      setSelectedMenu("ProductionDashboard");
    }
  }, [defaultApp, selectedApp, host]);

  const handleMenuClick = (item) => {
    let selectedItem = null;

    const menuItems = [
      {
        key: "dashboard",
        children: [
          { key: "foolproof", label: "Fool Proof Reports", url: `http://${host}:3000/foolproof` },
          { key: "ngMasterValidation", label: "NG Master Validation", url: `http://${host}:3000/ngMasterValidation` },
          { key: "ftt", label: "FTT (Overall Machines) Reports", url: `http://${host}:3000/ftt` },
          { key: "eolreport", label: "EOL FTT Reports", url: `http://${host}:3000/eolreport` },
          { key: "opertionreport", label: "Operation Miss Reports", url: `http://${host}:3000/opertionreport` },
          { key: "ngpart", label: "NG Part Handling Reports", url: `http://${host}:3000/ngpart` },
          { key: "bypass", label: "ByPass Reports", url: `http://${host}:3000/bypass` },
          { key: "datamissreport", label: "Data Miss Reports", url: `http://${host}:3000/datamissreport` },
          { key: "oversteyreport", label: "Overstay Reports", url: `http://${host}:3000/oversteyreport` },
          { key: "overalldashboard", label: "Overall Dashboard", url: `http://${host}:3000/overalldashboard` },
          { key: "lineside-dashboard", label: "Line side overall dashboard", url: `http://${host}:3000/lineside-dashboard` },
        ],
      },
      {
        key: "pms",
        children: [
          { key: "productionPlanScreen", label: "Production Plan Screen", url: `http://${host}:3000/productionPlanScreen` },
          { key: "lossreport", label: "Loss Reason booking Screen", url: `http://${host}:3000/lossreport` },
          { key: "qualityloss", label: "Quality Loss booking Screen", url: `http://${host}:3000/qualityloss` },
          { key: "cboard", label: "C-Board Dashboard", url: `http://${host}:3000/cboard` },
          { key: "ProductionDashboard", label: "Production Dashboard", url: `http://${host}:3000/ProductionDashboard` },
          { key: "productionReports", label: "Reports", url: `http://${host}:3000/productionReports` },
          { key: "pmsmaster", label: "Production Master", url: `http://${host}:3000/pmsmaster` },
        ],
      },
      {
        key: "traceability",
        children: [
          { key: "picklist", label: "Picklist screen", url: `http://${host}:3001/picklist` },
          { key: "picklist-verification-screen", label: "Picklist verification screen", url: `http://${host}:3001/picklist-verification-screen` },
          { key: "storeReturnable", label: "Store Returnable", url: `http://${host}:3001/storeReturnable` },
          { key: "line-side-child-part-verification-screen", label: "Line side child part verification screen", url: `http://${host}:3001/line-side-child-part-verification-screen` },
          { key: "Kittingprocessscreen", label: "Kitting process screen", url: `http://${host}:3001/Kittingprocessscreen` },
          { key: "picklistprint", label: "A2 and B2 type label print screen", url: `http://${host}:3001/picklistprint` },
          { key: "lineDashboard", label: "Line Dashboard", url: `http://${host}:3001/lineDashboard` },
          { key: "traceabilityReports", label: "Reports", url: `http://${host}:3001/traceabilityReports` },
          { key: "linefeeder", label: "Line Feeder", url: `http://${host}:3001/linefeeder` },
          { key: "Traceabilityreports1", label: "TraceabilityReports", url: `http://${host}:3001/Traceabilityreports1` },
          { key: "reversetraceabilityReports", label: "ReverseTraceabilityReports", url: `http://${host}:3001/reversetraceabilityReports` },
          { key: "tracemaster", label: "Traceability Master", url: `http://${host}:3001/tracemaster` },
          { key: "traceabilitylog", label: "Traceability Log", url: `http://${host}:3001/traceabilitylog` },
        ],
      },
      {
        key: "toolmonitoring",
        label: "Tool Monitoring",
        children: [
          { key: "toolChange", label: "Tool Change", url: `http://${host}:3001/toolChange` },
          { key: "ToolHistoryLog", label: "Tool History Log", url: `http://${host}:3001/ToolHistoryLog` },
          { key: "CriticalSparePartsList", label: "Critical Spare Parts List", url: `http://${host}:3001/CriticalSparePartsList` },
          { key: "PreventiveMaintenanceCheckList", label: "PM Checklist Log", url: `http://${host}:3001/PreventiveMaintenanceCheckList` },
          { key: "toolmonitoringmaster", label: "Tool Monitoring Master", url: `http://${host}:3001/toolmonitoringmaster` },
        ],
      },
    ];

    menuItems.forEach(menu => {
      if (menu.key === item.key) {
        selectedItem = menu;
      } else if (menu.children) {
        const child = menu.children.find(child => child.key === item.key);
        if (child) {
          selectedItem = child;
        }
      }
    });

    if (selectedItem && selectedItem.url) {
      setSelectedApp({
        key: selectedItem.key,
        label: selectedItem.label,
        url: selectedItem.url,
      });
      setSelectedMenu(selectedItem.key);
    } else if (selectedItem) {
      setSelectedMenu(selectedItem.key);
      setSelectedApp(null);
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
