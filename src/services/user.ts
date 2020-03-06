import request from '@/utils/request';
import {ChangePasswordItem} from '@/components/AccountMenu'


export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request(`${API_ENV}/user/info/`);
}

export async function queryChangePassword(params:ChangePasswordItem): Promise<any> {
  return request(`${API_ENV}/user/password/`,{
    method: 'POST',
    data: params,
    requestType:'form'
  });
}



export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
