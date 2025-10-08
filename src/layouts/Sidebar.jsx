import React from "react";
import { Menu } from "antd";
import { 
  AppstoreOutlined,
  DeploymentUnitOutlined,
  DashboardOutlined
} from "@ant-design/icons";

const Sidebar = ({ collapsed, selectedApp, selectedMenu, onMenuClick }) => {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      children: [
        { key: "foolproof", label: "Fool Proof Reports", url: "http://localhost:3000/foolproof" },
        { key: "ngMasterValidation", label: "NG Master Validation", url: "http://localhost:3000/ngMasterValidation" },
        { key: "ftt", label: "FTT (Overall Machines) Reports", url: "http://localhost:3000/ftt" },
        { key: "eolreport", label: "EOL FTT Reports", url: "http://localhost:3000/eolreport" },
        { key: "opertionreport", label: "Operation Miss Reports", url: "http://localhost:3000/opertionreport" },
        { key: "ngpart", label: "NG Part Handling Reports", url: "http://localhost:3000/ngpart" },
        { key: "bypass", label: "ByPass Reports", url: "http://localhost:3000/bypass" },
        { key: "datamissreport", label: "Data Miss Reports", url: "http://localhost:3000/datamissreport" },
        { key: "oversteyreport", label: "Overstay Reports", url: "http://localhost:3000/oversteyreport" },
        { key: "overalldashboard", label: "Overall Dashboard", url: "http://localhost:3000/overalldashboard" },
        { key: "lineside-dashboard", label: "Line side overall dashboard", url: "http://localhost:3000/lineside-dashboard" },
      ],
    },
    {
      key: "pms",
      icon: <AppstoreOutlined />,
      label: "Production",
      children: [
        { key: "productionPlanScreen", label: "Production Plan Screen", url: "http://localhost:3000/productionPlanScreen" },
        { key: "lossreport", label: "Loss Reason booking Screen", url: "http://localhost:3000/lossreport" },
        { key: "qualityloss", label: "Quality Loss booking Screen", url: "http://localhost:3000/qualityloss" },
        { key: "cboard", label: "C-Board Dashboard", url: "http://localhost:3000/cboard" },
        { key: "ProductionDashboard", label: "Production Dashboard", url: "http://localhost:3000/ProductionDashboard" },
        { key: "productionReports", label: "Reports", url: "http://localhost:3000/productionReports" },
        { key: "pmsmaster", label: "Production Master", url: "http://localhost:3000/pmsmaster" },
      ],
    },
    {
      key: "traceability", 
      icon: <DeploymentUnitOutlined />,
      label: "Traceability",
      children: [
        { key: "picklist", label: "Picklist screen", url: "http://localhost:3001/picklist" },
        { key: "picklist-verification-screen", label: "Picklist verification screen", url: "http://localhost:3001/picklist-verification-screen" },
        { key: "storeReturnable", label: "Store Returnable", url: "http://localhost:3001/storeReturnable" },
        { key: "line-side-child-part-verification-screen", label: "Line side child part verification screen", url: "http://localhost:3001/line-side-child-part-verification-screen" },
        { key: "Kittingprocessscreen", label: "Kitting process screen", url: "http://localhost:3001/Kittingprocessscreen" },
        { key: "A2-B2-label-print-screen", label: "A2 and B2 type label print screen", url: "http://localhost:3001/A2-B2-label-print-screen" },
        { key: "lineDashboard", label: "Line Dashboard", url: "http://localhost:3001/lineDashboard" },
        { key: "traceabilityReports", label: "Reports", url: "http://localhost:3001/traceabilityReports" },
        { key: "linefeeder", label: "Line Feeder", url: "http://localhost:3001/linefeeder" },
        { key: "Traceabilityreports1", label: "TraceabilityReports", url: "http://localhost:3001/Traceabilityreports1" },
        { key: "reversetraceabilityReports", label: "ReverseTraceabilityReports", url: "http://localhost:3001/reversetraceabilityReports" },
        { key: "tracemaster", label: "Traceability Master", url: "http://localhost:3001/tracemaster" },
      ],
    },
  ];

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
        defaultOpenKeys={menuItems.map(item => item.key)}
        onClick={onMenuClick}
        style={{
          border: "none",
          marginTop: "8px",
        }}
        items={menuItems}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};

export default Sidebar;