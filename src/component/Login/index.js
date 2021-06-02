import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router';
import axios from 'axios'
import { Form, Input, Button, Checkbox, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../../App'

import './index.css'

const { Option } = Select

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
};

export default function Login() {
    const auth = useContext(AuthContext)
    const [isAuthed, setIsAuthed] = useState(auth.isAuthed)

    const onFinish = (values) => {
        axios.post(auth.baseUrl + "/auth/login", values)
            .then(res => res.data)
            .then(data => auth.login(data))
            .then(() => console.log(auth.auth))
            .then(() => setIsAuthed(auth.isAuthed))
    }

    return (
        <>{
            isAuthed
                ? <Redirect to="/" />
                : <div className="layout login">
                    <Form
                        className="login-form"
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '输入你的用户名' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '输入你的密码' }]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
                        </Form.Item>

                        <Form.Item
                            label="身份"
                            name="role"
                            rules={[{ required: true, message: '请选择你的身份' }]}>
                            <Select
                                placeholder='选择你的身份'
                                allowClear
                            >
                                <Option value="teacher">教师</Option>
                                <Option value="student">学生</Option>
                                <Option value="admin">管理员</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">

                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout} name="submit" valuePropName="checked">
                            <Button type="primary" htmlType="submit" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
        }</>
    )
}
