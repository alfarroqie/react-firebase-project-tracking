import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select } from "antd";
import { ProjectTwoTone, QuestionCircleTwoTone, CheckCircleTwoTone, ClockCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import { database } from '../../authConfig/firebase';

import Chart from "./Chart";

export default function DashboardPMO(){

  const [dataProject, setDataProject] = useState()
  const [dataSum, setDataSum] = useState()
  const [filterYear, setFilterYear] = useState()

  useEffect(() =>{
    let isSubscribed = true
    let result = []
    if (isSubscribed) {
      database.projects.where("projectPlanStatus", "==", "Approved").onSnapshot(snapshot => {
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
  },[]) // eslint-disable-next-line

  //Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed) {
      database.projects.where("projectPlanStatus", "==", "Approved").onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-next-line

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

    const resultSchedule= [];
    const sumSchedule = dataFilter.map((item) => {
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
    const sumBudget = dataFilter.map((item) => {
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
    const sumRisk = dataFilter.map((item) => {
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

    return {totalProject, inProgress, onScheduleDone, onScheduleInProgress,
       overScheduleDone, overScheduleInProgress, resultSchedule, resultBudget, resultRisk}
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
          {/* Summary */}
          {/* <Card style={{marginTop: 10}}> */}
          <Row>
            <Col span={8}>
              <Card title="Summary Schedule" style={{textAlign: 'center'}}>
                {dataSum && <Chart name="schedule" dataChart={dataSum.resultSchedule} />}
              </Card>
            </Col> 
            <Col span={8}>
              <Card title="Summary Budget" style={{textAlign: 'center'}}>
                {dataSum && <Chart name="budget" dataChart={dataSum.resultBudget} />}
              </Card>
            </Col> 
            <Col span={8}>
              <Card title="Summary Risk" style={{textAlign: 'center'}}>
                {dataSum && <Chart name="risk" dataChart={dataSum.resultRisk} />}
              </Card>
            </Col> 
          </Row>
          {/* </Card> */}
        </Card>
      </>
    )
}