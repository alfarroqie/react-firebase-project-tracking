import React, {useState} from 'react';
import { Layout, Menu, } from 'antd';
import { DashboardOutlined, BarsOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useNavigate, Navigate} from 'react-router-dom';

import DashboardPMO from './DashboardPMO';
import ProjectPMO from './ProjectPMO';
import PM from "./PM"

import { useAuth } from '../../authConfig/AuthContext';
const { Content, Sider } = Layout;

function AppPMO() {
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate()

  const [navigateKey, setNavigateKey] = useState("")

  async function handleLogout() {
    try{
      await logout()
      navigate("/")

    } catch(err){
      console.log(err)
    }
  }
  
  if (!currentUser){
    return(
      <Navigate to="/"/>
    )
  } else if (!currentUser.userData.isPmo){
    return(
      <Navigate to="/pm" />
    )
  } else {
    return(
      <>
      <Layout>
        <Layout style={{minHeight: '100vh'}}>
          <Sider width={150} className="site-layout-background" collapsible defaultCollapsed={true}>
            <Menu
              mode="inline"
              selectedKeys = {navigateKey}
              style={{ height: '100%', borderRight: 0 }}
              onClick={(e) => setNavigateKey(e.key)}
              theme="dark"
            >
              <Menu.Item key="dashboardPMO" icon={<DashboardOutlined />}><Link to='/pmo'/>Dashboard</Menu.Item>
              <Menu.Item key="projectPMO" icon={<BarsOutlined />}><Link to='/pmo/project'/>Project</Menu.Item>
              <Menu.Item key="pmPMO" icon={<UserOutlined />}><Link to='/pmo/PM'/>Project Manager</Menu.Item>
              <Menu.Item key="logoutPMO" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Menu.Item>
            </Menu>
          </Sider>
          {/* <Layout style={{ padding: '0 24px 24px' }}> */}
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Routes>
                <Route exact path="/" element={<DashboardPMO/>}/>
                <Route path="/project" element={<ProjectPMO/>} />
                <Route path="/PM" element={<PM/>} />
              </Routes>
            </Content>
          {/* </Layout> */}
        </Layout>
      </Layout>
      </>
    )
  }
}

export default AppPMO;