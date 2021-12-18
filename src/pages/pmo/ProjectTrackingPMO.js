import React, { useState, useEffect } from "react";
import { Space, Button, Table, Tag, Tooltip, Form, Input, InputNumber, Select, DatePicker, Modal, message } from "antd";
import { EditOutlined } from '@ant-design/icons';

import { database } from '../../authConfig/firebase';
import moment from 'moment';

export default function ProjectTrackingPMO(){
  const [dataProject, setDataProject] = useState()
  const [projectChoose, setProjectChoose]= useState()

  const [modalUpdate, setModalUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

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
  },[])

  const columns= [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      width: '100px',
      fixed: 'left'
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      width: '100px',
      fixed: 'left'
    },
    {
      title: 'Contract Number',
      dataIndex: 'contractNumber',
      width: '100px'
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      width: '100px'
    },
    {
      title: 'Project Start',
      dataIndex: 'projectStart',
      width: '100px'
    },
    {
      title: 'Project End',
      dataIndex: 'projectEnd',
      width: '100px'
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      width: '100px'
    },
    {
      title: 'Project Plan Status',
      dataIndex: 'projectPlanStatus',
      width: '100px',
      render: tag => {
        let color = ''
        if(tag === 'Waiting for Submit') {
          color = 'red';
        } else if (tag === 'Waiting for Review') {
          color = ''
        } else if (tag === 'Approved') {
          color = 'blue'
        }
        return (
          <>
            <Tag color={color}>{tag}</Tag>
          </>
        )
      }
    },
    {
      title: 'Project Status',
      dataIndex: 'projectStatus',
      width: '170px',
      render: (tag, record) => {
        let color
        let status
        if(record.projectPlanStatus !== 'Approved'){
          color = ''
          status = 'Not Started'
        } else if (!record.projectProgress || !record.projectEndActual){
          color = 'blue'
          status = 'In Progress'
        } else if (record.projectProgress < 100 && moment(record.projectEndActual, 'YYYY-MM-DD') <= moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'blue'
          status = 'On Schedule-In Progress'
        } else if (record.projectProgress === 100 && moment(record.projectEndActual, 'YYYY-MM-DD') <= moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'green'
          status = 'On Schedule-Done'
        } else if (record.projectProgress < 100 && moment(record.projectEndActual, 'YYYY-MM-DD') > moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'red'
          status = 'Over Schedule-In Progress'
        } else if (record.projectProgress === 100 && moment(record.projectEndActual, 'YYYY-MM-DD') > moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'orange'
          status = 'Over Schedule-Done'
        }
        return(
          <Tag color={color}>{status}</Tag>
        )
      }
    },
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      width: '100px'
    },
    {
      title: 'PO Year',
      dataIndex: 'poYear',
      width: '100px'
    },
    {
      title: 'Methodology',
      dataIndex: 'methodology',
      width: '105px'
    },
    {
      title: 'Resource Plan',
      dataIndex: 'resourcePlan',
      width: '100px'
    },
    {
      title: 'Resource Actual',
      dataIndex: 'resourceActual',
      width: '100px'
    },
    {
      title: 'Resource Status',
      dataIndex: 'resourceStatus',
      width: '100px',
      render: (tag, record) => {
        let color
        let status
        if(!record.resourcePlan || !record.resourceActual){
          status = ''
          color = ''
        } else if (record.resourceActual < record.resourcePlan){
          status = 'Inadequate'
          color = 'red'
        } else if(record.resourceActual === record.resourcePlan) {
          status = 'Sufficient'
          color = 'green'
        } else if ((record.resourceActual - record.resourcePlan) <= 3) {
          status = 'Borderline'
          color = 'yellow'
        } else if ((record.resourceActual - record.resourcePlan) > 3) {
          status = 'Overlimit'
          color = 'orange'
        }
            // if (tag === 'Inadequate') {
            //   color = 'red';
            // } else if (tag === 'Sufficient') {
            //   color = 'green'
            // } else if (tag === 'Borderline') {
            //   color = 'yellow'
            // } else if (tag === 'Overlimit') {
            //   color = 'orange'
            // }
        return (
          <Tag color={color}>{status}</Tag>
        );
      }
    },
    {
      title: 'PMO Role',
      dataIndex: 'pmoRole',
      width: '100px',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: '100px',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '100px',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      width: '100px',
      render: (tag) => {
        let color
        if(tag === 'Behind Schedule') {
          color = 'green'
        } else if(tag === 'On Schedule'){
          color = 'yellow'
        } else if(tag === 'Ahead Schedule'){
          color = 'red'
        }
        return(
          <Tag color={color}>{tag}</Tag>
        )
      }
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      width: '100px',
      render: (tag) => {
        let color
        if(tag === 'Under Budget') {
          color = 'green'
        } else if(tag === 'On Budget'){
          color = 'yellow'
        } else if(tag === 'Over Budget'){
          color = 'red'
        }
        return(
          <Tag color={color}>{tag}</Tag>
        )
      }
    },
    {
      title: 'Risk',
      dataIndex: 'risk',
      width: '100px',
      render: (tag,record) => {
            let color
            let status
            if (!record.budget || !record.schedule) {
              status = ''
              color = ''
            } else if (
              (record.schedule === 'Behind Schedule' && record.budget === 'Under Budget') ||
              (record.schedule === 'On Schedule' && record.budget === 'Under Budget') ||
              (record.schedule === 'Behind Schedule' && record.budget === 'On Budget') ||
              (record.schedule === 'On Schedule' && record.budget === 'On Budget')
            ) {
              status = 'Low Risk'
              color = 'green'
            } else if (
              (record.schedule === 'Ahead Schedule' && record.budget === 'Under Budget') ||
              (record.schedule === 'Ahead Schedule' && record.budget === 'On Budget')
            ) {
              status = 'Medium Risk'
              color = 'yellow'
            } else if (
              (record.schedule === 'Ahead Schedule' && record.budget === 'Over Budget') ||
              (record.schedule === 'On Schedule' && record.budget === 'Over Budget') ||
              (record.schedule === 'Behind Schedule' && record.budget === 'Over Budget')
            ) {
              status = 'High Risk'
              color = 'red'
            }

            // if (tag === 'Low Risk') {
            //   color = 'green';
            // } else if (tag === 'Medium Risk') {
            //   color = 'yellow'
            // } else if (tag === 'High Risk') {
            //   color = 'red'
            // }
            return (
              <Tag color={color}>{status}</Tag>
            );
      }
    },
    {
      title: 'Term 1 Deadline',
      dataIndex: 'term1Deadline',
      width: '100px',
    },
    {
      title: 'Term 1 Actual',
      dataIndex: 'term1Actual',
      width: '100px',
    },
    {
      title: 'Term 1 Status',
      dataIndex: 'term1Status',
      width: '100px',
    },
    {
      title: 'Term 2 Deadline',
      dataIndex: 'term2Deadline',
      width: '100px',
    },
    {
      title: 'Term 2 Actual',
      dataIndex: 'term2Actual',
      width: '100px',
    },
    {
      title: 'Term 2 Status',
      dataIndex: 'term2Status',
      width: '100px',
    },
    {
      title: 'Term 3 Deadline',
      dataIndex: 'term3Deadline',
      width: '100px',
    },
    {
      title: 'Term 3 Actual',
      dataIndex: 'term3Actual',
      width: '100px',
    },
    {
      title: 'Term 3 Status',
      dataIndex: 'term3Status',
      width: '100px',
    },
    {
      title: 'Term 4 Deadline',
      dataIndex: 'term4Deadline',
      width: '100px',
    },
    {
      title: 'Term 4 Actual',
      dataIndex: 'term4Actual',
      width: '100px',
    },
    {
      title: 'Term 4 Status',
      dataIndex: 'term4Status',
      width: '100px',
    },
    {
      title: 'Term 5 Deadline',
      dataIndex: 'term5Deadline',
      width: '100px',
    },
    {
      title: 'Term 5 Actual',
      dataIndex: 'term5Actual',
      width: '100px',
    },
    {
      title: 'Term 5 Status',
      dataIndex: 'term5Status',
      width: '100px',
    },
    {
      title: 'Project End Actual',
      dataIndex: 'projectEndActual',
      width: '100px',
    },
    {
      title: 'Project Progress',
      dataIndex: 'projectProgress',
      width: '100px',
    },
    {
      title: 'Project Status',
      dataIndex: 'projectStatus',
      width: '170px',
      render: (tag, record) => {
        let color
        let status
        if(record.projectPlanStatus !== 'Approved'){
          color = ''
          status = 'Not Started'
        } else if (!record.projectProgress || !record.projectEndActual){
          color = 'blue'
          status = 'In Progress'
        } else if (record.projectProgress < 100 && moment(record.projectEndActual, 'YYYY-MM-DD') <= moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'blue'
          status = 'On Schedule-In Progress'
        } else if (record.projectProgress === 100 && moment(record.projectEndActual, 'YYYY-MM-DD') <= moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'green'
          status = 'On Schedule-Done'
        } else if (record.projectProgress < 100 && moment(record.projectEndActual, 'YYYY-MM-DD') > moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'red'
          status = 'Over Schedule-In Progress'
        } else if (record.projectProgress === 100 && moment(record.projectEndActual, 'YYYY-MM-DD') > moment(record.projectEnd,'DD-MM-YYYY')){
          color = 'orange'
          status = 'Over Schedule-Done'
        }
        return(
          <Tag color={color}>{status}</Tag>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      width: '70px',
      render: (text, record) => (
        <Space>
          <Tooltip title="Update">
                <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { 
                  form.setFieldsValue({
                    poNumber: record.poNumber,
                    poYear: record.poYear,
                    methodology: record.methodology,
                    resourcePlan: record.resourcePlan,
                    resourceActual: record.resourceActual,
                    pmoRole: record.pmoRole,
                    priority: record.priority,
                    value: record.value,
                    schedule: record.schedule,
                    budget: record.budget,
                    term1Deadline: record.term1Deadline ? moment(record.term1Deadline, 'YYYY-MM-DD'): null,
                    term2Deadline: record.term2Deadline ? moment(record.term2Deadline, 'YYYY-MM-DD'): null,
                    term3Deadline: record.term3Deadline ? moment(record.term3Deadline, 'YYYY-MM-DD'): null,
                    term4Deadline: record.term4Deadline ? moment(record.term4Deadline, 'YYYY-MM-DD'): null,
                    term5Deadline: record.term5Deadline ? moment(record.term5Deadline, 'YYYY-MM-DD'): null,
                  })
                  setProjectChoose(record)
                  setModalUpdate(true)}
                  } 
                />
              </Tooltip>
        </Space>
      ),
    },
  ]

  const [form] = Form.useForm();

  function onFinish(values){
    try{
      setLoading(true)
      database.projects.doc(projectChoose.key).update({
        poNumber: values.poNumber ? values.poNumber : null,
        poYear: values.poYear ? values.poYear : null,
        methodology: values.methodology? values.methodology : null,
        resourcePlan: values.resourcePlan ? values.resourcePlan : null,
        resourceActual: values.resourceActual ? values.resourceActual : null,
        pmoRole: values.pmoRole ? values.pmoRole : null,
        priority: values.priority ? values.priority : null,
        value: values.value ? values.value : null,
        schedule: values.schedule ? values.schedule : null,
        budget: values.budget ? values.budget : null,
        term1Deadline: values.term1Deadline? values['term1Deadline'].format('YYYY-MM-DD') : null,
        term2Deadline: values.term2Deadline? values['term2Deadline'].format('YYYY-MM-DD') : null,
        term3Deadline: values.term3Deadline? values['term3Deadline'].format('YYYY-MM-DD') : null,
        term4Deadline: values.term4Deadline? values['term4Deadline'].format('YYYY-MM-DD') : null,
        term5Deadline: values.term5Deadline? values['term5Deadline'].format('YYYY-MM-DD') : null,
      })
      message.success("Success update data")
      form.resetFields()
      setLoading(false)
    } catch(err) {
      console.log(err)
      message.error("Failed update data")
      setLoading(false)
    }
    setModalUpdate(false)
  }
    return(
      <>
        <Table
          columns={columns}
          dataSource={dataProject}
          size="small" 
          bordered 
          scroll={{y: 800 }}
        />
        <Modal 
          style={{ top: 20 }}
          title="Update Project" 
          visible={modalUpdate}
          footer={null}
          onCancel={() => {
            setProjectChoose(null)
            setModalUpdate(false)
            form.resetFields()
          }}
        >
          {projectChoose && <h6>Project Code: {projectChoose.projectCode}</h6>}
          {projectChoose && <h6>Project Name: {projectChoose.projectName}</h6>}
          <br/>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="small"
          >
          <Input.Group compact>
          <Form.Item name="poNumber" label="PO Number">
            <Input/>
          </Form.Item>
          <Form.Item name="poYear" label="PO Year">
            <Input/>
          </Form.Item>
          </Input.Group>
          <Form.Item name="methodology" label="Methodology">
            <Select>
              <Select.Option key="fixedTime" value="Fixed Time">Fixed Time</Select.Option>
              <Select.Option key="agile" value="Agile">Agile</Select.Option>
            </Select>
          </Form.Item>
          <Input.Group compact>
          <Form.Item name="resourcePlan" label="Resource Plan">
            <InputNumber/>
          </Form.Item>
          <Form.Item name="resourceActual" label="Resource Actual">
            <InputNumber/>
          </Form.Item>
          </Input.Group>
          <Form.Item name="pmoRole" label="PMO Role">
            <Select>
              <Select.Option key="supportive" value="Supportive">Supportive</Select.Option>
              <Select.Option key="controlling" value="Controlling">Controlling</Select.Option>
              <Select.Option key="directive" value="Directive">Directive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select>
              <Select.Option key="low-priority" value="Low Value">Low Priority</Select.Option>
              <Select.Option key="med-priority" value="Medium Value">Medium Value</Select.Option>
              <Select.Option key="high-priority" value="High Value">High Value</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="value" label="Value">
            <Select>
              <Select.Option key="low-value" value="Low Value">Low Value</Select.Option>
              <Select.Option key="med-value" value="Medium Value">Medium Value</Select.Option>
              <Select.Option key="high-value" value="High Value">High Value</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="schedule" label="Schedule">
            <Select>
              <Select.Option key="behind-schedule" value="Behind Schedule">Behind Schedule</Select.Option>
              <Select.Option key="on-schedule" value="On Schedule">On Schedule</Select.Option>
              <Select.Option key="ahead-schedule" value="Ahead Schedule">Ahead Schedule</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="budget" label="Budget">
            <Select>
              <Select.Option key="under-budget" value="Under Budget">Under Budget</Select.Option>
              <Select.Option key="on-budget" value="On Budget">On Budget</Select.Option>
              <Select.Option key="Over-budget" value="Over Budget">Over Budget</Select.Option>
            </Select>
          </Form.Item>
          <Input.Group compact>
          <Form.Item name="term1Deadline" label="Term 1 Deadline">
              <DatePicker />
          </Form.Item>
          <Form.Item name="term2Deadline" label="Term 2 Deadline">
              <DatePicker />
          </Form.Item>
          <Form.Item name="term3Deadline" label="Term 3 Deadline">
              <DatePicker />
          </Form.Item>
          <Form.Item name="term4Deadline" label="Term 4 Deadline">
              <DatePicker />
          </Form.Item>
          <Form.Item name="term5Deadline" label="Term 5 Deadline">
              <DatePicker />
          </Form.Item>
          </Input.Group>
          <Form.Item>
            <Button type="primary" disabled={loading} htmlType="submit" className="w-100 text-center mt-3">
              Update
            </Button>
          </Form.Item>
          </Form>
        </Modal>
      </>
    )
}