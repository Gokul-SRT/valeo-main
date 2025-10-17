import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const MainLayout = ({ collapsed, selectedApp, children }) => {
  return (
    <Layout
      style={{
        marginLeft: collapsed ? 80 : 250,
        marginTop: 75,
        transition: "all 0.2s",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Content
        style={{
          padding: "0px",
          background: "#f0f2f5",
          minHeight: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        {selectedApp ? (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, padding: "0px" }}>
              <iframe
                src={selectedApp.url}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#fff",
                }}
                title={selectedApp.label}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 64px)",
            }}
          >
            {children}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default MainLayout;