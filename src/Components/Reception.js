import React, {Component} from 'react'
import Default from '../Media/Images/defaultUser'
import Material from './Material'
import Notif from '../Media/Images/notif.png'
import NoneNotif from '../Media/Images/none-notif.png'
import Static from '../Media/Images/static.svg'
import Tanavob from '../Media/Images/tanavob.svg'
import MaterialInput from './MaterialInput'
import {NotificationManager} from 'react-notifications'
import {Redirect} from 'react-router-dom'

class Reception extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            tab: 'profile',
            orderModal: false,
            have_notification: true,
            description: '',
            is_static: false,
            interval: null,
            interval_valid: true,
            progressModal: false,
            reportModal: false,
            redirect: false,
        }
        this.showOrder = this.showOrder.bind(this)
        this.showProgress = this.showProgress.bind(this)
        this.showReport = this.showReport.bind(this)
        this.hideOrder = this.hideOrder.bind(this)
        this.handleDescription = this.handleDescription.bind(this)
        this.addOrder = this.addOrder.bind(this)
        this.addProgress = this.addProgress.bind(this)
        this.addReport = this.addReport.bind(this)
        this.doneOrder = this.doneOrder.bind(this)
        this.doOrder = this.doOrder.bind(this)
        this.addPresent = this.addPresent.bind(this)
    }

    setTab(tab)
    {
        this.setState({...this.state, tab}, () => this.props.getData())
    }

    showProgress()
    {
        document.body.style.overflow = 'hidden'
        this.setState({...this.state, progressModal: true})
    }

    showReport()
    {
        document.body.style.overflow = 'hidden'
        this.setState({...this.state, reportModal: true})
    }

    showOrder()
    {
        document.body.style.overflow = 'hidden'
        this.setState({...this.state, orderModal: true})
    }

    hideOrder()
    {
        document.body.style.overflow = 'auto'
        this.setState({...this.state, orderModal: false, interval_valid: true, description: '', progressModal: false, reportModal: false})
    }

    handleDescription(description)
    {
        this.setState({...this.state, description})
    }

    handleNotif = (e) =>
    {
        if (!e.target.checked)
        {
            this.setState({...this.state, have_notification: e.target.checked, interval: null})
        }
        else this.setState({...this.state, have_notification: e.target.checked})
    }

    handleStaticNotif = (e) =>
    {
        this.setState({...this.state, is_static: e.target.checked})
    }

    handleInterval = (value) =>
    {
        const interval = value.trim()
        if (interval.length > 3 && interval.includes(':'))
        {
            const time = interval.split(':')
            if (time[0].length > 0 && time[0].length < 3 && parseInt(time[0]) < 24 && time[1].length === 2 && parseInt(time[1]) < 60)
            {
                this.setState({...this.state, interval, interval_valid: true})
            }
            else this.setState({...this.state, interval_valid: false})
        }
        else if (interval.length > 3)
        {
            this.setState({...this.state, interval_valid: false})
        }
    }

    addOrder()
    {
        if (this.state.description.trim().length > 0 && (!this.state.have_notification || (this.state.interval && this.state.interval.length > 3 && this.state.interval_valid)))
        {
            this.props.handleLoading(true).then(() =>
            {
                fetch('https://restful.taravat.info/prescription', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                    },
                    body: JSON.stringify({
                        personnel_id: this.props.user.id,
                        reception_id: this.props.reception_id,
                        description: this.state.description.trim(),
                        have_notification: this.state.have_notification,
                        notification: this.state.have_notification ? this.state.description.trim() : null,
                        interval: this.state.have_notification ? this.state.interval : null,
                        is_static: this.state.have_notification ? this.state.is_static : null,
                    }),
                })
                    .then((res) => res.json())
                    .then((resJson) =>
                    {
                        if (resJson.state === 1)
                        {
                            this.setState({
                                ...this.state,
                                orderModal: false,
                                have_notification: true,
                                is_static: false,
                                interval: null,
                                interval_valid: true,
                                description: '',
                            }, () =>
                            {
                                console.log(resJson)
                                this.props.getPrescription(resJson.form.id)
                                NotificationManager.success('دستور شما با موفقیت ثبت شد.')
                            })
                        }
                        else
                        {
                            this.props.handleLoading(false).then(() =>
                            {
                                NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
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
        else if (this.state.description.trim().length === 0)
        {
            NotificationManager.warning('توضیحات وارد شده معتبر نیست!')
        }
        else
        {
            NotificationManager.warning('لطفا ساعت یا تناوب مد نظر را وارد کنید!')
        }
    }

    addProgress()
    {
        if (this.state.description.trim().length > 0)
        {
            this.props.handleLoading(true).then(() =>
            {
                fetch('https://restful.taravat.info/progress', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                    },
                    body: JSON.stringify({
                        personnel_id: this.props.user.id,
                        reception_id: this.props.reception_id,
                        description: this.state.description.trim(),
                    }),
                })
                    .then((res) => res.json())
                    .then((resJson) =>
                    {
                        if (resJson.state === 1)
                        {
                            this.setState({
                                ...this.state,
                                progressModal: false,
                                description: '',
                            }, () =>
                            {
                                console.log(resJson)
                                this.props.getProgress(resJson.form.id)
                                NotificationManager.success('با موفقیت ثبت شد.')
                            })
                        }
                        else
                        {
                            this.props.handleLoading(false).then(() =>
                            {
                                NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
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
        else if (this.state.description.trim().length === 0)
        {
            NotificationManager.warning('توضیحات وارد شده معتبر نیست!')
        }
    }

    addReport()
    {
        if (this.state.description.trim().length > 0)
        {
            this.props.handleLoading(true).then(() =>
            {
                fetch('https://restful.taravat.info/present_log', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                    },
                    body: JSON.stringify({
                        personnel_id: this.props.user.id,
                        reception_id: this.props.reception_id,
                        description: this.state.description.trim(),
                        type: 'REPORT',
                    }),
                })
                    .then((res) => res.json())
                    .then((resJson) =>
                    {
                        if (resJson.state === 1)
                        {
                            this.setState({
                                ...this.state,
                                reportModal: false,
                                description: '',
                            }, () =>
                            {
                                console.log(resJson)
                                this.props.getReport(resJson.form.id)
                                NotificationManager.success('با موفقیت ثبت شد.')
                            })
                        }
                        else
                        {
                            this.props.handleLoading(false).then(() =>
                            {
                                NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
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
        else if (this.state.description.trim().length === 0)
        {
            NotificationManager.warning('توضیحات وارد شده معتبر نیست!')
        }
    }

    doneOrder(id)
    {
        this.props.handleLoading(true).then(() =>
        {
            fetch('https://restful.taravat.info/prescription/is_done', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    is_done: true,
                    id,
                }),
            })
                .then((res) => res.json())
                .then((resJson) =>
                {
                    if (resJson.state === 1)
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            this.props.setIsDone(id)
                            NotificationManager.success('با موفقیت اعمال شد!')
                        })
                    }
                    else
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
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

    doOrder(id)
    {
        this.props.handleLoading(true).then(() =>
        {
            fetch('https://restful.taravat.info/present_log', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    personnel_id: this.props.user.id,
                    reception_id: this.props.reception_id,
                    description: '',
                    type: 'REPORT',
                    prescription_id: id,
                }),
            })
                .then((res) => res.json())
                .then((resJson) =>
                {
                    if (resJson.state === 1)
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            NotificationManager.success('با موفقیت اعمال شد!')
                        })
                    }
                    else
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
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

    addPresent()
    {
        this.props.handleLoading(true).then(() =>
        {
            fetch('https://restful.taravat.info/present_log', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    personnel_id: this.props.user.id,
                    reception_id: this.props.reception_id,
                    description: '',
                    type: 'VISIT',
                }),
            })
                .then((res) => res.json())
                .then((resJson) =>
                {
                    if (resJson.state === 1)
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            this.setState({...this.state, redirect: true})
                            NotificationManager.success('با موفقیت اعمال شد!')
                        })
                    }
                    else
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
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

    renderContent()
    {
        if (this.state.tab === 'profile')
        {
            return (
                <div className='profile-decs'>
                    {this.props.reception[this.props.reception_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id].profile}
                </div>
            )
        }
        else if (this.state.tab === 'order')
        {
            return (
                <div className='order-cont'>
                    <div className='order-cont-scroll'>
                        {
                            Object.values(this.props.prescription).filter(pre => pre.reception_id === this.props.reception_id).map((prescription, i) =>
                                <div key={i} className={prescription.is_done ? 'order order-done' : 'order'}>
                                    <div className='doctor-name'>دکتر {this.props.personnel && this.props.personnel[prescription.personnel_id].first_name} {this.props.personnel && this.props.personnel[prescription.personnel_id].last_name}</div>
                                    <div className='order-description'>{prescription.description}</div>
                                    <div>
                                        {
                                            prescription.have_notification ?
                                                <div className='order-notif'>
                                                    {
                                                        this.props.nurse ?
                                                            !prescription.is_done && <Material className='order-notif-end' onClick={() => this.doOrder(prescription.id)}>انجام شد</Material>
                                                            :
                                                            !prescription.is_done && <Material className='order-notif-end' onClick={() => this.doneOrder(prescription.id)}>اتمام دستور</Material>
                                                    }
                                                    <div className='order-time'>
                                                        {prescription.interval}
                                                        <img className='order-tanavob' src={prescription.is_static ? Static : Tanavob} alt=''/>
                                                    </div>
                                                    <img className='order-notif-img' src={Notif} alt=''/>
                                                </div>
                                                :
                                                <div className='order-notif'>
                                                    {
                                                        this.props.nurse ?
                                                            !prescription.is_done && <Material className='order-notif-end' onClick={() => this.doOrder(prescription.id)}>انجام شد</Material>
                                                            :
                                                            !prescription.is_done && <Material className='order-notif-end' onClick={() => this.doneOrder(prescription.id)}>اتمام دستور</Material>
                                                    }
                                                    <div className='order-time order-time-hide'/>
                                                    <img className='order-notif-img' src={NoneNotif} alt=''/>
                                                </div>
                                        }
                                    </div>
                                </div>,
                            )
                        }
                    </div>
                    <div className='order-add'>
                        <Material className={this.props.nurse ? 'none' : 'order-add-material'} onClick={this.showOrder}>افزودن</Material>
                    </div>
                </div>
            )
        }
        else if (this.state.tab === 'progress')
        {
            return (
                <div className='order-cont'>
                    <div className='order-cont-scroll-two'>
                        {
                            Object.values(this.props.progress).filter(pro => pro.reception_id === this.props.reception_id).map((progress, i) =>
                                <div key={i} className='progress-decs'>
                                    {progress.description}
                                    <div className='doctor-name-progress'>دکتر {this.props.personnel && this.props.personnel[progress.personnel_id].first_name} {this.props.personnel[progress.personnel_id].last_name}</div>
                                </div>,
                            )
                        }
                    </div>
                    <div className={this.props.nurse ? 'none' : 'order-add'}>
                        <Material className='order-add-material' onClick={this.showProgress}>افزودن</Material>
                    </div>
                </div>
            )
        }
        else if (this.state.tab === 'report')
        {
            return (
                <div className='order-cont'>
                    <div className='order-cont-scroll-two'>
                        {
                            Object.values(this.props.report).filter(rep => rep.reception_id === this.props.reception_id && rep.prescription_id === null).map((report, i) =>
                                <div key={i} className='progress-decs'>
                                    {report.description}
                                    <div className='doctor-name-progress'>پرستار {this.props.personnel[report.personnel_id] && this.props.personnel[report.personnel_id].first_name} {this.props.personnel[report.personnel_id] && this.props.personnel[report.personnel_id].last_name}</div>
                                </div>,
                            )
                        }
                    </div>
                    <div className={!this.props.nurse ? 'none' : 'order-add'}>
                        <Material className='order-add-material' onClick={this.showReport}>افزودن</Material>
                    </div>
                </div>
            )
        }
    }

    render()
    {
        if (this.state.redirect)
            return <Redirect to='/'/>

        return (
            <div className='reception-cont'>
                <div className='reception-card'>
                    <Default className='reception-img'/>
                    <div className='reception-field'>
                        نام و نام خانوادگی:<span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id].first_name}
                        <span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id].last_name}
                    </div>
                    <div className='reception-field'>
                        نوع بیماری:<span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.disease[this.props.reception[this.props.reception_id].disease_id] && this.props.disease[this.props.reception[this.props.reception_id].disease_id].title}
                    </div>
                    <div className='reception-field'>
                        جنسیت:<span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id].gender}
                    </div>
                    <div className='reception-field'>
                        کدملی:<span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id].national_code}
                    </div>
                    <div className='reception-field'>
                        شماره تماس:<span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id] && this.props.patient[this.props.reception[this.props.reception_id].patient_id].phone_number}
                    </div>
                    <div className='reception-field'>
                        علت مراجعه:<span> </span>
                        {this.props.reception[this.props.reception_id] && this.props.reception[this.props.reception_id].description}
                    </div>
                </div>
                <div className='reception-content'>
                    <div className='content-header'>
                        <Material backgroundColor='rgba(255,255,255,0.3)' onClick={() => this.setTab('profile')} className={this.state.tab === 'profile' ? 'content-header-item-select' : 'content-header-item'}>پرونده بیمار</Material>
                        <Material backgroundColor='rgba(255,255,255,0.3)' onClick={() => this.setTab('order')} className={this.state.tab === 'order' ? 'content-header-item-select' : 'content-header-item'}>دستورات پزشک</Material>
                        <Material backgroundColor='rgba(255,255,255,0.3)' onClick={() => this.setTab('progress')} className={this.state.tab === 'progress' ? 'content-header-item-select' : 'content-header-item'}>پیشرفت بیمار</Material>
                        <Material backgroundColor='rgba(255,255,255,0.3)' onClick={() => this.setTab('report')} className={this.state.tab === 'report' ? 'content-header-item-select' : 'content-header-item'}>گزارش پرستار</Material>
                    </div>
                    <div className='reception-detail'>
                        {
                            this.renderContent()
                        }
                    </div>
                </div>

                <div>

                </div>

                {/*//Modals*/}
                <div className={this.state.reportModal || this.state.orderModal || this.state.progressModal ? 'reception-modal-cont' : 'reception-modal-cont-hide'} onClick={this.hideOrder}/>
                <div className={this.state.orderModal ? 'reception-add-modal' : 'reception-add-modal-hide'}>
                    <div className='order-form-title'>افزودن دستور جدید</div>
                    <MaterialInput reload={!this.state.orderModal} getValue={this.handleDescription} type='text' label='توضیحات' className='order-input-area' isTextArea={true} backgroundColor='white'/>
                    <div className='order-have'>
                        دارای یادآور
                        <div className='slideThree'>
                            <input type='checkbox' id='1' checked={this.state.have_notification} onChange={this.handleNotif}/>
                            <label htmlFor='1'/>
                        </div>
                    </div>
                    <div className={this.state.have_notification ? 'time-cont' : 'time-cont-hide'}>
                        <div className='order-have'>
                            نـوع یادآور
                            <div className='slide'>
                                <input type='checkbox' id='2' checked={this.state.is_static} onChange={this.handleStaticNotif}/>
                                <label htmlFor='2'/>
                            </div>
                        </div>
                        <MaterialInput reload={!this.state.orderModal} getValue={this.handleInterval} type='text' label={this.state.is_static ? 'ساعت' : 'تناوب'} borderColor={this.state.interval_valid ? null : 'red'} className='order-input' backgroundColor='white'/>
                        <div className='order-input-example'>مثال: 17:05 | 5:05</div>

                    </div>
                    <Material className='order-input-submit' backgroundColor='rgba(255,255,255,0.4)' onClick={this.addOrder}>ثـبـت</Material>
                </div>

                {/*//////////*/}

                <div className={this.state.progressModal || this.state.reportModal ? 'reception-add-modal' : 'reception-add-modal-hide'}>
                    <div className='order-form-title'>افزودن {this.state.progressModal ? 'پیشرفت' : 'گزارش'} جدید</div>
                    <MaterialInput reload={!this.state.progressModal && !this.state.reportModal} getValue={this.handleDescription} type='text' label='توضیحات' className='order-input-area-two' isTextArea={true} backgroundColor='white'/>
                    <Material className='order-input-submit' backgroundColor='rgba(255,255,255,0.4)' onClick={this.state.reportModal ? this.addReport : this.addProgress}>ثـبـت</Material>
                </div>

                {/*//////////*/}

                <div className={this.props.nurse ? 'none' : 'finish'}>
                    <Material className='finish-material' backgroundColor='rgba(255,255,255,0.3)' onClick={this.addPresent}>اتمام ویزیت</Material>
                </div>

                {/*//Modals*/}

            </div>
        )
    }
}

export default Reception