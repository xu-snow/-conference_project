import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
  // mobile: string;
  // captcha: string;
}


export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function AccountLogin(params: LoginParamsType) {
  return request(`${API_ENV}/user/login/`, {
    method: 'POST',
    data: params,
    requestType:'form'
  });
}

export async function AccountLogout() {
  return request(`${API_ENV}/user/logout/`, {
    method: 'POST',
  });
}


export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
