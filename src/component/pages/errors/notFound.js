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

export default function NotFound() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="抱歉, 你在找的页面不存在。"
            extra={<BackHome/>}
        />
    )
}
