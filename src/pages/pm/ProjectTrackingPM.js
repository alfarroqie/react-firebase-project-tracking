import React, { useState, useEffect } from "react";
import { Space, Button, Table, Tag, Tooltip, Form, Modal, Slider, DatePicker, Select, Input } from "antd";
import { EditOutlined } from '@ant-design/icons';

import {useAuth} from '../../authConfig/AuthContext'
import { database } from '../../authConfig/firebase';

export default function ProjectTrackingPM(){
  
  const {currentUser} = useAuth()
  const [dataProject, setDataProject] = useState()

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
      title: 'Project Status',
      dataIndex: 'projectStatus',
      width: '100px',
      render: tag => {
        let color
        if (tag === 'Not Started') {
          color = '';
        } else if (tag === 'In Progress') {
          color = 'blue'
        } else if (tag === 'On Schedule-In Progress') {
          color = 'blue'
        } else if (tag === 'OnSchedule-Done') {
          color = 'green'
        } else if (tag === 'Over Schedule-In Progress') {
          color = 'red'
        } else if (tag === 'Over Schedule-Done') {
          color = 'orange'
        }
        return (
          <Tag color={color}>{tag}</Tag>
        );
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
      render: tag => {
        let color
        if (tag === 'Inadequate') {
          color = 'red';
        } else if (tag === 'Sufficient') {
          color = 'green'
        } else if (tag === 'Borderline') {
          color = 'yellow'
        } else if (tag === 'Overlimit') {
          color = 'orange'
        }
        return (
          <Tag color={color}>{tag}</Tag>
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
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      width: '60px',
      render: (text, record) => (
        <Space>
          <Tooltip title="Update Progress">
                <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {setModalUpdate(true)}} />
              </Tooltip>
        </Space>
      ),
    },
  ]

  const [form] = Form.useForm();

  function onFinish(values){
    setLoading(true)
    try{
      console.log(values)
    } catch(err) {
      console.log(err)
    }
    setLoading(false)
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
          title="Update Progress" 
          visible={modalUpdate}
          footer={null}
          onCancel={() => setModalUpdate(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="small"
            // labelCol={{ span: 10 }}
            // wrapperCol={{ span: 20 }}
            // layout="horizontal"
          >
          <Input.Group compact>
          <Form.Item name="term1Actual" label="Term 1 Actual">
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Term 1 Status"
            name="term1Status"
          >
            <Select>
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
            <Select>
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
            <Select>
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
            <Select>
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
            <Select>
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