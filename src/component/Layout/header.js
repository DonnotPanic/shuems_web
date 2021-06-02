import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Layout as AntLayout, Menu } from 'antd'
import { AuthContext } from '../../App'

const AntHeader = AntLayout.Header
const { SubMenu } = Menu

export default function Header() {

    const auth = useContext(AuthContext)

    return (
        <AntHeader className="header">
            <div className="logo" />
            <div className="title">
                上海大学教务管理系统
            </div>
            <Menu className="nav" theme="dark" mode="horizontal">
                <SubMenu key="1" title="个人中心">
                    <Menu.Item key="setting:1">
                        <Link to="/profile">
                            个人信息
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:2">
                        <Link to="/profile/changePassword">
                            修改密码
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="2">
                    <Link to="/login" onClick={() => auth.logout()}>
                        退出登录
                    </Link>
                </Menu.Item>
            </Menu>
        </AntHeader>
    )
}
