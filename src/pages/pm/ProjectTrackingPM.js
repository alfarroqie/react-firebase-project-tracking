import React, { useState, useEffect } from "react";
import { Space, Button, Table, Tag, Tooltip, Form, Modal, Slider, DatePicker, Select, Input, message } from "antd";
import { EditOutlined } from '@ant-design/icons';

import {useAuth} from '../../authConfig/AuthContext'
import { database } from '../../authConfig/firebase';

import moment from 'moment';

export default function ProjectTrackingPM(){
  
  const {currentUser} = useAuth()
  const [dataProject, setDataProject] = useState()
  const [projectChoose, setProjectChoose] = useState()

  const [modalUpdate, setModalUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

  //Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed) {
      database.projects.where('projectPlanStatus', '==', 'Approved').where("projectManager", "==", currentUser.userData.email).onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

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
      width: '100px',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      width: '100px',
    },
    {
      title: 'Project Start',
      dataIndex: 'projectStart',
      width: '100px',
    },
    {
      title: 'Project End',
      dataIndex: 'projectEnd',
      width: '100px',
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      width: '100px',
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
      title: 'PO Number',
      dataIndex: 'poNumber',
      width: '100px',
    },
    {
      title: 'PO Year',
      dataIndex: 'poYear',
      width: '100px',
    },
    {
      title: 'Methodology',
      dataIndex: 'methodology',
      width: '105px',
    },
    {
      title: 'Resource Plan',
      dataIndex: 'resourcePlan',
      width: '100px',
    },
    {
      title: 'Resource Actual',
      dataIndex: 'resourceActual',
      width: '100px',
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
        return (
          <Tag color={color}>{status}</Tag>
        );
      }
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
        if(tag === 'Not Started'){
          color = ''
        } else if (tag === 'In Progress' || tag === 'On Schedule-In Progress'){
          color = 'blue'
        } else if(tag === 'On Schedule-Done'){
          color = 'green'
        } else if(tag === 'Over Schedule-In Progress'){
          color = 'red'
        } else if(tag === 'Over Schedule-Done'){
          color = 'orange'
        }
        // let status
        // if(record.projectPlanStatus !== 'Approved'){
        //   color = ''
        //   status = 'Not Started'
        // } else if (!record.projectProgress || !record.projectEndActual){
        //   color = 'blue'
        //   status = 'In Progress'
        // } else if (record.projectProgress < 100 && moment(record.projectEndActual, 'YYYY-MM-DD') <= moment(record.projectEnd,'DD-MM-YYYY')){
        //   color = 'blue'
        //   status = 'On Schedule-In Progress'
        // } else if (record.projectProgress === 100 && moment(record.projectEndActual, 'YYYY-MM-DD') <= moment(record.projectEnd,'DD-MM-YYYY')){
        //   color = 'green'
        //   status = 'On Schedule-Done'
        // } else if (record.projectProgress < 100 && moment(record.projectEndActual, 'YYYY-MM-DD') > moment(record.projectEnd,'DD-MM-YYYY')){
        //   color = 'red'
        //   status = 'Over Schedule-In Progress'
        // } else if (record.projectProgress === 100 && moment(record.projectEndActual, 'YYYY-MM-DD') > moment(record.projectEnd,'DD-MM-YYYY')){
        //   color = 'orange'
        //   status = 'Over Schedule-Done'
        // }
        return(
          <Tag color={color}>{tag}</Tag>
        )
      }
    },
    {
      title: 'PMO Review',
      dataIndex: 'pmoReview',
      width: '100px',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      width: '60px',
      render: (text, record) => (
        <Space>
          <Tooltip title="Update Progress">
                <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => 
                  {
                    form.setFieldsValue({
                      term1Actual: record.term1Actual? moment(record.term1Actual, 'YYYY-MM-DD'): null,
                      term1Status: record.term1Status,
                      term2Actual: record.term2Actual? moment(record.term2Actual, 'YYYY-MM-DD'): null,
                      term2Status: record.term2Status,
                      term3Actual: record.term3Actual? moment(record.term3Actual, 'YYYY-MM-DD'): null,
                      term3Status: record.term3Status,
                      term4Actual: record.term4Actual? moment(record.term4Actual, 'YYYY-MM-DD'): null,
                      term4Status: record.term4Status,
                      term5Actual: record.term5Actual? moment(record.term5Actual, 'YYYY-MM-DD'): null,
                      term5Status: record.term5Status,
                      projectEndActual: record.projectEndActual? moment(record.projectEndActual, 'YYYY-MM-DD'): null,
                      projectProgress: record.projectProgress
                    })
                    setProjectChoose(record)
                    setModalUpdate(true)
                  }
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
      let status = 'In Progress'
      if(values.projectProgress && values.projectEndActual){
        if(values.projectProgress < 100 && values.projectEndActual <= moment(projectChoose.projectEnd, 'DD-MM-YYYY')){
          status = 'On Schedule-In Progress'
        } else if (values.projectProgress === 100 && values.projectEndActual <= moment(projectChoose.projectEnd, 'DD-MM-YYYY')){
          status = 'On Schedule-Done'
        } else if (values.projectProgress < 100 && values.projectEndActual > moment(projectChoose.projectEnd, 'DD-MM-YYYY')){
          status = 'Over Schedule-In Progress'
        } else if (values.projectProgress === 100 && values.projectEndActual > moment(projectChoose.projectEnd, 'DD-MM-YYYY')){
          status = 'Over Schedule-Done'
        }
      }
      database.projects.doc(projectChoose.key).update({
        term1Actual: values.term1Actual? values['term1Actual'].format('YYYY-MM-DD') : null,
        term1Status: values.term1Status? values.term1Status : null,
        term2Actual: values.term2Actual? values['term2Actual'].format('YYYY-MM-DD') : null,
        term2Status: values.term2Status? values.term2Status : null,
        term3Actual: values.term3Actual? values['term3Actual'].format('YYYY-MM-DD') : null,
        term3Status: values.term3Status? values.term3Status : null,
        term4Actual: values.term4Actual? values['term4Actual'].format('YYYY-MM-DD') : null,
        term4Status: values.term4Status? values.term4Status : null,
        term5Actual: values.term5Actual? values['term5Actual'].format('YYYY-MM-DD') : null,
        term5Status: values.term5Status? values.term5Status : null,
        projectEndActual: values.projectEndActual? values['projectEndActual'].format('YYYY-MM-DD') : null,
        projectProgress: values.projectProgress? values.projectProgress : null,
        projectStatus: status
      })
      message.success("Success update data")
      form.resetFields()
      setLoading(false)
    } catch(err) {
      message.error("Failed update data")
      console.log(err)
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
          title="Update Progress" 
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
          <Form.Item name="term1Actual" label="Term 1 Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Term 1 Status"
            name="term1Status"
          >
            <Select allowClear>
              <Select.Option key="done" value="Done">Done</Select.Option>
              <Select.Option key="notyet" value="Not Yet">Not Yet</Select.Option>
              <Select.Option key="na" value="N/A">N/A</Select.Option>
            </Select>
          </Form.Item>
          </Input.Group>
          <Input.Group compact>
          <Form.Item name="term2Actual" label="Term 2 Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Term 2 Status"
            name="term2Status"
          >
            <Select allowClear>
              <Select.Option key="done" value="Done">Done</Select.Option>
              <Select.Option key="notyet" value="Not Yet">Not Yet</Select.Option>
              <Select.Option key="na" value="N/A">N/A</Select.Option>
            </Select>
          </Form.Item>
          </Input.Group>
          <Input.Group compact>
          <Form.Item name="term3Actual" label="Term 3 Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Term 3 Status"
            name="term3Status"
          >
            <Select allowClear>
              <Select.Option key="done" value="Done">Done</Select.Option>
              <Select.Option key="notyet" value="Not Yet">Not Yet</Select.Option>
              <Select.Option key="na" value="N/A">N/A</Select.Option>
            </Select>
          </Form.Item>
          </Input.Group>
          <Input.Group compact>
          <Form.Item name="term4Actual" label="Term 4 Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Term 4 Status"
            name="term4Status"
          >
            <Select allowClear>
              <Select.Option key="done" value="Done">Done</Select.Option>
              <Select.Option key="notyet" value="Not Yet">Not Yet</Select.Option>
              <Select.Option key="na" value="N/A">N/A</Select.Option>
            </Select>
          </Form.Item>
          </Input.Group>
          <Input.Group compact>
          <Form.Item name="term5Actual" label="Term 5 Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Term 5 Status"
            name="term5Status"
          >
            <Select allowClear>
              <Select.Option key="done" value="Done">Done</Select.Option>
              <Select.Option key="notyet" value="Not Yet">Not Yet</Select.Option>
              <Select.Option key="na" value="N/A">N/A</Select.Option>
            </Select>
          </Form.Item>
          </Input.Group>
          <Form.Item name="projectEndActual" label="Project End Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item name="projectProgress" label="Project Progress">
            <Slider min={0} max={100} />
          </Form.Item>
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