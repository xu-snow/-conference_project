import { GlobalOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Form, Input, Button, message } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user'
import React, { useState } from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import CreateForm from '@/pages/ListTableList/components/CreateForm';
import { queryChangePassword } from '@/services/user';
import { AccountLogout } from '@/services/login';
// import styles from './index.less';

export interface AccountMenuProps extends ConnectProps {
  className?: string;
  user: CurrentUser
}

export interface ChangePasswordItem {
  old_password: string;
  new_password1: string
  new_password2: string
}



const AccountMenu: React.FC<AccountMenuProps> = props => {
  const { dispatch, user, className } = props;
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const handleClick = ({ key }: ClickParam): void => {
    if (key == 'info') {
      console.log(user);
      message.info(user.user?.username)
    } else if (key == 'change_password') {
      handleUpdateModalVisible(true)
    } else if (key == 'out') {
      handleLogout()
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const operates = ['info', 'change_password', 'out'];
  const operatesLabels = {
    'info': '个人信息',
    'change_password': '更改密码',
    'out': '登出',
  };

  const handleLogout = async () => {
    const data = await AccountLogout()
    window.location.reload()

  }

  const handle_update = async (value: ChangePasswordItem) => {
    try {
      const data = await queryChangePassword(value)
      if (data.status != 0) {
        Object.keys(data.errors).forEach(key => {
          data.errors[key].forEach(item => {
            message.error(item)
          })
        })

      } else {
        handleUpdateModalVisible(false)
        message.success('成功')
        window.location.reload()
      }

    } catch (error) {
      message.error('失败请重试！');
      return false;
    }
  };


  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const menu = (
    <Menu onClick={handleClick}>
      {operates.map(locale => (
        <Menu.Item key={locale}>
          {operatesLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <CreateForm title_v={'修改密码'} onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handle_update}
        >
          <Form.Item
            label="老密码"
            name="old_password"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="new_password1"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认输入"
            name="new_password2"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
          </Button>
          </Form.Item>
        </Form>

      </CreateForm>
      <Dropdown overlay={menu} placement="bottomRight">
        <UserOutlined style={{ fontSize: 22, paddingTop: 20 }} ></UserOutlined>
      </Dropdown>
    </>

  );
};

export default connect(({ user }: ConnectState) => ({
  user: user.currentUser
}))(AccountMenu);

