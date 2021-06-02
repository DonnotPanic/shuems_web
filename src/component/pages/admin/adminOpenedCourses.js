import React, { useRef, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Form, Input, Table, Alert } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons';
import formattingSemester from '../../../utility/semesterFormmater';

import './adminOpenedCourses.css'

const { Column, ColumnGroup } = Table

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('存储失败:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `请输入${title}`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};


export default function AdminOpenedCourses() {
    const [list, setList] = useState([])
    const [changed, setChanged] = useState(false)
    const [err, setErr] = useState("")

    const deleteCourse = (text, xq) => {
        let data = {
            xq: xq,
            kh: text.kh
        }
        axios.post("/admin/deleteOpenCourse/" + text.gh, data)
            .then(res => {
                setChanged(e => !e)
                if (res.status === 200) {
                    setErr("")
                }
                return res
            })
            .catch(error => setErr(error.response.data))
    }


    const handleSave = (xq) => (row) => {
        let data = {
            xq: xq,
            kh: row.kh,
            gh: row.gh,
            courseTime: row.courseTime
        }
        axios.post("/admin/setCourseTime", data)
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
            .then(value => setList(value))
    }, [changed])

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    }
    return (
        <>{
            list.map(({ xq, course }) => (
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={course}
                    key={xq + "adminopen"}
                >
                    <ColumnGroup title={formattingSemester(xq)} key={xq + "asemester"}>
                        <Column dataIndex="kh" title="课程号" key={xq + "akh"} />
                        <Column dataIndex="name" title="课程名" key={xq + "aname"} />
                        <Column dataIndex="teacherName" title="教师名" key={xq + "ateachername"} />
                        <Column dataIndex="num" title="选课人数" key={xq + "anum"} />
                        <Column dataIndex="capacity" title="容量" key={xq + "acapacity"} />
                        <Column dataIndex="courseTime" title="课程时间" key={xq + "acourseTime"}
                            onCell={(record) => ({
                                record, editable: true, dataIndex: "courseTime",
                                title: "课程时间", handleSave: handleSave(xq),
                            })}
                            render={(record) => record ? record : "未指定"}
                        />
                        <Column dataIndex="departmentName" title="课程类型" key={xq + "adepartment"}
                            render={department => department.replace("学院", "")} />
                        <Column title="操作" key={xq + "aaction"}
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
