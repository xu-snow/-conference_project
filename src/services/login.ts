import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
  // mobile: string;
  // captcha: string;
}

export const API = REACT_APP_ENV?'/api':''

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function AccountLogin(params: LoginParamsType) {
  return request(`${API}/user/login/`, {
    method: 'POST',
    data: params,
    requestType:'form'
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
