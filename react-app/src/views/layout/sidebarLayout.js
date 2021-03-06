
import React from 'react'
import { Layout, Menu, Icon, Button } from 'antd'
import { NavLink } from 'react-router-dom'
import { logout } from '../../api/user'
import { removeToken } from '../../js/utils/auth'
import './sidebarLayout.css'

const { Header, Sider, Content } = Layout;

class Sidebar extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  logout = () => {
    logout().then(() => {
      window.location.hash = '#/login'
      removeToken()
    })
  }

  render() {
    return (
        <Layout id="layout-custom-trigger">
          <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <NavLink to="#/login">
                  <Icon type="user" />
                  <span>nav 1</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="video-camera" />
                <span>nav 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="upload" />
                <span>nav 3</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
              />
              <Button onClick={this.logout}>退出登录</Button>
            </Header>
            <Content style={{
              margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
            }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
    );
  }
}

export default Sidebar;