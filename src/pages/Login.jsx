import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import store from "store";
import {
  login as apiLogin,
  generateOTP,
  resetPassword,
  verifyOTP,
} from "../Api/service/demoapi";
import "bootstrap/dist/css/bootstrap.min.css";
import image from "../assets/bgmobile.jpg";
import logo from "../assets/logo.png";
import SmartRunLogo from "../assets/SmartRun.png";
import valeo from "../assets/valeo.png";

const mapStateToProps = ({ user, settings }) => ({
  user,
  authProvider: settings.authProvider,
  logo: settings.logo,
});

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login | forgot | reset
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // 🔑 Login handler
  const onFinishLogin = (values) => {
    const { username, password } = values;

    // Call backend login API
    setLoading(true);
    apiLogin(username, password)
      .then((res) => {
        // normalize response shape: some backends return an array or nested data
        const payload = Array.isArray(res) ? res[0] : res?.data || res;
        // debug
        console.log("Login response payload", payload);

        const accessToken =
          payload?.jwtToken || payload?.token || payload?.accessToken || null;
        const refreshToken = payload?.refreshToken || null;
        const user = payload?.user || payload || { username };

        if (accessToken) {
          // store token in the `store` module used by serverAPI interceptor
          try {
            store.set("accessToken", accessToken);
          } catch (e) {
            // fallback to localStorage
            localStorage.setItem("accessToken", accessToken);
          }
          if (refreshToken) {
            try {
              store.set("refreshToken", refreshToken);
            } catch (e) {
              localStorage.setItem("refreshToken", refreshToken);
            }
          }
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("username", user.username || username);
          localStorage.setItem("user", JSON.stringify(user));

          // Show success notification
          message.success("Login successful! Redirecting...");

          // ensure navigation happens after storing tokens
          setTimeout(
            () => navigate("/onboard?default=ProductionDashboard"),
            100
          );
        } else {
          // Show failure notification when no token is received
          message.error(
            payload?.returnMsg ||
              payload?.responseMessage ||
              "Login failed - Invalid credentials"
          );
        }
      })
      .catch((err) => {
        console.error("Login error", err);
        // Show failure notification for API errors
        message.error(
          err?.response?.data?.message ||
            err?.responseMessage ||
            err?.message ||
            "Login failed"
        );
      })
      .finally(() => setLoading(false));
  };

  const onSendOtp = async (values) => {

    try {
      setLoading(true);
      setUserName(values.userName);

      const res = await generateOTP(values.userName);

      if (res?.responseCode === "200") {
        message.success(res.responseMessage || "OTP sent successfully");
        setStep("reset");
        setOtpVerified(false); // reset state
      } else {
        message.error(res?.responseMessage || "Failed to send OTP");
      }
    } catch (err) {
      message.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (otp) => {
    try {
      setOtpLoading(true);

      const res = await verifyOTP(userName, otp);

      if (res?.responseCode === "200") {
        message.success("OTP verified successfully");
        setOtpVerified(true);
      } else {
        message.error(res?.responseMessage || "Invalid OTP");
        setOtpVerified(false);
      }
    } catch (err) {
      message.error("OTP verification failed");
      setOtpVerified(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const onResetPassword = async (values) => {
    if (!otpVerified) {
      message.error("Please verify OTP first");
      return;
    }

    try {
      setResetLoading(true);

      const res = await resetPassword(userName, values.newPassword);

      if (res?.responseCode === "200") {
        message.success("Password reset successful! Please login again.");
        setStep("login");
      } else {
        message.error(res?.responseMessage || "Reset password failed");
      }
    } catch (err) {
      message.error("Reset password failed");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="vh-100 d-flex flex-column"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm px-3">
        <div className="d-flex align-items-center">
          <img src={logo} alt="SmartRun Logo" height="40" className="me-2" />
          <img
            src={SmartRunLogo}
            alt="Smartrun Logo"
            style={{
              width: 180,
              height: "100%",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
        </div>
      </nav>

      {/* ✅ Body */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow-lg p-4 p-md-5"
          style={{ maxWidth: "450px", width: "100%", borderRadius: "12px" }}
        >
          {/* Title */}
          <div className="d-flex justify-content-center align-items-center mb-4">
            <img
              src={valeo}
              alt="Valeo Logo"
              style={{
                width: 150,
                height: "100%",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
            {/* <strong style={{ color: "#82E600", fontSize: "30px" }}>
              Valeo
            </strong> */}
          </div>

          {/* Dynamic content */}
          {step === "login" && (
            <>
              <div className="mb-3 text-dark">
                <strong>Sign in</strong>
              </div>
              <Form
                layout="vertical"
                onFinish={onFinishLogin}
                // initialValues={{ username: "smartrun", password: "sradmin" }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username" },
                  ]}
                >
                  <Input size="large" placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password" },
                  ]}
                >
                  <Input.Password size="large" placeholder="Password" />
                </Form.Item>
                <Button
                  type="primary"
                  size="large"
                  className="w-100"
                  htmlType="submit"
                  loading={loading}
                >
                  <strong>Sign in</strong>
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setStep("forgot")}
                >
                  Forgot Password?
                </span>
              </div>
            </>
          )}

          {step === "forgot" && (
            <>
              <div className="mb-3 text-dark">
                <strong>Forgot Password</strong>
              </div>
              <Form layout="vertical" onFinish={onSendOtp}>
                <Form.Item
                  name="userName"
                  rules={[{ required: true, message: "Enter User Name" }]}
                >
                  <Input placeholder="Enter User Name" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send OTP
                </Button>
              </Form>
              <div className="text-center mt-3">
                <span
                  style={{ cursor: "pointer" }}
                  className="text-secondary"
                  onClick={() => setStep("login")}
                >
                  Back to Login
                </span>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="mb-3 text-dark">
                <strong>Reset Password</strong>
              </div>

              <Form layout="vertical" onFinish={onResetPassword}>
                {/* OTP Field + Verify Button */}
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: "Enter the OTP" }]}
                >
                  <Input.Group compact style={{display:'flex',flexDirection:'row'}}>
                    <Input
                      // style={{ width: "70%" }}
                      placeholder="Enter OTP"
                      disabled={otpVerified}
                    />
                    <Button
                      type="primary"
                      loading={otpLoading}
                      disabled={otpVerified}
                      onClick={() => {
                        const otp = document.querySelector(
                          'input[placeholder="Enter OTP"]'
                        )?.value;
                        if (!otp) {
                          message.error("Please enter OTP");
                          return;
                        }
                        onVerifyOtp(otp);
                      }}
                    >
                      {otpVerified ? "Verified" : "Verify"}
                    </Button>
                  </Input.Group>
                </Form.Item>

                {/* New Password */}
                <Form.Item
                  name="newPassword"
                  rules={[{ required: true, message: "Enter new password" }]}
                >
                  <Input.Password placeholder="New Password" />
                </Form.Item>

                {/* Reset Button */}
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={resetLoading}
                  disabled={!otpVerified}
                >
                  Reset Password
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span
                  style={{ cursor: "pointer" }}
                  className="text-secondary"
                  onClick={() => setStep("login")}
                >
                  Back to Login
                </span>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center mt-4">
            <small>
              Software rights owned by{" "}
              <span className="text-danger">Smart</span>
              <span className="text-primary">Run</span> Tech Pvt Ltd.,
            </small>
            <br />
            <a
              href="https://www.smartruntech.com/"
              className="text-decoration-none"
              target="_blank"
              rel="noreferrer"
            >
              www.smartruntech.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(Login);
