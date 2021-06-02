import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Alert, Popconfirm, Button } from 'antd'
import formattingSemester from '../../../utility/semesterFormmater'

const { Column, ColumnGroup } = Table

export default function SelectCourse() {
    const [opens, setOpens] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    const confirm = (text, xq) => {
        let data = {
            xq: xq,
            kh: text.kh,
            gh: text.gh
        }
        axios.post('/student/selects', data)
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
        axios.get("/teacher/opens")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map((v, i) => ({ ...v, key: i })))
            .then(value => setOpens(value))
    }, [changed])

    return (
        <>
            {opens.length === 0 ? <h2>当前选课已全部结束</h2> : null}
            {
                opens.map(({ xq, course }) => (
                    <Table dataSource={course} key={xq + "sscourse"}
                        expandable={{
                            rowExpandable: record => record.description != null,
                            expandedRowRender: record => <p style={{ margin: 0 }} key={xq + "ssdescription"}><strong>课程描述：</strong>{record.description}</p>,
                        }}>
                        <ColumnGroup title={formattingSemester(xq)} key={xq + "sssemester"}>
                            <Column dataIndex="kh" title="课程号" key={xq + "sskh"} sorter={(a, b) => a.kh - b.kh} />
                            <Column dataIndex="name" title="课程名" key={xq + "ssname"} sorter={(a, b) => a.name < b.name} />
                            <Column dataIndex="teacherName" title="教师名" key={xq + "ateachername"} />
                            <Column dataIndex="credit" title="学分" key={xq + "sscredit"} sorter={(a, b) => a.credit - b.credit} />
                            <Column dataIndex="num" title="选课人数" key={xq + "ssnum"} sorter={(a, b) => a.num - b.num} />
                            <Column dataIndex="capacity" title="容量" key={xq + "sscapacity"} sorter={(a, b) => a.capacity - b.capacity} />
                            <Column dataIndex="departmentName" title="课程类型" key={xq + "ssdepartment"}
                                render={department => department.replace("学院", "")} />
                            <Column title="操作" key={xq + "ssaction"}
                                render={(text, record) => (
                                    <Popconfirm
                                        title={"确认选择\"" + text.name + "\"吗？"}
                                        onConfirm={() => confirm(text, xq)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button>选择该课</Button>
                                    </Popconfirm>
                                )}
                            />
                        </ColumnGroup>
                    </Table>
                ))
            }
            {err === "" ? null : <Alert message={err} type="error" />}
        </>
    )
}
