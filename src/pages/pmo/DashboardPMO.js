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
      database.projects.where('projectPlanStatus', '==', 'Approved').onSnapshot(snapshot => {
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
    const resultSchedule= [];
    const sumSchedule = dataProject.map((item) => {
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
    const sumBudget = dataProject.map((item) => {
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

    // const resultRisk= [];
    // const sumRisk = dataProject.map((item) => {
    //   return{
    //     risk: item.risk,
    //     count: 1
    //   }
    // })
    // sumRisk.reduce(function(res, value) {
    //   if(!res[value.risk]) {
    //     res[value.risk] = {risk: value.risk, count: 0}
    //     resultRisk.push(res[value.risk])
    //   }
    //   res[value.risk].count += value.count
    //   return res;
    // }, {});

    return {resultSchedule, resultBudget}
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
                <h1>X</h1>
              </Card> 
            </Col> 
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title="Not Started" style={{height: 110, textAlign: 'center'}}>
                    <p><StopTwoTone twoToneColor='grey' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title="In Progress" style={{height: 110, textAlign: 'center'}}>
                    <p><QuestionCircleTwoTone twoToneColor='blue' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title="On Schedule-Done" style={{height: 110, textAlign: 'center'}}>
                    <p><CheckCircleTwoTone twoToneColor='green' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title="On Schedule-In Progress" style={{height: 110, textAlign: 'center'}}>
                    <p><ClockCircleTwoTone twoToneColor='blue' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" title="Over Schedule-Done" style={{height: 110, textAlign: 'center'}}>
                    <p><ExclamationCircleTwoTone twoToneColor='orange' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" title="Over Schedule-In Progress" style={{height: 110, textAlign: 'center'}}>
                    <p><WarningTwoTone twoToneColor='red' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* Summary */}
          <Row style={{marginTop: 10}}>
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
            <Col span={8}> <Card title="Summary Risk" style={{textAlign: 'center'}}>test</Card> </Col> 
          </Row>
        </Card>
      </>
    )
}