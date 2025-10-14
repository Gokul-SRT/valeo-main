// Updated Header component
import React from "react";
import { Layout } from "antd";
import { MenuOutlined, LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const { Header } = Layout;

export default function HeaderBar({ collapsed, toggleSidebar, showBackButton, onBack, currentApp }) {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <Header
      theme="dark"
      style={{
        color: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        height: 64,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        width: "100%"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: "20px"
        }}>
           {/* Menu Icon */}
          <MenuOutlined
            onClick={toggleSidebar}
            style={{ 
              fontSize: 20, 
              cursor: "pointer",
              padding: "4px",
              marginLeft: "16px",
            }}
            
          />
           {/* Back Button */}
          {showBackButton && (
            <ArrowLeftOutlined
              onClick={onBack}
              style={{ 
                fontSize: 16, 
                cursor: "pointer",
                padding: "4px",
                transition: "color 0.2s",
              }} 
              onMouseEnter={(e) => e.target.style.color = "#1890ff"}
              onMouseLeave={(e) => e.target.style.color = "#fff"}
            />
          )}

          {/* Logo */}
          <div style={{ 
            width: 32, 
            height: 32, 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <img 
              src={logo} 
              alt="Smartrun Logo" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          </div>

         
          {/* Current App or Company Name */}
          <span style={{ 
            fontSize: 18, 
            fontWeight: "bold",
            transition: "opacity 0.3s ease-in-out",
            whiteSpace: "nowrap"
          }}>
            {currentApp || "Smartrun"}
          </span>

         
        </div>
        
        <div style={{ 
          display: "flex", 
          gap: "16px", 
          alignItems: "center"
        }}>
          <span style={{ whiteSpace: "nowrap" }}>Welcome {username}</span>
          <LogoutOutlined 
            style={{ 
              transform: "rotate(270deg)", 
              cursor: "pointer",
              fontSize: 18,
              padding: "4px",
              transition: "color 0.2s",
            }} 
            onClick={logout} 
            onMouseEnter={(e) => e.target.style.color = "#ff4d4f"}
            onMouseLeave={(e) => e.target.style.color = "#fff"}
          />
        </div>
      </div>
    </Header>
  );
}