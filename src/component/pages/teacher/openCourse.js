import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Alert, Button, Modal, Form, Input, Select, InputNumber } from 'antd'
import formattingSemester from '../../../utility/semesterFormmater'

const { Option } = Select

export default function OpenCourse() {

    const [err, setErr] = useState("")
    const [list, setList] = useState([])
    const [changed, setChanged] = useState(false)
    const [semesters, setSemesters] = useState([])
    const [targetCourse, setTargetCoure] = useState({ name: "" })
    const [availableSemesters, setAvailableSemesters] = useState([])
    const [visible, setVisible] = useState(false)
    const [opens,] = useState(new Map())
    const [form] = Form.useForm();

    const prepOpenCourse = (course) => {
        setTargetCoure(course)
        setAvailableSemesters(getAvailableSemesters(course))
        setVisible(true)

    }

    const openCourse = (values) => {
        let data = {
            kh: targetCourse.kh,
            ...values
        }
        axios.post("/teacher/openCourse", data)
            .then(res => {
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
        setVisible(false)
    }

    const getAvailableSemesters = (text) => {
        let available = []
        semesters.forEach(semester => {
            let courseIds = opens[semester]
            if (!courseIds || !courseIds.includes(text.kh)) {
                available.push(semester)
            }
        })
        return available
    }

    const checkAvailable = (text) => {
        return (getAvailableSemesters(text).length !== 0)
    }

    useEffect(() => {
        axios.get("/common/openSemesters")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map(semster => semster.xq))
            .then(value => setSemesters(value))
        axios.get("/teacher/opens")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map(v => ({ xq: v.xq, courseIds: v.course.map(c => c.kh) })))
            .then(value => value.forEach(({ xq, courseIds }) => opens[xq] = courseIds))
        axios.get("/teacher/courses")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map((data, index) => ({ key: index, ...data })))
            .then(value => setList(value))
    }, [changed, opens])

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
            render: (text) => (
                <Button onClick={() => prepOpenCourse(text)}
                    disabled={!checkAvailable(text)}
                >
                    {checkAvailable(text) ? "" : "已"}开课
                </Button>)
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
            <Modal visible={visible}
                title="开设课程"
                okText="确认"
                cancelText="取消"
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            openCourse(values);
                        })
                }}
                onCancel={() => setVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="value"
                    initialValues={{
                        course: targetCourse.name
                    }}
                >
                    <Form.Item
                        name="course"
                        label="开设课程"
                        rules={[{ required: true }]}
                    >
                        <Input disabled bordered={false} />
                    </Form.Item>
                    <Form.Item
                        name="xq"
                        label="开设学期"
                        rules={[{ required: true, message: "请选择开设学期" }]}
                    >
                        <Select>
                            {availableSemesters.map(item =>
                            (<Option
                                value={item}
                                key={item}
                            >
                                {formattingSemester(item)}
                            </Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="capacity"
                        label="课程容量"
                        rules={[{ required: true, message: "请填写课程容量" }]}
                    >
                        <InputNumber min={1} max={200} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
