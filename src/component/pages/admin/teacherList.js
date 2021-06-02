import axios from 'axios'
import { Table, Form, Space, Input, Button, Select, DatePicker, Alert } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'

const { Column } = Table
const { Option } = Select

export default function TeacherList() {
    const [list, setList] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    const onFinish = (values) => {
        axios.post("/admin/addTeachers", values)
            .then(res => {
                setChanged(e => !e)
                if(res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }
    const deleteTeacher = (teacher) => {
        axios.post("/admin/deleteTeacher", { gh: teacher.gh })
            .then(res => {
                setChanged(e => !e)
                if(res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }

    useEffect(() => {
        axios.get("/admin/teachers")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => setList(value))
    }, [changed])

    return (
        <>
            <Table dataSource={list}>
                <Column title="工号" dataIndex="gh" key="gh" />
                <Column title="姓名" dataIndex="name" key="teacherName" />
                <Column title="出生日期" dataIndex="birth" key="teacherBirth" />
                <Column title="性别" dataIndex="gender" key="teacherGender"
                    render={gender => (
                        <>
                            {gender === "MALE" ? '男' : '女'}
                        </>
                    )}
                />
                <Column title="手机号" dataIndex="tel" key="teacherTel"
                    render={tel => (
                        <>
                            {tel ? tel : '未知'}
                        </>
                    )}
                />
                <Column title="籍贯" dataIndex="jg" key="jg" />
                <Column title="职称" dataIndex="title" key="teacherTitle" />
                <Column title="院系" dataIndex="departmentName" key="yxh" />
                <Column title="操作" key="action"
                    render={(text, record) => (
                        <MinusCircleOutlined onClick={() => deleteTeacher(text)} />
                    )}
                />
            </Table>
            {err === "" ? null : <Alert message={err} type="error" />}
            <Form name="批量添加教师" onFinish={onFinish}>
                <Form.List name="value">
                    {(fields, { add, remove }) =>
                    (<>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'gh']}
                                    fieldKey={[fieldKey, 'gh']}
                                    rules={[{ required: true, message: '请填入教师工号' }]}
                                >
                                    <Input placeholder="工号" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    fieldKey={[fieldKey, 'name']}
                                    rules={[{ required: true, message: '请填入姓名' }]}
                                >

                                    <Input placeholder="姓名" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'gender']}
                                    fieldKey={[fieldKey, 'gender']}
                                    rules={[{ required: true, message: '请选择性别' }]}
                                >
                                    <Select>
                                        <Option value="MALE">男</Option>
                                        <Option value="FEMALE">女</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'birth']}
                                    fieldKey={[fieldKey, 'birth']}
                                    rules={[{ required: true, message: '请选择出生日期' }]}
                                >
                                    <DatePicker placeholder="出生日期" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'jg']}
                                    fieldKey={[fieldKey, 'jg']}
                                    rules={[{ required: true, message: '请填入籍贯' }]}
                                >
                                    <Input placeholder="籍贯" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'tel']}
                                    fieldKey={[fieldKey, 'tel']}
                                    rules={[{ required: false, message: '请填入手机号' }]}
                                >
                                    <Input placeholder="手机号" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'title']}
                                    fieldKey={[fieldKey, 'title']}
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                        <Option value="助教">助教</Option>
                                        <Option value="讲师">讲师</Option>
                                        <Option value="副教授">副教授</Option>
                                        <Option value="教授">教授</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'yxh']}
                                    fieldKey={[fieldKey, 'yxh']}
                                    rules={[{ required: true, message: "请输入院系号" }]}
                                >
                                    <Input placeholder="院系号" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加教师
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
