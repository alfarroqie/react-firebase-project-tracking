import React, {useState, useEffect} from 'react';
import { Table, Button, Space, Form, Input, Select, Modal, DatePicker, message, Tooltip, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, BellOutlined } from '@ant-design/icons';

import { database, storage } from '../../authConfig/firebase';
import emailjs from 'emailjs-com'
import moment from 'moment'

export default function DashboardPMO() {
  const [dataProject, setDataProject] = useState()
  const [dataPM, setDataPM] = useState([])
  const [modalCreate, setModalCreate] = useState(false)
  const [modalApprove, setModalApprove] = useState(false)
  const [modalReject, setModalReject] = useState(false)
  const [modalReview, setModalReview] = useState(false)

  const [projectChoose, setProjectChoose]= useState()

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
  },[])
  //Data PM
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed) {
      database.users.where("isPmo", "==", false).onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataPM(data)
      })
    }
    return () => isSubscribed = false
  },[])

    //Columns for table
    const columns = [
    // {
    //   title: 'Project',
    //   children: [
        {
          title: 'Project Code',
          dataIndex: 'projectCode',
          width: '100px',
          fixed:'left'
        },
        {
          title: 'Project Name',
          dataIndex: 'projectName',
          width: '100px',
          fixed:'left'
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
    //   ]
    // },  
    {
      title: 'Project Plan',
      children: [
        {
          title: 'Status',
          dataIndex: 'projectPlanStatus',
          width: '130px',
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
          title: 'Comment',
          dataIndex: 'projectPlanComment',
          width: '100px',
        },
        {
          title: 'File',
          dataIndex: 'projectPlanFile',
          width: '100px',
          render: (text, record) => (
            <a href={record.projectPlanFile}>Download</a>
        ),
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          width: '150px',
          render: (text, record) => (
            <Space size="middle">
              <Tooltip title="Approve">
                <Button type="primary" shape="circle" icon={<CheckCircleOutlined />} disabled={!record.projectPlanFile || record.projectPlanStatus !== "Waiting for Review"} onClick={() => {setModalApprove(true); setProjectChoose({key:record.key, projectCode:record.projectCode,  projectName: record.projectName, contractNumber: record.contractNumber, customer:record.customer, pm:record.projectManager, projectPlanComment: record.projectPlanComment})}} />
              </Tooltip>
              <Tooltip title="Reject">
                <Button type="danger" shape="circle" icon={<CloseCircleOutlined />} disabled={!record.projectPlanFile || record.projectPlanStatus !== "Waiting for Review"} onClick={() => {setModalReject(true); setProjectChoose({key:record.key, projectCode:record.projectCode,  projectName: record.projectName, contractNumber: record.contractNumber, customer:record.customer, pm:record.projectManager, projectPlanComment: record.projectPlanComment})}} />
              </Tooltip>
              <Tooltip title="Review">
                <Button type="secondary" shape="circle" icon={<BellOutlined />} disabled={!record.projectPlanFile || record.projectPlanStatus !== "Waiting for Review"} onClick={() => {setModalReview(true); setProjectChoose({projectCode:record.projectCode,  projectName: record.projectName, contractNumber: record.contractNumber, customer:record.customer, pm:record.projectManager})}} />
              </Tooltip>
            </Space>
          ),
        },
      ]
    },
    ]

    const [formCreate] = Form.useForm();
    const [formApprove] = Form.useForm();
    const [formReject] = Form.useForm();
    const [formReview] = Form.useForm();
    const configDate = {
      rules: [
        {
          type: 'object',
          required: true,
          message: 'Please select date!',
        },
      ],
    };
    function submitCreate(values){
      try{
        database.projects.add({
          "projectCode": values.projectCode,
          "projectName": values.projectName,
          "contractNumber": values.contractNumber,
          "customer": values.customer,
          "projectStart": values['projectStart'].format('DD-MM-YYYY'),
          "projectEnd": values['projectEnd'].format('DD-MM-YYYY'),
          "projectManager": values.projectManager,
          "projectPlanStatus": "Waiting for Submit",
          // "projectStatus": null,
          "poNumber" : null,
          "poYear" : null,
          "methodology" : null,
          "resourcePlan": null,
          "resourceActual": null,
          "pmoROle": null,
          "priority": null,
          "value": null,
          "schedule": null,
          "budget": null,
          "term1Deadline": null,
          "term1Actual": null,
          "term1Status": null,
          "term2Deadline": null,
          'term2Actual': null,
          "term2Status": null,
          "term3Deadline": null,
          "term3Actual": null,
          "term3Status": null,
          "term4Deadline": null,
          "term4Actual": null,
          "term4Status": null,
          "term5Deadline": null,
          "term5Actual": null,
          "term5Status": null,
          "projectEndActual": null,
          "projectProgress": null,
        })
        const dataEmail = {
            to_email: values.projectManager,
            message: `Project Code: ${values.projectCode} <br>
                      Project Name: ${values.projectName} <br>
                      Contract Number: ${values.contractNumber} <br>
                      Customer: ${values.customer}<br>
                      Project Start: ${values['projectStart'].format('DD-MM-YYYY')}<br>
                      Project End: ${values['projectEnd'].format('DD-MM-YYYY')}<br>
                      `
        }
        emailjs.send('notif-app', 'newproject', dataEmail, 'user_jG4QPq3HFQpprBfuLL0ej')
          .then(function(response) {
            message.success("Success Send Email to PM")
            console.log('SUCCESS!', response.status, response.text);
          }, function(error) {
            message.error("Failed Send Email to PM")
            console.log('FAILED...', error);
        });
        message.success("Success Add New Project")
      } catch(err){
        message.error("Failed Add New Project")
      }
      formCreate.resetFields()
      setModalCreate(false)
    }
    function submitApprove(values){
      try{
        const dataEmail = {
          to_email: projectChoose.pm,
          project: `Project Code: ${projectChoose.projectCode} <br>
                    Project Name: ${projectChoose.projectName} <br>
                    Contract Number: ${projectChoose.contractNumber}<br>
                    Customer: ${projectChoose.customer}<br>
                    `,
          message: `Congratulation!<br>
                    This Project Plan has been Approved.<br>
                    Comment for Project Plan: ${values.projectPlanComment}<br><br>
                    Please check the application to update progress of project <br>
                    `
        }
        emailjs.send('notif-app', 'projectPlan', dataEmail, 'user_jG4QPq3HFQpprBfuLL0ej')
          .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            message.success(`Success send approved email!`)
          }, function(error) {
            console.log('FAILED...', error);
            message.error(`Failed send approved email!`)
        });
        database.projects.doc(projectChoose.key).update({
          projectStatus: "In Progress",
          projectPlanStatus: "Approved",
          projectPlanComment: values.projectPlanComment
        })
        message.success(`Success Approve Project Plan!`)
      } catch(err){
        console.log(err)
      }
      formApprove.resetFields()
      setModalApprove(false)
    }
    function submitReject(values){
      try{
        storage.ref(`/projectPlan/${projectChoose.key}`).listAll().then((result) => {
          result.items.map((item) =>{
            return item.delete()
          })
        })
        database.projects.doc(projectChoose.key).update({
          projectPlanComment: values.projectPlanComment,
          projectPlanStatus: "Waiting for Submit",
          projectPlanFile: null
        })
        const dataEmail = {
          to_email: projectChoose.pm,
          project: `Project Code: ${projectChoose.projectCode} <br>
                    Project Name: ${projectChoose.projectName} <br>
                    Contract Number: ${projectChoose.contractNumber}<br>
                    Customer: ${projectChoose.customer}<br>
                    `,
          message: `We're Sorry!<br>
                    This Project Plan has been Rejected.<br>
                    Comment for Project Plan: ${values.projectPlanComment}<br><br>
                    Please check the application to re-submit the project plan <br>
                    `
        }
        emailjs.send('notif-app', 'projectPlan', dataEmail, 'user_jG4QPq3HFQpprBfuLL0ej')
          .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            message.success(`Success send reject email!`)
          }, function(error) {
            console.log('FAILED...', error);
            message.error(`Failed send reject email!`)
        });
        message.success(`Success Reject Project Plan!`)
      } catch(err){
        console.log(err)
        message.error(`Failed Reject Project Plan!`)
      }
      formReject.resetFields()
      setModalReject(false)
    }
    function submitReview(values){
      try{
        const dataEmail = {
          to_email: projectChoose.pm,
          project: `Project Code: ${projectChoose.projectCode} <br>
                    Project Name: ${projectChoose.projectName} <br>
                    Contract Number: ${projectChoose.contractNumber}<br>
                    Customer: ${projectChoose.customer}<br>
                    `,
          message: `This Project Plan need to meeting review. Please attend the meeting: <br>
                     Meeting Name: ${values.meetingName}<br>
                     Meeting Schedule: ${values.meetingSchedule}<br>
                     Meeting Room: ${values.meetingRoom}<br>`
        }
        emailjs.send('notif-app', 'projectPlan', dataEmail, 'user_jG4QPq3HFQpprBfuLL0ej')
          .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            message.success(`Success send review email!`)
          }, function(error) {
            console.log('FAILED...', error);
            message.error(`Failed send review email!`)
        });
      } catch(err) {
        console.log(err)
        message.error(`Failed send review email!`)
      }
      formReview.resetFields()
      setModalReview(false)
    }

    return(
    <>
      <Table 
        columns={columns}
        dataSource={dataProject}
        size="small" 
        bordered 
        title={() => <Button onClick={() => setModalCreate(true)} type="primary" shape="round">New Project</Button>}
        scroll={{y: 400 }}
      />
      <Modal 
      title="Create New Project" 
      visible={modalCreate}
      footer={null}
      onCancel={() => {setModalCreate(false);}}
      >
        <Form
          form={formCreate}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 24 }}
          onFinish={submitCreate}
          autoComplete="off"
        >
          <Form.Item
            label="Project Code"
            name="projectCode"
            rules={[
            {
              required: true,
              message: 'Please input project code!',
            },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[
            {
              required: true,
              message: 'Please input project name!',
            },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contract Number"
            name="contractNumber"
            rules={[
            {
              required: true,
              message: 'Please input contract number',
            },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Customer"
            name="customer"
            rules={[
            {
              required: true,
              message: 'Please input customer!',
            },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="projectStart" label="Project Start" {...configDate}>
              <DatePicker />
          </Form.Item>
          <Form.Item name="projectEnd" label="Project End" {...configDate}>
              <DatePicker />
          </Form.Item>
          <Form.Item
            label="Project Manager"
            name="projectManager"
            rules={[
            {
              required: true,
              message: 'Please select Project Manager',
            },
            ]}
          >
            <Select>
              {dataPM.map((item) => {
              return(
                <Select.Option key={item.key} value={item.email}>{item.name}</Select.Option>
              )
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-100 text-center mt-3">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
      title="Approve Project Plan" 
      visible={modalApprove}
      footer={null}
      onCancel={() => {setModalApprove(false); setProjectChoose()}}
      >
        <Form
          form={formApprove}
            layout="vertical"
            onFinish={submitApprove}
            autoComplete="off"
        >
            <Form.Item
                label="Comment"
                name="projectPlanComment"
                rules={[
                {
                    required: true,
                    message: 'Please input comment!',
                },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-100 text-center mt-3">
                Approve Project Plan
                </Button>
            </Form.Item>
        </Form>
      </Modal>
      <Modal 
      title="Reject Project Plan" 
      visible={modalReject}
      footer={null}
      onCancel={() => {setModalReject(false); setProjectChoose()}}
      >
        <Form
          form={formReject}
            layout="vertical"
            onFinish={submitReject}
            autoComplete="off"
        >
            <Form.Item
                label="Comment"
                name="projectPlanComment"
                rules={[
                {
                    required: true,
                    message: 'Please input comment!',
                },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="danger" htmlType="submit" className="w-100 text-center mt-3">
                Reject Project Plan
                </Button>
            </Form.Item>
        </Form>
      </Modal>
      <Modal 
      title="Review Project Plan" 
      visible={modalReview}
      footer={null}
      onCancel={() => {setModalReview(false);setProjectChoose()}}
      >
        <Form
          form={formReview}
            layout="vertical"
            onFinish={submitReview}
            autoComplete="off"
        >
            <Form.Item
                label="Meeting Name"
                name="meetingName"
                rules={[
                {
                    required: true,
                    message: 'Please input meeting name!',
                },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Meeting Schedule"
                name="meetingSchedule"
                rules={[
                {
                    required: true,
                    message: 'Please input meeting schedule',
                },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Meeting Room"
                name="meetingRoom"
                rules={[
                {
                    required: true,
                    message: 'Please input meeting room!',
                },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-100 text-center mt-3">
                Review Project Plan
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </>
    )
}
