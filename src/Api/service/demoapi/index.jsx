import serverApi from '../serverAPI';
import { setJwtFromResponse } from '../jwt';


export const apiPost = async (path, body = {}, config = {}) => {
	try {
		console.log('[demoapi] POST', path, body)
		const response = await serverApi.post(path, body, config);
		if (!response || typeof response.data === 'undefined') {
			throw new Error('Empty response from server');
		}
		return response.data;
	} catch (error) {
		// normalize error shape
		console.error('[demoapi] POST error', path, error?.response || error)
		const err = error?.response?.data || { responseCode: '500', responseMessage: error.message || 'Internal server error' };
		// attach original error for debugging
		err._original = error;
		throw err;
	}
};


export const apiGet = async (path, params = {}, config = {}) => {
	try {
		const merged = { params, ...config };
		const response = await serverApi.get(path, merged);
		if (!response || typeof response.data === 'undefined') {
			throw new Error('Empty response from server');
		}
		return response.data;
	} catch (error) {
		const err = error?.response?.data || { responseCode: '500', responseMessage: error.message || 'Internal server error' };
		err._original = error;
		throw err;
	}
};


export const login = async (username, password) => {
	try {
		const payload = { username, password };
		const data = await apiPost('authenticate', payload);
			// persist jwt and related fields when backend returns them
			try { setJwtFromResponse(data); } catch (e) { /* noop */ }
			return data;
	} catch (err) {
		throw err;
	}
};

export async function generateOTP(userName) {
  return serverApi
    .post(
      "generateOTP",
      { userName, tenantId:'valeo' },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => response.data)
    .catch((err) => {
      console.error("Generate OTP API error:", err);
      throw err;
    });
}
export async function verifyOTP(userName, otp) {
  return serverApi
    .post(
      "verifyOTP",
      { userName, otp, tenantId:'valeo' },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => response.data)
    .catch((err) => {
      console.error("Verify OTP API error:", err);
      throw err;
    });
}
export async function resetPassword(userName, password) {
  return serverApi
    .post(
      "resetPassword",
      { userName, password },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => response.data)
    .catch((err) => {
      console.error("Reset Password API error:", err);
      throw err;
    });
}

export const check = async () => {
	try {
		
	
	const data = await apiGet('valeoTwo/getDataTwo');
			
			try { setJwtFromResponse(data); } catch (e) { /* noop */ }
			return data;
	} catch (err) {
		throw err;
	}
};


export default {
	apiPost,
	apiGet,
	check,
	login,
};

