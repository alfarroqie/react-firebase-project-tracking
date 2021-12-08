import React, {useState, useEffect} from 'react';
import { Table, Button, Space, Form, Input, Modal, message } from 'antd';
import { Link } from "react-router-dom"

import { database, storage } from '../../authConfig/firebase';
import emailjs from 'emailjs-com'

export default function DashboardPMO() {
  const [dataProject, setDataProject] = useState()
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

    //Columns for table
    const columns = [
    {
      title: 'Code Project',
      dataIndex: 'codeProject',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
    },
    {
      title: 'Contract Number',
      dataIndex: 'contractNumber',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
    },
    {
      title: 'Project Status',
      dataIndex: 'projectStatus',
    },
    {
      title: 'Project Plan',
      dataIndex: 'urlDownload',
      render: (text, record) => (
        <a href={record.urlDownload}>Download</a>
    ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (text, record) => (
        <Space size="middle">
          <Button disabled={!record.urlDownload || record.projectStatus !== "Waiting for Review"} onClick={() => {setModalApprove(true); setProjectChoose({key:record.key})}} type="primary">Approve</Button>
          <Button disabled={!record.urlDownload || record.projectStatus !== "Waiting for Review"} onClick={() => {setModalReject(true); setProjectChoose({key:record.key})} } type="danger" >Reject</Button>
          <Button disabled={!record.urlDownload || record.projectStatus !== "Waiting for Review"} onClick={() => {setModalReview(true); setProjectChoose({codeProject:record.codeProject, customer:record.customer, contractNumber: record.contractNumber, pm:record.projectManager})}} type="secondary" >Review</Button>
        </Space>
      ),
    },
    ]

    const [form] = Form.useForm();
    function submitApprove(values){
      // console.log(values)
      try{
        database.projects.doc(projectChoose.key).update({
          projectStatus: "In Progress",
          comment: values.comment
        })
        message.success(`Success Approve Project Plan!`)
      } catch(err){
        console.log(err)
      }
      form.resetFields()
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
          comment: values.comment,
          projectStatus: "Waiting for Submit Project Plan",
          urlDownload: null
        })
        message.success(`Success Reject Project Plan!`)
      } catch(err){
        console.log(err)
        message.error(`Failed Reject Project Plan!`)
      }
      form.resetFields()
      setModalReject(false)
    }
    function submitReview(values){
      try{
        const dataEmail = {
          to_email: projectChoose.pm,
          message1: `Code Project: ${projectChoose.codeProject} <br>
                    Customer: ${projectChoose.customer}<br>
                    Contract Number: ${projectChoose.contractNumber}<br>
                    `,
          message2: `Meeting Name: ${values.meetingName}<br>
                     Meeting Schedule: ${values.meetingSchedule}<br>
                     Meeting Room: ${values.meetingRoom}<br>`
      }
      emailjs.send('notif-app', 'review_pp', dataEmail, 'user_jG4QPq3HFQpprBfuLL0ej')
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
      });
      message.success(`Success send review email!`)
      } catch(err) {
        console.log(err)
        message.error(`Failed send review email!`)
      }
      form.resetFields()
      setModalReview(false)
    }

    return(
    <>
      <Button type="primary"><Link to="/pmo/project"> Create Project </Link></Button>
      <Table columns={columns} dataSource={dataProject} size="middle"/>
      <Modal 
      title="Approve Project Plan" 
      visible={modalApprove}
      footer={null}
      onCancel={() => {setModalApprove(false); setProjectChoose()}}
      >
        <Form
          form={form}
            layout="vertical"
            onFinish={submitApprove}
            autoComplete="off"
        >
            <Form.Item
                label="Comment"
                name="comment"
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
          form={form}
            layout="vertical"
            onFinish={submitReject}
            autoComplete="off"
        >
            <Form.Item
                label="Comment"
                name="comment"
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
          form={form}
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