import React, {Component} from 'react'
import {NotificationContainer} from 'react-notifications'
import {BounceLoader, ClipLoader} from 'react-spinners'
import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './Components/Login'
import Header from './Components/Header'
import Doctor from './Components/Doctor'
import Nurse from './Components/Nurse'
import Sidebar from './Components/Sidebar'
import Fluent from './Components/Fluent'

class App extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            sideOpen: false,
            loading: true,
            redirect: false,
            user: {},
            disease: {},
            sidebar: false,
        }
        this.handleLoading = this.handleLoading.bind(this)
        this.setUser = this.setUser.bind(this)
        this.setDisease = this.setDisease.bind(this)
        this.logOut = this.logOut.bind(this)
        this.showSidebar = this.showSidebar.bind(this)
        this.hideSidebar = this.hideSidebar.bind(this)
    }

    componentDidMount()
    {
        if (localStorage.getItem('phone') && localStorage.getItem('password'))
        {
            const phone = localStorage.getItem('phone')
            const password = localStorage.getItem('password')

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
                    console.log(resJson.log)
                    if (resJson.state === 1)
                    {
                        this.setState({...this.state, redirect: false}, () =>
                        {
                            if (window.location.pathname)
                            {
                                const array = window.location.pathname.split('/')
                                console.log(array)
                                if (array[1] === 'login')
                                {
                                    this.setState({...this.state, loading: false}, () => this.setUser(resJson.form))
                                }
                                else this.setUser(resJson.form)
                            }
                            else this.setUser(resJson.form)
                        })
                    }
                    else
                    {
                        this.setState({...this.state, loading: false, redirect: true})
                    }
                })
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, loading: false, redirect: true})
                })
        }
        else
        {
            this.setState({...this.state, loading: false, redirect: true})
        }
    }

    setUser(user)
    {
        return new Promise((resolve) =>
        {
            this.setState({...this.state, user, redirect: false}, () => resolve())
        })
    }

    setDisease(disease)
    {
        return new Promise((resolve) =>
        {
            this.setState({...this.state, disease}, () => resolve())
        })
    }

    handleLoading(bool)
    {
        return new Promise((resolve) =>
        {
            this.setState({...this.state, loading: bool}, () => resolve())
        })
    }

    logOut()
    {
        this.setState({...this.state, sidebar: false, user: {}, redirect: true}, () =>
        {
            localStorage.setItem('phone', null)
            localStorage.setItem('password', null)
        })
    }

    showSidebar()
    {
        this.setState({...this.state, sidebar: true})
    }


    hideSidebar()
    {
        if (this.state.sidebar)
            this.setState({...this.state, sidebar: false})
    }

    render()
    {
        return (
            <div>

                {
                    this.state.redirect ?
                        <Redirect to='/login'/>
                        :
                        null
                }

                <Switch>
                    <Route exact path='/Login' render={() =>
                        <div /*style={{textAlign: 'center', margin: '20px auto'}}*/>
                            {/*<Fluent backgroundColor='#ffffff' className={'shit'}>*/}
                                {/*<div style={{padding: '15px', display: 'inline-block'}}>*/}
                                    {/*Hello*/}
                                {/*</div>*/}
                            {/*</Fluent>*/}
                            <Header user={null}/>
                            <Login handleLoading={this.handleLoading} setUser={this.setUser} />
                        </div>

                    }/>

                    <Route path='*' render={() =>
                        <React.Fragment>

                            <Header user={this.state.user}
                                    disease={this.state.disease}
                                    logOut={this.logOut}
                                    showSidebar={this.showSidebar}
                            />

                            <Sidebar sidebar={this.state.sidebar}
                                     user={this.state.user}
                                     disease={this.state.disease}
                                     logOut={this.logOut}
                            />

                            <main ref={e => this.main = e} className='main' /*onClick={this.handleCollapseMain}*/>
                                <Switch>

                                    <Route path='*' render={() =>
                                        this.state.user && this.state.user.role && this.state.user.role === 'DOCTOR' ?
                                            <Doctor sidebar={this.state.sidebar}
                                                    user={this.state.user}
                                                    setDisease={this.setDisease}
                                                    handleLoading={this.handleLoading}
                                            />
                                            :
                                            this.state.user && this.state.user.role && this.state.user.role === 'NURSE' ?
                                                <Nurse sidebar={this.state.sidebar}
                                                       user={this.state.user}
                                                       setDisease={this.setDisease}
                                                       handleLoading={this.handleLoading}
                                                />
                                                :
                                                <div className='waiting-loading'>
                                                    <ClipLoader/>
                                                </div>
                                    }/>

                                </Switch>
                            </main>

                        </React.Fragment>
                    }/>
                </Switch>

                <div className={this.state.sidebar ? 'sidebar-modal-cont' : 'sidebar-modal-cont-hide'} onClick={this.hideSidebar}/>

                <div className={this.state.loading ? 'modal-loading' : 'modal-hide'}>
                    <BounceLoader size={100} color='white'/>
                </div>

                <NotificationContainer/>

            </div>
        )
    }
}

export default App
