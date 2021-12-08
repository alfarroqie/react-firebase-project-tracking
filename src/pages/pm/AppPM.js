import React, {useState} from 'react';
import { Layout, Menu, } from 'antd';
import { DatabaseOutlined, LogoutOutlined } from '@ant-design/icons';
import { Routes, Route, Link, Navigate, useNavigate} from 'react-router-dom';

import { useAuth } from '../../authConfig/AuthContext';
import DashboardPM from './DashboardPM';

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
      <Navigate to="/" />
    )
  } else if (currentUser.displayName === "pmo"){
    return(
      <Navigate to="/pmo" />
    )
  } else {
    return(
      <>
      <Layout>
        <Layout style={{minHeight: '100vh'}}>
          <Sider width={200} className="site-layout-background" collapsible defaultCollapsed={true}>
            <Menu
              mode="inline"
              selectedKeys = {navigateKey}
              style={{ height: '100%', borderRight: 0 }}
              onClick={(e) => setNavigateKey(e.key)}
              theme="dark"
            >
              <Menu.Item key="PMDashboard" icon={<DatabaseOutlined />}><Link to='/pm'/>Project</Menu.Item>
              <Menu.Item key="logoutPM" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Routes>
                <Route exact path="/" element={<DashboardPM/>} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      </>
    )
  }
}

export default AppPMO;