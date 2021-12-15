import React, { useState, useEffect} from 'react';
import { Table, Space, Button, Modal, Form, Input, message, Tooltip, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { useAuth } from '../../authConfig/AuthContext';
import { database, storage } from '../../authConfig/firebase';

export default function DashboardPM() {
  const {currentUser} = useAuth()
  const [loading, setLoading] = useState(false)
  
  const [dataProject, setDataProject] = useState()
  const [modalUploadPP, setModalUploadPP] = useState(false)
  const [projectPlanFile, setProjectPlanFile] = useState()
  const [projectChoose, setProjectChoose] = useState()

  // Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed && currentUser) {
      database.projects.where("projectManager", "==", currentUser.userData.email).onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

    //Columns for table
    const columns = [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      fixed:'left'
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      fixed:'left'
    },
    {
      title: 'Contract Number',
      dataIndex: 'contractNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
    },
    {
      title: 'Project Start',
      dataIndex: 'projectStart',
    },
    {
      title: 'Project End',
      dataIndex: 'projectEnd',
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
    },
    {
      title: 'Project Status',
      dataIndex: 'projectStatus',
      render: tags => (
        <>
          {new Array(tags).map(tag => {
            let color
            if (tag === 'In Progress') {
              color = '';
            } else if (tag === 'Not Started') {
              color = 'red'
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Project Plan',
      children:[
        {
          title: 'Status',
          dataIndex: 'projectPlanStatus',
          render: tags => (
            <>
              {new Array(tags).map(tag => {
                let color
                if (tag === 'Waiting for Submit') {
                  color = 'red';
                } else if (tag === 'Waiting for Review') {
                  // color = ''
                } else if (tag === 'Approved') {
                  color = 'blue'
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Comment',
          dataIndex: 'projectPlanComment',
        },
        {
          title: 'File',
          dataIndex: 'projectPlanFile',
          render: (text, record) => (
              <a href={record.projectPlanFile}>Download</a>
          ),
        },
        {
          title: 'Actions',
          dataIndex: 'key',
          render: (text, record) => (
            <Space size="middle">
              <Tooltip title="Upload Project Plan">
                <Button type="primary" shape="circle" icon={<UploadOutlined />} disabled={record.projectPlanFile} onClick={() => {setModalUploadPP(true); setProjectChoose({key: record.key, projectCode: record.projectCode})}} />
              </Tooltip>
            </Space>
          ),
        },  
      ]
    },
    ]

    const [form] = Form.useForm();
    async function onFinish (values){
      setLoading(true)
      try{
        const uploadTask = storage.ref(`/projectPlan/${projectChoose.key}/ProjectPlan-${projectChoose.projectCode}.${projectPlanFile.name.split(".")[1]}`).put(projectPlanFile)        
        uploadTask.on('state-change', snapshot => {

        }, () => {

        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url =>{
                database.projects.doc(projectChoose.key).update({
                    projectPlanStatus: "Waiting for Review",
                    projectPlanFile: url
                })
                message.success("Success Upload File")
            })
        })
        // setLoading(false)
        form.resetFields()
      } catch(err){
        message.error("Failed Upload File")
        // setLoading(false)
      }
      setLoading(false)
      setModalUploadPP(false)

    }
    
    return(
    <>
    <Table 
      columns={columns} 
      dataSource={dataProject} 
      size="middle"
      scroll={{ x: 1600, y: 400 }}/>
    <Modal 
      title="Project Plan" 
      visible={modalUploadPP}
      footer={null}
      onCancel={() => setModalUploadPP(false)}
    >
      <Form
          form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
      <Form.Item
        label="File Project Plan"
        name="filePP"
        rules={[
        {
            required: true,
            message: 'Please upload file Project Plan',
        },
        ]}
      >
        <Input type="file" onChange={e => setProjectPlanFile(e.target.files[0])}/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" disabled={loading} htmlType="submit" className="w-100 text-center mt-3">
          Submit
        </Button>
      </Form.Item>
      </Form>
    </Modal>
    </>
    )
}