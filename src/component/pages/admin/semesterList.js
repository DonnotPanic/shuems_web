import axios from 'axios'
import {
    Table, Tag, Radio, Button, Alert,
    Form, DatePicker, Select, Space, Modal
} from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import formattingSemester from '../../../utility/semesterFormmater'

const { Column } = Table
const { Option } = Select

function StatusRadio({ status, xq, setChanged, setErr }) {
    const [disabled, setDisabled] = useState(true)

    const changeStatus = (xq, status) => {
        let obj = {
            xq: xq,
            status: status
        }
        axios.post("/admin/updateSemester", obj)
            .then(res => {
                setDisabled(true)
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }

    const deleteSemester = (xq) => {
        console.log("准备删了你！" + xq)
    }

    return (
        <Space>
            <Radio.Group onChange={e => changeStatus(xq, e.target.value)} defaultValue={status} disabled={disabled}>
                <Radio value={'O'}>开放选课</Radio>
                <Radio value={'C'}>停止选课</Radio>
                <Radio value={'E'}>成绩已发布</Radio>
            </Radio.Group>

            <Button onClick={() => setDisabled(e => !e)}>修改</Button>
            <MinusCircleOutlined onClick={() => deleteSemester(xq)} />
        </Space>
    )
}

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title="新学期"
            okText="创建"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields()
                        onCreate(values)
                        return values
                    })
                    .catch((info) => {
                        console.log('创建学期失败:', info)
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="value"
            >
                <Form.Item
                    name="year"
                    label="年份"
                    rules={[
                        {
                            required: true,
                            message: '请选择年份!',
                        },
                    ]}
                >
                    <DatePicker picker="year" placeholder="选择起始年份" />
                </Form.Item>
                <Form.Item
                    name="season"
                    label="季节"
                    rules={[
                        {
                            required: true,
                            message: '请选择季节!',
                        },
                    ]}
                >
                    <Select>
                        <Option value={'AUTUMN'}>
                            秋季学期
                        </Option>
                        <Option value={'WINTER'}>
                            冬季学期
                        </Option>
                        <Option value={'SPRING'}>
                            春季学期
                        </Option>
                        <Option value={'SUMMER'}>
                            夏季学期
                        </Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default function SemesterList() {
    const [visible, setVisible] = useState(false)
    const [list, setList] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    useEffect(() => {
        axios.get("/admin/semesters")
            .then(res => res.data)
            .then(data => data.value)
            .then(data => data.map((v, i) => ({ ...v, key: i })))
            .then(value => setList(value))
    }, [changed])

    const onCreate = (values) => {
        axios.post("/admin/addSemester", values)
            .then(res => {
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
        setVisible(false);
    }

    const statusRedering = (status) => {
        switch (status) {
            case "O":
                return "开放选课"
            case "C":
                return "停止选课"
            case "E":
                return "成绩已发布"
            default:
                return "为啥会有这个状态"
        }
    }
    const getColor = (status) => {
        switch (status) {
            case "O":
                return "blue"
            case "E":
                return "green"
            case "C":
                return "purple"
            default:
                return "red"
        }
    }

    return (
        <>
            <Table dataSource={list}>
                <Column title="学期" dataIndex="xq" key="semester"
                    render={formattingSemester}
                >
                </Column>
                <Column title="状态" dataIndex="status" key="semsterStatus"
                    render={record => (<Tag color={getColor(record)}>{statusRedering(record)}</Tag>)}>
                </Column>
                <Column title="操作" key="semesterAction"
                    render={record => (<StatusRadio status={record.status} xq={record.xq}
                        setChanged={setChanged} setErr={setErr} />)}>
                </Column>
            </Table>
            {err === "" ? null : <Alert message={err} type="error" />}
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                新建学期
            </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </>
    )
}
