import axios from 'axios'
import { Table, Form, Space, Input, InputNumber, Button, Alert } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'

const { TextArea } = Input

export default function CourseList() {
    const [list, setList] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    const onFinish = (values) => {
        axios.post("/admin/addCourses", values)
            .then(res => {
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }
    const deleteCourse = (course) => {
        axios.post("/admin/deleteCourse", { kh: course.kh })
            .then(res => {
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }

    useEffect(() => {
        console.log("changed")
        axios.get("/teacher/courses")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map((data, index) => ({ key: index, ...data })))
            .then(value => setList(value))
    }, [changed])

    const columns = [
        { title: "课号", dataIndex: "kh", key: "courekh" },
        { title: "课名", dataIndex: "name", key: "courseName" },
        { title: "学分", dataIndex: "credit", key: "courseCredit" },
        {
            title: "平时分占比", dataIndex: "rate", key: "rate",
            render: (rate) => rate + "%"
        },
        { title: "院系", dataIndex: "departmentName", key: "courseyxh" },
        {
            title: "操作", key: "action",
            render: (text) => (<MinusCircleOutlined onClick={() => deleteCourse(text)} />)
        }
    ]

    return (
        <>
            <Table dataSource={list}
                columns={columns}
                expandable={{
                    rowExpandable: record => record.description != null,
                    expandedRowRender: record => <p style={{ margin: 0 }}><strong>课程描述：</strong>{record.description}</p>,
                }}
            />
            {err === "" ? null : <Alert message={err} type="error" />}
            <Form name="批量添加课程" onFinish={onFinish}>
                <Form.List name="value">
                    {(fields, { add, remove }) =>
                    (<>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'kh']}
                                    fieldKey={[fieldKey, 'kh']}
                                    rules={[{ required: true, message: '请填入课程号' }]}
                                >
                                    <Input placeholder="课程号" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    fieldKey={[fieldKey, 'name']}
                                    rules={[{ required: true, message: '请填入课程名' }]}
                                >

                                    <Input placeholder="课程名" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'credit']}
                                    fieldKey={[fieldKey, 'credit']}
                                    rules={[{ required: true, message: '请输入学分' }]}
                                >
                                    <InputNumber min={0} max={30} placeholder="学分"
                                        parser={value => value | 0}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'rate']}
                                    fieldKey={[fieldKey, 'rate']}
                                    rules={[{ required: true, message: '请填入平时分占比' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                        placeholder="" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'yxh']}
                                    fieldKey={[fieldKey, 'yxh']}
                                    rules={[{ required: true, message: "请输入院系号" }]}
                                >
                                    <Input placeholder="院系号" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'description']}
                                    fieldKey={[fieldKey, 'description']}
                                    rules={[{ required: false }]}
                                >
                                    <TextArea showCount maxLength={50} rows={2} placeholder="课程描述" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加课程
                            </Button>
                        </Form.Item>
                    </>)
                    }
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
