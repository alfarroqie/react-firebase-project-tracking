import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select } from "antd";
import { ProjectTwoTone, StopTwoTone, QuestionCircleTwoTone, CheckCircleTwoTone, ClockCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import { database } from '../../authConfig/firebase';

import Chart from "./Chart";

export default function DashboardPMO(){

  const [dataProject, setDataProject] = useState()

  //Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed) {
      database.projects.onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-next-line

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

    const resultSchedule= [];
    const sumSchedule = dataProject.filter(item => item.projectPlanStatus === 'Approved').map((item) => {
      return{
        poYear: item.poYear,
        schedule: item.schedule,
        count: 1
      }
    })
    sumSchedule.reduce(function(res, value) {
      if(!res[value.schedule]) {
        res[value.schedule] = {poYear: value.poYear, schedule: value.schedule, count: 0}
        resultSchedule.push(res[value.schedule])
      }
      res[value.schedule].count += value.count
      return res;
    }, {});

    const resultBudget= [];
    const sumBudget = dataProject.filter(item => item.projectPlanStatus === 'Approved').map((item) => {
      return{
        poYear: item.poYear,
        budget: item.budget,
        count: 1
      }
    })
    sumBudget.reduce(function(res, value) {
      if(!res[value.budget]) {
        res[value.budget] = {poYear: value.poYear, budget: value.budget, count: 0}
        resultBudget.push(res[value.budget])
      }
      res[value.budget].count += value.count
      return res;
    }, {});

    const resultRisk= [];
    const sumRisk = dataProject.filter(item => item.projectPlanStatus === 'Approved').map((item) => {
      return{
        risk: item.risk,
        count: 1
      }
    })
    sumRisk.reduce(function(res, value) {
      if(!res[value.risk]) {
        res[value.risk] = {risk: value.risk, count: 0}
        resultRisk.push(res[value.risk])
      }
      res[value.risk].count += value.count
      return res;
    }, {});

    return {totalProject, notStarted, inProgress, onScheduleDone, onScheduleInProgress,
       overScheduleDone, overScheduleInProgress, resultSchedule, resultBudget, resultRisk}
  }
  function handleChange(values){
    console.log(values)
  }
  
  const resData = getSummaryData()

    return(
      <>
        <Card>
          <Select style={{width: 120}} onChange={handleChange}>
            {/* {dataProject && dataProject.map(item => item.poYear).reduce().map((item) =>{
              return(
                <Select.Option key={item} value={item}> {item} </Select.Option>
              )
            })} */}
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
          {/* Summary */}
          <Card title="Project Tracking" style={{marginTop: 10}}>
          <Row>
            <Col span={8}>
              <Card title="Summary Schedule" style={{textAlign: 'center'}}>
                {resData && <Chart name="schedule" dataChart={resData.resultSchedule} />}
              </Card>
            </Col> 
            <Col span={8}>
              <Card title="Summary Budget" style={{textAlign: 'center'}}>
                {resData && <Chart name="budget" dataChart={resData.resultBudget} />}
              </Card>
            </Col> 
            <Col span={8}>
              <Card title="Summary Risk" style={{textAlign: 'center'}}>
                {resData && <Chart name="risk" dataChart={resData.resultRisk} />}
              </Card>
            </Col> 
          </Row>
          </Card>
        </Card>
      </>
    )
}