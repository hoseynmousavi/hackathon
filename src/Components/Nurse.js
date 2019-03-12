import React, {Component} from 'react'
import {NotificationManager} from 'react-notifications'
import Material from './Material'
import {Switch, Route, Link} from 'react-router-dom'
import Reception from './Reception'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

class Nurse extends Component
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
            nurse_patient: {},
            report: {},
        }
        this.getData = this.getData.bind(this)
        this.getPrescription = this.getPrescription.bind(this)
        this.getProgress = this.getProgress.bind(this)
        this.getReport = this.getReport.bind(this)
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

    getReport(id)
    {
        fetch(`https://restful.taravat.info/present_log/${id}`, {
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
                        let report = {...this.state.report}
                        report[resJson.form.id] = resJson.form
                        this.setState({...this.state, report})
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
                    console.log('disease: ', resJson)
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
                                                                                            fetch('https://restful.taravat.info/nurse_patient/personnel_id', {
                                                                                                method: 'post',
                                                                                                headers: {
                                                                                                    'Content-Type': 'application/json',
                                                                                                    'Cache-Control': 'no-cache',
                                                                                                },
                                                                                                body: JSON.stringify({
                                                                                                    personnel_id: this.props.user.id,
                                                                                                }),
                                                                                            })
                                                                                                .then((res) => res.json())
                                                                                                .then((resJson) =>
                                                                                                {
                                                                                                    if (resJson.state === 1)
                                                                                                    {
                                                                                                        console.log('patient nurse: ', resJson)
                                                                                                        let nurse_patient = {}
                                                                                                        resJson.form.forEach(data =>
                                                                                                        {
                                                                                                            nurse_patient[data.id] = {...data}
                                                                                                        })
                                                                                                        this.setState({...this.state, nurse_patient}, () =>
                                                                                                        {
                                                                                                            fetch('https://restful.taravat.info/patient', {
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                            })
                                                                                                                .then((res) => res.json())
                                                                                                                .then((resJson) =>
                                                                                                                {
                                                                                                                    if (resJson.state === 1)
                                                                                                                    {
                                                                                                                        console.log('patient: ', resJson)
                                                                                                                        let patient = {}
                                                                                                                        resJson.form.forEach(data =>
                                                                                                                        {
                                                                                                                            patient[data.id] = {...data}
                                                                                                                        })
                                                                                                                        this.setState({...this.state, patient}, () =>
                                                                                                                        {
                                                                                                                            fetch('https://restful.taravat.info/reception', {
                                                                                                                                headers: {
                                                                                                                                    'Content-Type': 'application/json',
                                                                                                                                },
                                                                                                                            })
                                                                                                                                .then((res) => res.json())
                                                                                                                                .then((resJson) =>
                                                                                                                                {
                                                                                                                                    if (resJson.state === 1)
                                                                                                                                    {
                                                                                                                                        console.log('reception: ', resJson)
                                                                                                                                        let reception = {}
                                                                                                                                        resJson.form.forEach(data =>
                                                                                                                                        {
                                                                                                                                            reception[data.id] = {...data}
                                                                                                                                        })
                                                                                                                                        this.setState({...this.state, reception}, () =>
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
                    console.log('state = else')
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
                               nurse={true}
                               report={this.state.report}
                               getReport={this.getReport}
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
                                Object.values(this.state.nurse_patient).map((nursePatient, i) =>
                                    <CSSTransition
                                        key={i}
                                        classNames='fade'
                                        appear={true}
                                        timeout={{enter: 500, exit: 500}}>
                                        <Material className='patient' backgroundColor='rgba(241,242,247,0.5)'>
                                            <Link to={`/reception/${nursePatient.reception_id}`} className='patient-link'>
                                                <div className='patient-name'>
                                                    {this.state.reception[nursePatient.reception_id] && this.state.patient[this.state.reception[nursePatient.reception_id].patient_id].first_name}
                                                    <span> </span>
                                                    {this.state.reception[nursePatient.reception_id] && this.state.patient[this.state.reception[nursePatient.reception_id].patient_id].last_name}
                                                </div>
                                                <div>اتاق: {this.state.reception[nursePatient.reception_id] && this.state.bed[this.state.reception[nursePatient.reception_id].bed_id].room}</div>
                                                <div>تخت: {this.state.reception[nursePatient.reception_id] && this.state.bed[this.state.reception[nursePatient.reception_id].bed_id].number}</div>
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

export default Nurse