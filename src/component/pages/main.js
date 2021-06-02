import React, { useContext, useState } from 'react'
import { AuthContext } from '../../App'
import { Calendar } from 'antd'


export default function Main() {
    const auth = useContext(AuthContext)
    const [date,] = useState(new Date())

    return (
        <>
            <h1>
                欢迎, {auth.auth.name} !
            </h1>
            <br />
            <h3>今天是{date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日</h3>
            <Calendar fullscreen={false} />
        </>
    )
}