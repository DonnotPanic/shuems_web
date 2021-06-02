import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Alert, Popconfirm, Button } from 'antd'
import formattingSemester from '../../../utility/semesterFormmater'

const { Column, ColumnGroup } = Table

export default function EnrolledCourse() {
    const [opens, setOpens] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")


    useEffect(() => {
        axios.get("/student/enrolls")
            .then(res => res.data)
            .then(data => data.value)
            .then(value => value.map((v, i) => ({ ...v, key: i + "e" })))
            .then(value => setOpens(value))
    }, [changed])

    return (
        <>
            {opens.length === 0 ? <h2>你还没有选课哦</h2> : null}
            {
                opens.map(({ xq, course }) => (
                    <Table dataSource={course} key={xq + "ssadcourse"}
                        expandable={{
                            rowExpandable: record => record.description != null,
                            expandedRowRender: record => <p style={{ margin: 0 }} key={xq + "ssdescription"}><strong>课程描述：</strong>{record.description}</p>,
                        }}>
                        <ColumnGroup title={formattingSemester(xq)} key={xq + "sadssemester"}>
                            <Column dataIndex="kh" title="课程号" key={xq + "ssdakh"} sorter={(a, b) => a.kh - b.kh} />
                            <Column dataIndex="name" title="课程名" key={xq + "ssadname"} sorter={(a, b) => a.name < b.name} />
                            <Column dataIndex="teacherName" title="教师名" key={xq + "atdaeachername"} />
                            <Column dataIndex="credit" title="学分" key={xq + "ssdacredit"} sorter={(a, b) => a.credit - b.credit} />
                            <Column dataIndex="num" title="选课人数" key={xq + "ssdanum"} sorter={(a, b) => a.num - b.num} />
                            <Column dataIndex="capacity" title="容量" key={xq + "ssacdapacity"} sorter={(a, b) => a.capacity - b.capacity} />
                            <Column dataIndex="departmentName" title="课程类型" key={xq + "ssaddepartment"}
                                render={department => department.replace("学院", "")} />
                        </ColumnGroup>
                    </Table>
                ))
            }
            {err === "" ? null : <Alert message={err} type="error" />}
        </>
    )
}
