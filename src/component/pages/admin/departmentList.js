import axios from 'axios'
import { Table, Form, Space, Input, Button, Alert } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'

const { Column } = Table

export default function DepartmentList() {
    const [list, setList] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    const onFinish = (values) => {
        axios.post("/admin/addDepartments", values)
            .then(res => {
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }
    const deleteDepartment = (department) => {
        axios.post("/admin/deleteDepartment", { yxh: department.yxh })
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
        axios.get("/common/departments")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map((data, index) => ({ ...data, key: index })))
            .then(value => setList(value))
    }, [changed])

    return (
        <>
            <Table dataSource={list}>
                <Column title="院系号" dataIndex="yxh" key="departmentyxh" />
                <Column title="院系名" dataIndex="name" key="departmentName" />
                <Column title="地址" dataIndex="addr" key="addr" />
                <Column title="联系方式" dataIndex="tel" key="departmenttel" />
                <Column title="操作" key="action"
                    render={(text, record) => (
                        <MinusCircleOutlined onClick={() => deleteDepartment(text)} />
                    )}
                />
            </Table>
            {err === "" ? null : <Alert message={err} type="error" />}
            <Form name="批量添加院系" onFinish={onFinish}>
                <Form.List name="value">
                    {(fields, { add, remove }) =>
                    (<>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'yxh']}
                                    fieldKey={[fieldKey, 'yxh']}
                                    rules={[{ required: true, message: '请填入院系号' }]}
                                >
                                    <Input placeholder="院系号" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    fieldKey={[fieldKey, 'name']}
                                    rules={[{ required: true, message: '请填入院系名' }]}
                                >

                                    <Input placeholder="院系名" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'addr']}
                                    fieldKey={[fieldKey, 'addr']}
                                    rules={[{ required: true, message: '请填入院系地址' }]}
                                >

                                    <Input placeholder="院系地址" />
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
                                    name={[name, 'tel']}
                                    fieldKey={[fieldKey, 'tel']}
                                    rules={[{ required: false }]}
                                >
                                    <Input placeholder="联系方式" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加院系
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
