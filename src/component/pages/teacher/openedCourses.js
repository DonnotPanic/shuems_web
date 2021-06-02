import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Alert } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons';
import formattingSemester from '../../../utility/semesterFormmater'

const { Column, ColumnGroup } = Table

export default function OpenedCourses() {
    const [opens, setOpens] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    const deleteCourse = (text, xq) => {
        let data = {
            kh: text.kh,
            xq: xq
        }
        axios.post("/teacher/deleteOpenCourse", data)
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
            {
                opens.map(({ xq, course }) => (
                    <Table dataSource={course} key={xq + "course"}
                        expandable={{
                            rowExpandable: record => record.description != null,
                            expandedRowRender: record => <p style={{ margin: 0 }} key={xq + "description"}><strong>课程描述：</strong>{record.description}</p>,
                        }}>
                        <ColumnGroup title={formattingSemester(xq)} key={xq + "semester"}>
                            <Column dataIndex="kh" title="课程号" key={xq + "kh"} />
                            <Column dataIndex="name" title="课程名" key={xq + "name"} />
                            <Column dataIndex="credit" title="学分" key={xq + "credit"} />
                            <Column dataIndex="rate" title="平时分占比" key={xq + "rate"}
                                render={rate => rate + "%"} />
                            <Column dataIndex="num" title="选课人数" key={xq + "num"} />
                            <Column dataIndex="capacity" title="容量" key={xq + "capacity"} />
                            <Column dataIndex="departmentName" title="课程类型" key={xq + "department"}
                                render={department => department.replace("学院", "")} />
                            <Column title="操作" key={xq + "action"}
                                render={(text, record) => (
                                    <MinusCircleOutlined onClick={() => deleteCourse(text, xq)} />
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
