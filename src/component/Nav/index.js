import { Menu } from 'antd';
import React,{ Component } from 'react';
import logo from './nav_logo.png';
import NavLink from './NavLink';

// 导航组件
export default class Navigation extends Component {
  render () {
    return (
      <div className="navigation">
        <div className="logo">
          <img src={logo} alt="logo" className="logo-img"/>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          // defaultSelectedKeys={['1']} // 根据用户权限，默认选择对应导航
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <NavLink to="/orders">订单系统</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="match">搭 配</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="goods">商品</NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink to="admins">账号管理</NavLink>
          </Menu.Item>
          <Menu.Item key="5">
            <NavLink to="/xinan">纽扣的页面</NavLink>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}





