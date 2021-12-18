import React from "react";
import { Row, Col, Card, Select } from "antd";
import { ProjectTwoTone, StopTwoTone, QuestionCircleTwoTone, CheckCircleTwoTone, ClockCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

export default function DashboardPM(){

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
              <Card title="Total Project"style={{height: 200, textAlign: 'center'}}>
                {/* Total Project */}
                <p><ProjectTwoTone style={{ fontSize: '30px'}}/></p>
                <h1>X</h1>
              </Card> 
            </Col> 
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" style={{height: 100, textAlign: 'center'}}>
                    <h6>Not Started</h6>
                    <p><StopTwoTone twoToneColor='grey' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" style={{height: 100, textAlign: 'center'}}>
                    <h6>In Progress</h6>
                    <p><QuestionCircleTwoTone twoToneColor='blue' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" style={{height: 100, textAlign: 'center'}}>
                    <h6>On Schedule-Done</h6>
                    <p><CheckCircleTwoTone twoToneColor='green' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" style={{height: 100, textAlign: 'center'}}>
                    <h6>On Schedule-In Progress</h6>
                    <p><ClockCircleTwoTone twoToneColor='blue' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={24}>
                  <Card size="small" style={{height: 100, textAlign: 'center'}}>
                    <h6>Over Schedule-Done</h6>
                    <p><ExclamationCircleTwoTone twoToneColor='orange' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card size="small" style={{height: 100, textAlign: 'center'}}>
                    <h6>Over Schedule-In Progress</h6>
                    <p><WarningTwoTone twoToneColor='red' style={{fontSize: '20px'}}/></p>
                    <h6>X</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </>
    )
}