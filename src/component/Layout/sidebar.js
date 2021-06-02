import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Layout as AntLayout, Menu } from 'antd'
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons'
import { AuthContext } from '../../App'

const { SubMenu } = Menu
const AntSidebar = AntLayout.Sider

function AdminSidebar() {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['0']}
            style={{ height: '100%', borderRight: 0 }}
        >
            <Menu.Item key="0">
                <Link to="/">
                    首页
                </Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="教务管理">
                <Menu.Item key="11">
                    <Link to="/admin/departments">
                        学院管理
                    </Link>
                </Menu.Item>
                <Menu.Item key="13">
                    <Link to="/admin/teachers">
                        教师管理
                    </Link>
                </Menu.Item>

                <Menu.Item key="12">
                    <Link to="/admin/students">
                        学生管理
                    </Link>
                </Menu.Item>

            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="课程管理">
                <Menu.Item key="21">
                    <Link to="/admin/courses">
                        课程录入
                    </Link>
                </Menu.Item>
                <Menu.Item key="22">
                    <Link to="/admin/opens">
                        开课管理
                    </Link>
                </Menu.Item>
                <Menu.Item key="23">扩选管理</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="学期管理">
                <Menu.Item key="31">
                    <Link to="/admin/semesters">
                        选课管理
                    </Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    )
}

function TeacherSidebar() {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['0']}
            style={{ height: '100%', borderRight: 0 }}
        >
            <Menu.Item key="0">
                <Link to="/">
                    首页
                </Link>
            </Menu.Item>
            <SubMenu key="tsub1" icon={<UserOutlined />} title="成绩管理">
                <Menu.Item key="t11">
                    <Link to="/teacher/statics">
                        成绩分布
                    </Link>
                </Menu.Item>
                <Menu.Item key="t12">
                    <Link to="/teacher/grades">
                        成绩登录
                    </Link>
                </Menu.Item>

            </SubMenu>
            <SubMenu key="tsub2" icon={<LaptopOutlined />} title="课程管理">
                <Menu.Item key="t21">
                    <Link to="/teacher/openCourse">
                        查看开课
                    </Link>
                </Menu.Item>
                <Menu.Item key="t22">
                    <Link to="/teacher/courses">
                        开设课程
                    </Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    )
}

function StudentSidebar() {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['0']}
            style={{ height: '100%', borderRight: 0 }}
        >
            <Menu.Item key="0">
                <Link to="/">
                    首页
                </Link>
            </Menu.Item>
            <SubMenu key="ssub1" icon={<UserOutlined />} title="成绩管理">
                <Menu.Item key="s11">
                    <Link to="/student/statics">
                        成绩分布
                    </Link>
                </Menu.Item>
                <Menu.Item key="s12">
                    <Link to="/student/grades">
                        成绩查询
                    </Link>
                </Menu.Item>

            </SubMenu>
            <SubMenu key="ssub2" icon={<LaptopOutlined />} title="课程管理">
                <Menu.Item key="s21">
                    <Link to="/student/selectCourse">
                        待选课程
                    </Link>
                </Menu.Item>
                <Menu.Item key="s22">
                    <Link to="/student/selectedCourses">
                        已选课程
                    </Link>
                </Menu.Item>
                <Menu.Item key="s23">
                    <Link to="/student/currentCourses">
                        本学期课程
                    </Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    )
}

export default function Sidebar() {
    const auth = useContext(AuthContext)
    const role = auth.auth.role
    return (
        <AntSidebar>
            {role === "ADMIN" ? <AdminSidebar /> : null}
            {role === "TEACHER" ? <TeacherSidebar /> : null}
            {role === "STUDENT" ? <StudentSidebar /> : null}
        </AntSidebar>
    )
}
