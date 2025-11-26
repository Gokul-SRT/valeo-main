import apiClient from "../../fakeapi";
import serverApi from "../serverAPI";
import store from "store";


function setCookie(name, value, days = 1) {
  if (!value) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; Secure; expires=${expires}`;

  // For production HTTPS:
  // document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=None; Secure; expires=${expires}`
}

function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export async function login(password, username) {
  return serverApi
    .post(
      `authenticate`,
      { password, username },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => {
      if (!response) return false;

      const data = response.data || {};
      const token = data.token || data.jwtToken || data.accessToken || null;

      if (token) {
        try {
          store.set("accessToken", token);
        } catch (e) {}
        try {
          localStorage.setItem("accessToken", token);
        } catch (e) {}
        setCookie("accessToken", token); 

        const masterInfo = data.masterUserInfo || {};

        const tenantId =
          masterInfo.tenantId || data.tenantId || data.tenantID || "valeo";
        const branchCode =
          masterInfo.branchCode || data.branchCode || "AVAL_ORG";
        const empID = data.empID || masterInfo.empID || null;

        if (tenantId) {
          try {
            store.set("tenantId", tenantId);
          } catch (e) {}
          setCookie("tenantId", tenantId);
        }

        if (branchCode) {
          try {
            store.set("branchCode", branchCode);
          } catch (e) {}
          setCookie("branchCode", branchCode);
        }

        if (empID) {
          try {
            store.set("empID", empID);
          } catch (e) {}
          setCookie("empID", empID);
        }

        if (masterInfo.backGroundIMGPath)
          try {
            store.set("bgimg", masterInfo.backGroundIMGPath);
          } catch (e) {}

        if (masterInfo.logoIMGPath)
          try {
            store.set("logopath", masterInfo.logoIMGPath);
          } catch (e) {}

        if (masterInfo.userFirstName)
          try {
            store.set("firstname", masterInfo.userFirstName);
          } catch (e) {}

        if (masterInfo.userLastName)
          try {
            store.set("lastname", masterInfo.userLastName);
          } catch (e) {}

        if (data.name)
          try {
            store.set("adminname", data.name);
          } catch (e) {}

        if (data.role)
          try {
            store.set("adminrole", data.role);
          } catch (e) {}
      }

      try {
        setJwtFromResponse(data);
      } catch (e) {}

      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function setJwtFromResponse(respData) {
  if (!respData) return null;
  const data = Array.isArray(respData) ? respData[0] : respData;
  if (!data || typeof data !== "object") return null;

  const token = data?.jwtToken || data?.token || data?.accessToken || null;
  if (token) {
    try {
      store.set("accessToken", token);
    } catch (e) {}
    try {
      localStorage.setItem("accessToken", token);
    } catch (e) {}
    setCookie("accessToken", token);
  }

  // ✅ Collect and store extra fields
  const tenantId = "valeo";
  const branchCode =
    data?.branchCode || data?.masterUserInfo?.branchCode || "AVAL_ORG";
  const empID = data?.empID || data?.masterUserInfo?.empID;

  if (tenantId) {
    try {
      store.set("tenantId", tenantId);
    } catch (e) {}
    setCookie("tenantId", tenantId);
  }

  if (branchCode) {
    try {
      store.set("branchCode", branchCode);
    } catch (e) {}
    setCookie("branchCode", branchCode);
  }

  if (empID) {
    try {
      store.set("empID", empID);
    } catch (e) {}
    setCookie("empID", empID);
  }

  if (data?.userName) store.set("username", data.userName);
  if (data?.empFirstNane) store.set("firstname", data.empFirstNane);
  if (data?.empLastName) store.set("lastname", data.empLastName);

  if (data?.roleName) store.set("adminrole", data.roleName);
  if (data?.roleCode) store.set("roleCode", data.roleCode);
  if (data?.landingPageId) store.set("landingPageId", data.landingPageId);
  if (data?.userRoleList[0]?.uiModuleMstlist) {
    localStorage.setItem(
      "ModuleData",
      JSON.stringify(data.userRoleList[0].uiModuleMstlist)
    );
  }
  const rawPMSList =
    data?.userRoleList?.[0]?.uiModuleMstlist?.[4]?.uiScreenMstList || [];

  const minimizedPMSList = rawPMSList.map((item) => ({
    s: item.seqNO,
    l: item.linkUrl,
    d: item.displayName,
  }));
  const rawPMSMasterList =
    data?.userRoleList?.[0]?.uiModuleMstlist?.[5]?.uiScreenMstList || [];

  const minimizedPMSMasterList = rawPMSMasterList.map((item) => ({
    s: item.seqNO,
    l: item.linkUrl,
    d: item.displayName,
  }));
  const rawTraceabilityList =
    data?.userRoleList?.[0]?.uiModuleMstlist?.[6]?.uiScreenMstList || [];

  const minimizedTraceabilityList = rawTraceabilityList.map((item) => ({
    s: item.seqNO,
    l: item.linkUrl,
    d: item.displayName,
  }));

  if (data?.userRoleList[0]?.uiModuleMstlist) {
    setCookie("pmsReport", JSON.stringify(minimizedPMSList));
    setCookie("pmsMaster",JSON.stringify(minimizedPMSMasterList))
    setCookie("traceabilityMaster",JSON.stringify(minimizedTraceabilityList))
  }
  return token;
}

export async function register(email, password, name) {
  return apiClient
    .post("/auth/register", { email, password, name })
    .then((response) => {
      if (!response) return false;
      const { accessToken, tenantId, branchCode, empID } = response.data;

      if (accessToken) {
        store.set("accessToken", accessToken);
        localStorage.setItem("accessToken", accessToken);
        setCookie("accessToken", accessToken);
      }

      if (tenantId) {
        store.set("tenantId", tenantId);
        setCookie("tenantId", tenantId);
      }

      if (branchCode) {
        store.set("branchCode", branchCode);
        setCookie("branchCode", branchCode);
      } else {
        setCookie("branchCode", "AVAL_ORG"); 
      }

      if (empID) {
        store.set("empID", empID);
        setCookie("empID", empID);
      }

      return response.data;
    })
    .catch((err) => console.error(err));
}

export async function currentAccount() {
  store.set("accessToken", store.get("accessToken"));
  store.set("tenantId", store.get("tenantId"));
  store.set("branchCode", store.get("branchCode"));
  store.set("adminrole", store.get("adminrole"));
  store.set("adminname", store.get("adminname"));
  store.set("menu", store.get("menu"));

  return store.get("accessToken");
}

export async function logout() {
  return apiClient
    .get("/auth/logout")
    .then(() => {
      store.remove("accessToken");
      store.remove("tenantId");
      store.remove("branchCode");
      store.remove("empID");

      localStorage.removeItem("accessToken");
      deleteCookie("accessToken");
      deleteCookie("tenantId");
      deleteCookie("branchCode");
      deleteCookie("empID");
      localStorage.clear();
      return true;
    })
    .catch((err) => console.error(err));
}
