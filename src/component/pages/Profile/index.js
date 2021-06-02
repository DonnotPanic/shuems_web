import React, { useState, useEffect } from 'react'
import { Descriptions } from 'antd'
import axios from 'axios'

export default function Profile() {
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [tel, setTel] = useState("")
    const [role, setRole] = useState("")
    const [department, setDepartment] = useState("")

    useEffect(() => {
        axios.get('/common/profile')
            .then(res => res.data)
            .then(data => {
                let gender = data.gender === "MALE" ? "男" : "女"
                setGender(gender)
                setName(data.name)
                setTel(data.tel)
                setRole(data.role)
                if (data.departmentName)
                    setDepartment(data.departmentName)
            })
    }, [])

    return (
        <Descriptions title="用户信息" bordered>
            <Descriptions.Item label="姓名">{name}</Descriptions.Item>
            <Descriptions.Item label="电话">{tel ? tel : "未知"}</Descriptions.Item>
            <Descriptions.Item label="性别">{gender}</Descriptions.Item>
            <Descriptions.Item label="身份">{role}</Descriptions.Item>
            {department === "" ? null :
                <Descriptions.Item label="院系">{department}</Descriptions.Item>
            }
        </Descriptions>
    )
}