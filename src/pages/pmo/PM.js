import React, {useState, useEffect} from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';

import { database } from '../../authConfig/firebase';
import { useAuth } from '../../authConfig/AuthContext';

export default function DashboardPMO() {
  const [dataPM, setDataPM] = useState()
  const [modalAddPM, setModalAddPM] = useState(false)
  const {signup} = useAuth()
  //Data Project
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
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    ]

    const [form] = Form.useForm();

    async function onFinish(values){
      const passDefeault = "123456"
      try {
        await signup(values.email, passDefeault, values.name, false)
        message.success("Success Add PM")
      } catch(err) {
        message.error("Failed add PM")
      }
      form.resetFields()
      setModalAddPM(false)
    }

    return(
    <>
      {/* <Button type="primary" shape="round" onClick={() => setModalAddPM(true)}> Add PM User </Button> */}
      <Table 
        columns={columns} 
        dataSource={dataPM} 
        size="middle"
        bordered
        title={() => <Button type="primary" shape="round" onClick={() => setModalAddPM(true)}> Add PM User </Button>}
      />
      <Modal 
      title="Add Project Manager" 
      visible={modalAddPM}
      footer={null}
      onCancel={() => setModalAddPM(false)}
      >
        <Form
          form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                {
                    required: true,
                    message: 'Please input Name!',
                },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                {
                    required: true,
                    message: 'Please input email',
                },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-100 text-center mt-3">
                Add Project Manager
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </>
    )
}