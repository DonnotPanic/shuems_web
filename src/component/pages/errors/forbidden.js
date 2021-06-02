import React from 'react'
import { Result, Button } from 'antd'
import { Link } from 'react-router-dom'

function BackHome() {
    return (
        <Button type="primary">
            <Link to="/">
                返回首页
            </Link>
        </Button>
    )
}

export default function Forbidden() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="抱歉, 你在找的页面不存在。"
            extra={<BackHome/>}
        />
    )
}
