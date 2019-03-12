import React, {Component} from 'react'
import Logo from '../Media/Images/Logo.svg'
import Phone from '../Media/Images/Phone.png'
import Hamyar from '../Media/Images/hamyar.png'
import Location from '../Media/Images/Location.svg'
import Home from '../Media/Images/Home.png'
import Hamburger from '../Media/Images/menu.svg'
import Touch from '../Media/Images/Touch.png'
import Material from './Material'
import Default from '../Media/Images/defaultUser'
import {Link} from 'react-router-dom'

class Header extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            cardView: false,
            headerLine: true,
        }
        this.onScroll = this.onScroll.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.toggleCard = this.toggleCard.bind(this)
    }

    componentDidMount()
    {
        window.scroll({
            top: 0,
            behavior: 'smooth',
        })
        document.addEventListener('mousedown', this.onMouseDown)
        document.addEventListener('scroll', this.onScroll)
    }

    onMouseDown(e)
    {
        if (this.state.cardView && this.card && !this.card.contains(e.target))
        {
            this.setState({...this.state, cardView: false})
        }
    }

    onScroll()
    {
        if (window.scrollY > 50 && document.body.clientWidth > 800)
        {
            this.setState({...this.state, headerLine: false})
        }
        else if (!this.state.headerLine)
        {
            this.setState({...this.state, headerLine: true})
        }
    }

    toggleCard()
    {
        this.setState({...this.state, cardView: !this.state.cardView})
    }

    render()
    {
        const {user, disease} = this.props
        return (
            <header className='header'>
                <div className='nav'>
                    <div className={!this.state.headerLine ? 'nav-line-hide' : 'nav-line'}>
                        <div className='phone'><img src={Phone} className='phone-icon' alt=''/>02133334444<span>    |    </span></div>
                        <div className='location'><img src={Location} className='phone-icon' alt=''/>ایران ، تهران ، دانشگاه ایران</div>
                        <div className='health'><img className='touch' src={Touch} alt=''/></div>
                    </div>
                    <div className='header-main'>
                        <div className='header-content'>
                            {
                                user && <Material className='hamburger'>
                                    <img className='hamburger-logo' src={Hamburger} alt='' onClick={this.props.showSidebar}/>
                                    <div className='home-cont-title'>منو</div>
                                </Material>
                            }
                            {
                                user && <Link className='patient-link' to='/'>
                                    <Material className='home-cont'>
                                        <img className='home' src={Home} alt=''/>
                                        <div className='home-cont-title'>خانه</div>
                                    </Material>
                                </Link>
                            }
                            <div ref={e => this.card = e}>
                                {
                                    user ? <Material onClick={this.toggleCard} className={this.state.cardView ? 'header-title-open' : 'header-title'}>
                                            <Default className={this.state.cardView ? 'header-image' : 'header-image-hide'}/>
                                            <div className='header-image-title'>{user && user.first_name ? user.first_name : ''} {user && user.last_name ? user.last_name : ''}</div>
                                            <div className={this.state.cardView ? 'profile-card' : 'profile-card-hide'}>
                                                <div>
                                                    <div className='profile-card-title'>حـرفـــه شغلی:</div>
                                                    {user && user.role && user.role === 'DOCTOR' && 'دکتر'}
                                                    {user && user.role && user.role === 'NURSE' && 'پرستار'}
                                                </div>

                                                {user && user.disease_id && user.role && user.role === 'DOCTOR' ?
                                                    <div>
                                                        <div className='profile-card-title'>تـــخــصــص:</div>
                                                        {disease[user.disease_id] && disease[user.disease_id].title}
                                                    </div>
                                                    :
                                                    null
                                                }

                                                <div>
                                                    <div className='profile-card-title'>شـمـاره تـلفـن:</div>
                                                    {user && user.phone_number}
                                                </div>
                                                <div>
                                                    <div className='profile-card-title'>کدنظام پزشکی:</div>
                                                    {user && user.national_code}
                                                </div>
                                                <div className='profile-card-date'>تاریخ عضویت: {user && user.create_date}</div>
                                                <div className='log-out-cont'>
                                                    <Material className='log-out' onClick={this.state.cardView ? this.props.logOut : null}>خروج</Material>
                                                </div>
                                            </div>
                                        </Material>
                                        :
                                        <Material className='header-title-welcome'>
                                            <div className='header-image-title'>به سامانه همیار خوش آمدید.</div>
                                        </Material>
                                }
                            </div>
                            <div className='logo-cont'>
                                <img src={Hamyar} className='hamyar' alt='' />
                                <img src={Logo} className='logo' alt=''/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header