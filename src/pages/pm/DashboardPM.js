import React, {useState, useEffect} from "react";
import { Row, Col, Card, Select } from "antd";
import { ProjectTwoTone, QuestionCircleTwoTone, CheckCircleTwoTone, ClockCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import {useAuth} from "../../authConfig/AuthContext"
import { database } from '../../authConfig/firebase';


export default function DashboardPM(){
  const {currentUser} = useAuth()

  const [dataProject, setDataProject] = useState()
  const [dataSum, setDataSum] = useState()
  const [filterYear, setFilterYear] = useState()

  useEffect(() =>{
    let isSubscribed = true
    let result = []
    if (isSubscribed) {
      database.projects.where("projectManager", "==", currentUser.userData.email).where("projectPlanStatus", "==", "Approved").onSnapshot(snapshot => {
          var data = snapshot.docs.map(doc => doc.data().poYear)
          data.forEach((item) => {
            if(!result.includes(item)){
              result.push(item)
            }
          })
          setFilterYear(result)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  // Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed && currentUser) {
      database.projects.where("projectManager", "==", currentUser.userData.email).where("projectPlanStatus", "==", "Approved").onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  const getSummaryData = (year) =>  {
    if(!dataProject){
      return null
    }
    const dataFilter = dataProject.filter(item => item.poYear === year)

    const totalProject = dataFilter.length
    const inProgress = dataFilter.filter(item => item.projectStatus === 'In Progress').length
    const onScheduleDone = dataFilter.filter(item => item.projectStatus === 'On Schedule-Done').length
    const onScheduleInProgress = dataFilter.filter(item => item.projectStatus === 'On Schedule-In Progress').length
    const overScheduleDone = dataFilter.filter(item => item.projectStatus === 'Over Schedule-Done').length
    const overScheduleInProgress = dataFilter.filter(item => item.projectStatus === 'On Schedule-In Progress').length

    return {totalProject, inProgress, onScheduleDone, onScheduleInProgress,
       overScheduleDone, overScheduleInProgress}
  }

  function handleChange(values){
    setDataSum(getSummaryData(values))
  }
    return(
      <>
        <Card>
          <Select style={{width: 120}} onChange={handleChange}>
            {filterYear && filterYear.map((item) => {
                return(
                  <Select.Option key={item} value={item}>{item}</Select.Option>
                )
            })}
          </Select>

          {/* Project */}
          <Row style={{marginTop: 10}}>
            <Col span={6}>
              <Card title={<>Total Project<br/><br/><ProjectTwoTone style={{ fontSize: '50px'}}/> </>} style={{height: 220, textAlign: 'center'}}>
                {/* Total Project */}
                {dataSum && <h1>{dataSum.totalProject}</h1>}
              </Card> 
            </Col> 
            <Col span={6}>
              <Card title={<>On Schedule-Done<br/><br/><CheckCircleTwoTone twoToneColor={'green'} style={{ fontSize: '50px'}}/> </>} style={{height: 220, textAlign: 'center'}}>
                {dataSum && <h1>{dataSum.onScheduleDone}</h1>}
              </Card> 
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title={<>In Progress<br/><QuestionCircleTwoTone twoToneColor={'blue'} style={{ fontSize: '30px'}}/> </>} style={{height: 110, textAlign: 'center'}}>
                    {dataSum && <h6>{dataSum.inProgress}</h6>}
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title={<>On Schedule-In Progress<br/><ClockCircleTwoTone twoToneColor={'blue'} style={{ fontSize: '30px'}}/> </>} style={{height: 110, textAlign: 'center'}}>
                    {dataSum && <h6>{dataSum.onScheduleInProgress}</h6>}
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title={<>Over Schedule-Done<br/><ExclamationCircleTwoTone twoToneColor={'orange'} style={{ fontSize: '30px'}}/> </>} style={{height: 110, textAlign: 'center'}}>
                    {dataSum && <h6>{dataSum.overScheduleDone}</h6>}
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title={<>Over Schedule-In Progress<br/><WarningTwoTone twoToneColor={'red'} style={{ fontSize: '30px'}}/> </>} style={{height: 110, textAlign: 'center'}}>
                    {dataSum && <h6>{dataSum.overScheduleInProgress}</h6>}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </>
    )
}