import axios from "axios";

axios.interceptors.response.use(
  res => res,
  async error => {
    const status = error?.response?.status;

    const isSystemFailure =
      status === 502 ||
      status === 503 ||
      status === 504;

    if (isSystemFailure) {
      const module = "MAIN"; // PMS / MAIN based on app

      try {
        const msgRes = await axios.get(
          "/commonservices/maintenance-message",
          { params: { module } }
        );

        sessionStorage.setItem(
          "maintenanceMessage",
          msgRes.data.message
        );
      } catch {
        sessionStorage.setItem(
          "maintenanceMessage",
          "Service temporarily unavailable"
        );
      }

      window.location.href = "/maintenance";
      return Promise.reject(error);
    }
  }
);


export default axios;
