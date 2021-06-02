import React, { useContext, useEffect } from 'react'
import { Layout as AntLayout } from 'antd'
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import Header from './header'
import Sidebar from './sidebar'
import './index.css'
import { AuthContext } from '../../App'
import { Redirect } from 'react-router-dom'

const { Content } = AntLayout


export default function Layout(props) {
    const auth = useContext(AuthContext)

    useEffect(() => {
        if (auth.isAuthed) {
            axios.defaults.baseURL = auth.baseUrl
            axios.defaults.headers.common['Authorization'] = 'JWT_TOKEN ' + auth.auth.token
            let token = auth.auth.token
            const refreshAuthLogic = failedRequest => axios.post('/auth/refresh/' + token)
            .then(tokenRefreshResponse => {
                auth.auth.token = tokenRefreshResponse.data.token;
                failedRequest.response.config.headers['Authorization'] = 'JWT_TOKEN ' + tokenRefreshResponse.data.token;
                return Promise.resolve();
            });
            createAuthRefreshInterceptor(axios, refreshAuthLogic);
        }
    }, [auth])

    return (
        <>{
            auth.isAuthed
                ? <AntLayout className="layout">
                    <Header />
                    <AntLayout>
                        <Sidebar />
                        <Content>
                            {props.children}
                        </Content>
                    </AntLayout>
                </AntLayout>
                : <Redirect to="/login" />
        }</>
    )

}
