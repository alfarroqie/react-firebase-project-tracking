import React, { useState } from "react"
// import { useAuth } from "../../context/AuthContext"
import { Link, Navigate } from "react-router-dom"
import {Form, Button, Input, Card, Alert} from "antd"

import { useAuth } from "../authConfig/AuthContext";

export default function Login() {
    const {currentUser, login} = useAuth()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    async function onFinish(values){
      try{
        setLoading(true)
        await login(values.email, values.password)
      } catch (err) {
        setError("Please check email and username")
        setLoading(false)
      }
    };
  if (currentUser && currentUser.userData.isPmo){
    return (
      <Navigate to="/pmo" />
    )
  } else if (currentUser && !currentUser.userData.isPmo) {
    return (
      <Navigate to="/pm" />
    )
  } else if (!currentUser) {
    return (
      <>
      <div className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
        <Card title="Login" className="text-center mb-4" bordered={true} style={{ width: "400px" }} >
        {error && <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        }
        <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                {
                    required: true,
                    message: 'Please input your username!',
                },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button disabled={loading} type="primary" htmlType="submit" className="w-100 text-center mt-3">
                Submit
                </Button>
            </Form.Item>
        </Form>
        <Link to="/forgot-password">Forgot Password?</Link>
        </Card>
      </div>
      </>
    )
  }
}