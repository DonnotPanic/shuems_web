import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';
import { Form, Button, Input, Alert } from 'antd';

export default function ChangePassword() {
    const [success, setSuccess] = useState(false)
    const [err, setErr] = useState("")
    const formItemLayout = {
        labelCol: {
            xs: { span: 12 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 12 },
            sm: { span: 8 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 12,
                offset: 0,
            },
            sm: {
                span: 8,
                offset: 4,
            },
        },
    };

    const onFinish = (values) => {
        axios.post("/common/changePassword", values)
            .then(res => {
                if (res.status === 200) {
                    setSuccess(true)
                } else {
                    setErr(res.data)
                }
            })
    }

    return (
        <>
            {success ? <Redirect to="/" /> : null}
            <h1>修改密码</h1>
            <br />
            <Form
                {...formItemLayout}
                name="修改密码"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="oldPassword"
                    label="旧密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入旧密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认新密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
            {err === "" ? null : <Alert message={err} type="error" />}
        </>
    )
}
