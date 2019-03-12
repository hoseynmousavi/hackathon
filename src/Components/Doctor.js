import React, {Component} from 'react'
import {NotificationManager} from 'react-notifications'
import Material from './Material'
import {Switch, Route, Link} from 'react-router-dom'
import Reception from './Reception'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

class Doctor extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            disease: {},
            reception: {},
            patients: {},
            bed: {},
            prescription: {},
            personnel: {},
            progress: {},
            report: {},
        }
        this.getData = this.getData.bind(this)
        this.getPrescription = this.getPrescription.bind(this)
        this.getProgress = this.getProgress.bind(this)
        this.setIsDone = this.setIsDone.bind(this)
    }

    componentDidMount()
    {
        this.getData()
    }

    getProgress(id)
    {
        fetch(`https://restful.taravat.info/progress/${id}`, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then((res) => res.json())
            .then((resJson) =>
            {
                console.log(resJson)
                if (resJson.state === 1)
                {
                    this.props.handleLoading(false).then(() =>
                    {
                        let progress = {...this.state.progress}
                        progress[resJson.form.id] = resJson.form
                        this.setState({...this.state, progress})
                    })
                }
                else
                {
                    this.props.handleLoading(false).then(() =>
                    {
                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد.')
                    })
                }
            })
            .catch((err) =>
            {
                console.log(err)
                this.props.handleLoading(false).then(() =>
                {
                    NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                })
            })
    }

    getPrescription(id)
    {
        fetch(`https://restful.taravat.info/prescription/${id}`, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then((res) => res.json())
            .then((resJson) =>
            {
                console.log(resJson)
                if (resJson.state === 1)
                {
                    this.props.handleLoading(false).then(() =>
                    {
                        let prescription = {...this.state.prescription}
                        prescription[resJson.form.id] = resJson.form
                        this.setState({...this.state, prescription})
                    })
                }
                else
                {
                    this.props.handleLoading(false).then(() =>
                    {
                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد.')
                    })
                }
            })
            .catch((err) =>
            {
                console.log(err)
                this.props.handleLoading(false).then(() =>
                {
                    NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                })
            })
    }

    getData()
    {
        fetch('https://restful.taravat.info/disease', {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(res => res.json())
            .then(resJson =>
            {
                if (resJson.state === 1)
                {
                    console.log('state = 1')
                    let object = {}
                    resJson.form.forEach(data =>
                    {
                        object[data.id] = {...data}
                    })
                    this.setState({...this.state, disease: {...object}}, () =>
                    {
                        this.props.setDisease({...object}).then(() =>
                        {

                            fetch('https://restful.taravat.info/bed', {
                                headers: {
                                    'Cache-Control': 'no-cache',
                                },
                            })
                                .then((res) => res.json())
                                .then((resJson) =>
                                {
                                    if (resJson.state === 1)
                                    {
                                        console.log('beds: ', resJson)
                                        let beds = {}
                                        resJson.form.forEach(data =>
                                        {
                                            beds[data.id] = {...data}
                                        })
                                        this.setState({...this.state, bed: beds}, () =>
                                        {
                                            fetch('https://restful.taravat.info/reception/disease_id', {
                                                method: 'post',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Cache-Control': 'no-cache',
                                                },
                                                body: JSON.stringify({
                                                    disease_id: this.props.user.disease_id,
                                                }),
                                            })
                                                .then((res) => res.json())
                                                .then((resJson) =>
                                                {
                                                    if (resJson.state === 1)
                                                    {
                                                        console.log(resJson)
                                                        let patients = {}
                                                        let receptions = {}
                                                        resJson.form.receptions.forEach(data =>
                                                        {
                                                            receptions[data.id] = {...data}
                                                        })

                                                        resJson.form.patients.forEach(data =>
                                                        {
                                                            patients[data.id] = {...data}
                                                        })

                                                        this.setState({...this.state, patient: patients, reception: receptions}, () =>
                                                        {
                                                            fetch('https://restful.taravat.info/prescription', {
                                                                headers: {
                                                                    'Cache-Control': 'no-cache',
                                                                },
                                                            })
                                                                .then((res) => res.json())
                                                                .then((resJson) =>
                                                                {
                                                                    if (resJson.state === 1)
                                                                    {
                                                                        console.log('prescriptions: ', resJson)
                                                                        let prescriptions = {}
                                                                        resJson.form.forEach(data =>
                                                                        {
                                                                            prescriptions[data.id] = {...data}
                                                                        })
                                                                        this.setState({...this.state, prescription: prescriptions}, () =>
                                                                        {
                                                                            fetch('https://restful.taravat.info/personnel', {
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                },
                                                                            })
                                                                                .then((res) => res.json())
                                                                                .then((resJson) =>
                                                                                {
                                                                                    if (resJson.state === 1)
                                                                                    {
                                                                                        console.log('personnels: ', resJson)
                                                                                        let personnels = {}
                                                                                        resJson.form.forEach(data =>
                                                                                        {
                                                                                            personnels[data.id] = {...data}
                                                                                        })
                                                                                        this.setState({...this.state, personnel: personnels}, () =>
                                                                                        {
                                                                                            fetch('https://restful.taravat.info/progress', {
                                                                                                headers: {
                                                                                                    'Content-Type': 'application/json',
                                                                                                },
                                                                                            })
                                                                                                .then((res) => res.json())
                                                                                                .then((resJson) =>
                                                                                                {
                                                                                                    if (resJson.state === 1)
                                                                                                    {
                                                                                                        console.log('progress: ', resJson)
                                                                                                        let progress = {}
                                                                                                        resJson.form.forEach(data =>
                                                                                                        {
                                                                                                            progress[data.id] = {...data}
                                                                                                        })
                                                                                                        this.setState({...this.state, progress}, () =>
                                                                                                        {
                                                                                                            fetch('https://restful.taravat.info/present_log/type', {
                                                                                                                method: 'post',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                    'Cache-Control': 'no-cache',
                                                                                                                },
                                                                                                                body: JSON.stringify({
                                                                                                                    type: 'REPORT',
                                                                                                                }),
                                                                                                            })
                                                                                                                .then((res) => res.json())
                                                                                                                .then((resJson) =>
                                                                                                                {
                                                                                                                    if (resJson.state === 1)
                                                                                                                    {
                                                                                                                        this.props.handleLoading(false).then(() =>
                                                                                                                        {
                                                                                                                            console.log('REPORT: ', resJson)
                                                                                                                            let report = {}
                                                                                                                            resJson.form.forEach(data =>
                                                                                                                            {
                                                                                                                                report[data.id] = {...data}
                                                                                                                            })
                                                                                                                            this.setState({...this.state, report})
                                                                                                                        })
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        this.props.handleLoading(false).then(() =>
                                                                                                                        {
                                                                                                                            this.getData()
                                                                                                                        })
                                                                                                                    }
                                                                                                                })
                                                                                                                .catch(() =>
                                                                                                                {
                                                                                                                    console.log('state = nope')
                                                                                                                    this.props.handleLoading(false).then(() =>
                                                                                                                    {
                                                                                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                                                                                                                    })
                                                                                                                })
                                                                                                        })
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        this.props.handleLoading(false).then(() =>
                                                                                                        {
                                                                                                            this.getData()
                                                                                                        })
                                                                                                    }
                                                                                                })
                                                                                                .catch(() =>
                                                                                                {
                                                                                                    console.log('state = catch')
                                                                                                    this.props.handleLoading(false).then(() =>
                                                                                                    {
                                                                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                                                                                                    })
                                                                                                })
                                                                                        })
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        this.props.handleLoading(false).then(() =>
                                                                                        {
                                                                                            this.getData()
                                                                                        })
                                                                                    }
                                                                                })
                                                                                .catch(() =>
                                                                                {
                                                                                    console.log('state = catch')
                                                                                    this.props.handleLoading(false).then(() =>
                                                                                    {
                                                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                                                                                    })
                                                                                })
                                                                        })
                                                                    }
                                                                    else
                                                                    {
                                                                        this.props.handleLoading(false).then(() =>
                                                                        {
                                                                            this.getData()
                                                                        })
                                                                    }
                                                                })
                                                                .catch(() =>
                                                                {
                                                                    console.log('state = catch')
                                                                    this.props.handleLoading(false).then(() =>
                                                                    {
                                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                                                                    })
                                                                })
                                                        })
                                                    }
                                                    else
                                                    {
                                                        this.props.handleLoading(false).then(() =>
                                                        {
                                                            this.getData()
                                                        })
                                                    }
                                                })
                                                .catch(() =>
                                                {
                                                    console.log('state = catch')
                                                    this.props.handleLoading(false).then(() =>
                                                    {
                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                                                    })
                                                })
                                        })
                                    }
                                    else
                                    {
                                        this.props.handleLoading(false).then(() =>
                                        {
                                            this.getData()
                                        })
                                    }
                                })
                                .catch(() =>
                                {
                                    console.log('state = catch')
                                    this.props.handleLoading(false).then(() =>
                                    {
                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                                    })
                                })
                        })
                    })
                }
                else
                {
                    console.log('else ', resJson)
                    this.props.handleLoading(false).then(() =>
                    {
                        this.getData()
                    })
                }
            })
            .catch(() =>
            {
                console.log('state = catch')
                this.props.handleLoading(false).then(() =>
                {
                    NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. اینترنت خود را چک کنید!')
                })
            })
    }

    setIsDone(id)
    {
        let prescription = {...this.state.prescription}
        prescription[id].is_done = true
        this.setState({...this.state, prescription})
    }

    render()
    {
        return (
            <Switch>
                <Route exact path='/reception/:id' render={(props) =>
                    <Reception user={this.props.user}
                               reception={this.state.reception}
                               patient={this.state.patient}
                               reception_id={parseInt(props.match.params.id)}
                               disease={this.state.disease}
                               bed={this.state.bed}
                               prescription={this.state.prescription}
                               personnel={this.state.personnel}
                               handleLoading={this.props.handleLoading}
                               getPrescription={this.getPrescription}
                               getProgress={this.getProgress}
                               progress={this.state.progress}
                               setIsDone={this.setIsDone}
                               nurse={false}
                               report={this.state.report}
                               getData={this.getData}
                    />
                }/>

                <Route path='*' render={() =>
                    <div>
                        <div className='patient-title'>
                            لیست بیماران
                        </div>
                        <TransitionGroup className='patient-cont'>
                            {
                                Object.values(this.state.reception).map((reception, i) =>
                                    <CSSTransition
                                        key={i}
                                        classNames='fade'
                                        appear={true}
                                        timeout={{enter: 500, exit: 500}}>
                                        <Material className='patient' backgroundColor='rgba(241,242,247,0.5)'>
                                            <Link to={`/reception/${reception.id}`} className='patient-link'>
                                                <div className='patient-name'>
                                                    {this.state.patient[reception.patient_id] && this.state.patient[reception.patient_id].first_name}
                                                    <span> </span>
                                                    {this.state.patient[reception.patient_id] && this.state.patient[reception.patient_id].last_name}
                                                </div>
                                                <div>اتاق: {this.state.bed[reception.bed_id] && this.state.bed[reception.bed_id].room}</div>
                                                <div>تخت: {this.state.bed[reception.bed_id] && this.state.bed[reception.bed_id].number}</div>
                                            </Link>
                                        </Material>
                                    </CSSTransition>,
                                )
                            }
                        </TransitionGroup>
                    </div>
                }/>
            </Switch>
        )
    }
}

export default Doctor