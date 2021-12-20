import React, {useState, useEffect} from "react";
import { Row, Col, Card, Select } from "antd";
import { ProjectTwoTone, StopTwoTone, QuestionCircleTwoTone, CheckCircleTwoTone, ClockCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import {useAuth} from "../../authConfig/AuthContext"
import { database } from '../../authConfig/firebase';


export default function DashboardPM(){
  const {currentUser} = useAuth()

  const [dataProject, setDataProject] = useState()
  // Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed && currentUser) {
      database.projects.where("projectManager", "==", currentUser.userData.email).onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  const getSummaryData = () =>  {
    if(!dataProject){
      return null
    }
    const totalProject = dataProject.length
    const notStarted = dataProject.filter(item => item.projectStatus === 'Not Started').length
    const inProgress = dataProject.filter(item => item.projectStatus === 'In Progress').length
    const onScheduleDone = dataProject.filter(item => item.projectStatus === 'On Schedule-Done').length
    const onScheduleInProgress = dataProject.filter(item => item.projectStatus === 'On Schedule-In Progress').length
    const overScheduleDone = dataProject.filter(item => item.projectStatus === 'Over Schedule-Done').length
    const overScheduleInProgress = dataProject.filter(item => item.projectStatus === 'On Schedule-In Progress').length

    return {totalProject, notStarted, inProgress, onScheduleDone, onScheduleInProgress,
       overScheduleDone, overScheduleInProgress}
  }
  const resData = getSummaryData()

    return(
      <>
        <Card>
          <Select allowClear style={{width: 120}}>
            <Select.Option key="1" value=""> test</Select.Option> 
            <Select.Option key="2" value=""> test</Select.Option> 
            <Select.Option key="3" value=""> test</Select.Option> 
          </Select>

          {/* Project */}
          <Row style={{marginTop: 10}}>
            <Col span={6}>
              <Card title="Total Project"style={{height: 220, textAlign: 'center'}}>
                {/* Total Project */}
                <p><ProjectTwoTone style={{ fontSize: '30px'}}/></p>
                {resData && <h1>{resData.totalProject}</h1>}
              </Card> 
            </Col> 
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title="Not Started" style={{height: 110, textAlign: 'center'}}>
                    <p><StopTwoTone twoToneColor='grey' style={{fontSize: '20px'}}/></p>
                    {resData && <h6>{resData.notStarted}</h6>}
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title="In Progress" style={{height: 110, textAlign: 'center'}}>
                    <p><QuestionCircleTwoTone twoToneColor='blue' style={{fontSize: '20px'}}/></p>
                    {resData && <h6>{resData.inProgress}</h6>}
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title="On Schedule-Done" style={{height: 110, textAlign: 'center'}}>
                    <p><CheckCircleTwoTone twoToneColor='green' style={{fontSize: '20px'}}/></p>
                    {resData && <h6>{resData.onScheduleDone}</h6>}
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title="On Schedule-In Progress" style={{height: 110, textAlign: 'center'}}>
                    <p><ClockCircleTwoTone twoToneColor='blue' style={{fontSize: '20px'}}/></p>
                    {resData && <h6>{resData.onScheduleInProgress}</h6>}
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title="Over Schedule-Done" style={{height: 110, textAlign: 'center'}}>
                    <p><ExclamationCircleTwoTone twoToneColor='orange' style={{fontSize: '20px'}}/></p>
                    {resData && <h6>{resData.overScheduleDone}</h6>}
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title="Over Schedule-In Progress" style={{height: 110, textAlign: 'center'}}>
                    <p><WarningTwoTone twoToneColor='red' style={{fontSize: '20px'}}/></p>
                    {resData && <h6>{resData.overScheduleInProgress}</h6>}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </>
    )
}