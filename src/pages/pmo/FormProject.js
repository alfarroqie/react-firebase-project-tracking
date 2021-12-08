import React, { useState, useEffect } from "react"
// import { Link, Navigate } from "react-router-dom"
import {Form, Button, Card, Input, DatePicker, Select, Alert} from "antd"
import { database } from '../../authConfig/firebase';

export default function FormProject() {
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [dataPM, setDataPM] = useState([])

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

    const [form] = Form.useForm();
    const configDate = {
        rules: [
          {
            type: 'object',
            required: true,
            message: 'Please select date!',
          },
        ],
    };

    async function onFinish(values){
        setLoading(true)
        try{
            database.projects.add({
                "codeProject": values.codeProject,
                "customer": values.customer,
                "contractNumber": values.contractNumber,
                "startDate": values['startDate'].format('YYYY-MM-DD'),
                "endDate": values['endDate'].format('YYYY-MM-DD'),
                "projectManager": values.pm,
                "projectStatus": "Waiting for Submit Project Plan"
            })
        form.resetFields()
        setLoading(false)
        } catch(err){
            setError("Failed add to database")
            setLoading(false)
        }
        // const dataEmail = {
        //     to_email: values.pm,
        //     message: "You assign in new project. Please check the project tracker app. Thank you"
        // }
        // emailjs.send('sendinblue-project', 'newproject', dataEmail, 'user_27mG3zOgCiCICTmjLrhCY')
        //   .then(function(response) {
        //     console.log('SUCCESS!', response.status, response.text);
        //   }, function(error) {
        //     console.log('FAILED...', error);
        // });
        // setLoading(false)
    };

    return (
      <>
      <div className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "50vh" }}>
          <Card title="Create Project" bordered={true} style={{ width: "600px" }} >
              {error && <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
            />
            }
            <Form
                form={form}
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Code Project"
                    name="codeProject"
                    rules={[
                    {
                        required: true,
                        message: 'Please input code project!',
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
                <Form.Item name="startDate" label="Start Date" {...configDate}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="endDate" label="End Date" {...configDate}>
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Select PM"
                    name="pm"
                    rules={[
                    {
                        required: true,
                        message: 'Please select PM',
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
                    <Button disabled={loading} type="primary" htmlType="submit" className="w-100 text-center mt-3">
                    Submit
                    </Button>
                </Form.Item>
            </Form>
          </Card>
      </div>
      </>
    )
}