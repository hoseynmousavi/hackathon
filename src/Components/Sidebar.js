import React, {Component} from 'react'
import Default from '../Media/Images/defaultUser'
import Material from './Material'

class Sidebar extends Component
{
    render()
    {
        const {user, disease} = this.props
        return (
            <div className={this.props.sidebar ? 'sidebar' : 'sidebar-out'}>
                <Default className='side-image'/>
                <div className='sidebar-image-title'>{user && user.first_name ? user.first_name : ''} {user && user.last_name ? user.last_name : ''}</div>
                <div className='sidebar-profile-card'>
                    <div>
                        <div className='sidebar-card-title'>حـرفـــه شغلی:</div>
                        {user && user.role && user.role === 'DOCTOR' && 'دکتر'}
                        {user && user.role && user.role === 'NURSE' && 'پرستار'}
                    </div>

                    {user && user.disease_id && user.role && user.role === 'DOCTOR' ?
                        <div>
                            <div className='sidebar-card-title'>تـــخــصــص:</div>
                            {disease[user.disease_id] && disease[user.disease_id].title}
                        </div>
                        :
                        null
                    }

                    <div>
                        <div className='sidebar-card-title'>شـمـاره تـلفـن</div>
                        {user && user.phone_number}
                    </div>
                    <div>
                        <div className='sidebar-card-title'>کدنظام پزشکی:</div>
                        {user && user.national_code}
                    </div>
                    <div className='side-card-date'>تاریخ عضویت: {user && user.create_date}</div>
                    <div className='log-out-cont'>
                        <Material className='side-log-out-cont' onClick={this.props.logOut}>خروج</Material>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sidebar