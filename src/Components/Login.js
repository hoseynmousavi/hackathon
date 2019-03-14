import React, {Component} from 'react'
import MaterialInput from './MaterialInput'
import Material from './Material'
import {Redirect} from 'react-router-dom'
import {NotificationManager} from 'react-notifications'
import Fluent from './Fluent'

class Login extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            login: null,
            phone: '',
            password: '',
        }
    }

    login = () =>
    {
        setTimeout(() =>
        {
            if (this.state.phone.trim().length === 11 && this.state.password.trim().length > 0)
            {
                this.props.handleLoading(true).then(() =>
                {
                    const phone = this.state.phone.trim()
                    const password = this.state.password.trim().toLowerCase()

                    fetch('https://restful.taravat.info/user/login', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                        },
                        body: JSON.stringify({
                            phone_number: phone,
                            password,
                        }),
                    })
                        .then((res) => res.json())
                        .then((resJson) =>
                        {
                            if (resJson.state === 1)
                            {
                                this.setState({...this.state, login: true}, () =>
                                {
                                    this.generate(resJson.form.id)
                                    localStorage.setItem('phone', phone)
                                    localStorage.setItem('password', password)
                                    localStorage.setItem('id', resJson.form.id)
                                    this.props.setUser({...resJson.form})
                                })
                            }
                            else
                            {
                                this.props.handleLoading(false).then(() =>
                                {
                                    NotificationManager.error('اطلاعات ورودی اشتباه است.')
                                })
                            }
                        })
                        .catch(() =>
                        {
                            this.props.handleLoading(false).then(() =>
                            {
                                NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
                            })
                        })
                })

            }
            else if (this.state.phone.trim().length !== 11)
            {
                NotificationManager.warning('شماره تلفن وارد شده معتبر نیست!')
            }
            else
            {
                NotificationManager.warning('پسورد وارد شده معتبر نیست!')
            }
        }, 400)
    }

    generate(id)
    {
        return new Promise((resolve) =>
        {
            if ('serviceWorker' in navigator)
            {
                this.send(id)
                    .then(() => resolve())
                    .catch((err) =>
                    {
                        console.log(err)
                        this.generate(id)
                    })
            }
        })
    }

    async send(id)
    {
        const publicKey = 'BPQtd5tdIouNFyB-asHG7CmK327gHipTwayycNJgK6z-w_dCG6FRBRrNSidmurfQgA9WReKfk9xI5fcc9ypfy28'
        const register = await navigator.serviceWorker.register('./worker.js', {scope: '/'})
        console.log('here')
        const subscription = await register.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: this.urlBase64ToUint8Array(publicKey)})
        console.log(subscription)
        await fetch('https://restful.taravat.info/user/set_token', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                token: subscription,
                personnel_id: id,
            }),
        })
            .then(() => console.log('generated'))
            .catch(err => console.log(err))
    }

    urlBase64ToUint8Array(base64String)
    {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)
        for (let i = 0; i < rawData.length; ++i)
        {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }


    redirectToHome()
    {
        if (this.state.login === true)
            return <Redirect to='/'/>
    }

    handlePhone = (value) =>
    {
        this.setState({...this.state, phone: value})
    }

    handlePassword = (value) =>
    {
        this.setState({...this.state, password: value})
    }

    handleEnter = (e) =>
    {
        if (e.keyCode === 13)
            this.login()
    }

    render()
    {
        return (
            <div className='login-form'>
                {
                    this.redirectToHome()
                }
                <div className='login-form-title'>ورود</div>
                <MaterialInput getValue={this.handlePhone} onKeyDown={this.handleEnter} maxLength={11} type='text' label='شماره تلفن' className='login-input' backgroundColor='#f9faff'/>
                <MaterialInput getValue={this.handlePassword} onKeyDown={this.handleEnter} type='password' label='رمز عبور' className='login-input' backgroundColor='#f9faff'/>
                <Fluent backgroundColor='#F9FAFF' className='login-fluent'>
                    <Material backgroundColor='rgba(241,242,247,0.6)' className='login-form-submit' onClick={this.login}>ورود</Material>
                </Fluent>
            </div>
        )
    }
}

export default Login