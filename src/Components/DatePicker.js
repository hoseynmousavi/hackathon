import React, {Component} from 'react'
import JDate from 'jalali-date'

class MyDatePicker extends Component
{
    constructor(props)
    {
        super(props)
        this.state =
            {
                defaultValue: null,

                firstSixMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],

                secondFiveMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],

                esfand: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],

                months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],

                month: '',
                year: '',

                thisMonth: '',
                thisDay: '',
                thisYear: '',
                value: this.props.defaultValue ? this.props.defaultValue : ''
            }
        this.outside = this.outside.bind(this)
    }

    componentDidMount()
    {
        fetch('http://api.kaho.ir/DatePicker', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then(res => res.json())
            .then(resJson =>
            {
                let year = resJson[1]
                let month = resJson[2]
                let day = resJson[3]
                this.setState({
                    month: month,
                    year: year,
                    thisDay: day,
                    thisMonth: month,
                    thisYear: year
                })
            })

        document.addEventListener('mousedown', this.outside)
    }


    componentWillReceiveProps(nextProps, nextContext)
    {
        if (nextProps.reload)
        {
            this.setState({...this.state, value: ''})
        }

        if (nextProps.defaultValue)
        {
            const value = nextProps.defaultValue
            this.setState({...this.state, value})
        }
    }

    outside(e)
    {
        if (this.main && !this.main.contains(e.target) && this.container.style.display !== 'none')
        {
            this.container.style.display = 'none'
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener('mousedown', this.outside)
    }

    renderMonth()
    {
        let month = parseInt(this.state.month)
        if (month === 1)
        {
            return 'فروردین'
        }
        else if (month === 2)
        {
            return 'اردیبهشت'
        }
        else if (month === 3)
        {
            return 'خرداد'
        }
        else if (month === 4)
        {
            return 'تیر'
        }
        else if (month === 5)
        {
            return 'مرداد'
        }
        else if (month === 6)
        {
            return 'شهریور'
        }
        else if (month === 7)
        {
            return 'مهر'
        }
        else if (month === 8)
        {
            return 'آبان'
        }
        else if (month === 9)
        {
            return 'آذر'
        }
        else if (month === 10)
        {
            return 'دی'
        }
        else if (month === 11)
        {
            return 'بهمن'
        }
        else if (month === 12)
        {
            return 'اسفند'
        }
    }

    renderDays()
    {
        let month = parseInt(this.state.month)

        if (parseInt(this.state.year) > 0)
        {
            let day = new JDate([parseInt(this.state.year), month, 1])
            let letter = day.format('dddd')

            if (letter === 'شنبه')
            {
                this.emp.style.width = '0px'
            }
            else if (letter === 'یکشنبه')
            {
                this.emp.style.width = '42.85px'
            }
            else if (letter === 'دوشنبه')
            {
                this.emp.style.width = '85.7px'
            }
            else if (letter === 'سه‌شنبه')
            {
                this.emp.style.width = '128.55px'
            }
            else if (letter === 'چهارشنبه')
            {
                this.emp.style.width = '171.4px'
            }
            else if (letter === 'پنج‌شنبه')
            {
                this.emp.style.width = '214.25px'
            }
            else if (letter === 'جمعه')
            {
                this.emp.style.width = '257.1px'
            }
        }


        if (month >= 1 && month <= 6)
        {

            this.daysOfWeek.style.height = '40px'


            return this.state.firstSixMonth.map(p =>
            {
                if ((parseInt(this.state.thisDay)) === p && (parseInt(this.state.thisMonth)) === (parseInt(this.state.month)) && (parseInt(this.state.thisYear)) === (parseInt(this.state.year)))
                {
                    return <button className='date-picker-this-day' onClick={() =>
                    {
                        // const value = this.state.year + '/' + this.state.month + '/' + ('0' + p).slice(-2)
                        const value = this.state.year + '/' + this.state.month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
                else
                {
                    return <button className='date-picker-day' onClick={() =>
                    {
                        // const value = this.state.year + '/' + this.state.month + '/' + ('0' + p).slice(-2)
                        const value = this.state.year + '/' + this.state.month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
            })
        }
        else if (month >= 7 && month <= 11)
        {
            this.daysOfWeek.style.height = '40px'

            return this.state.secondFiveMonth.map(p =>
            {
                if ((parseInt(this.state.thisDay)) === p && (parseInt(this.state.thisMonth)) === (parseInt(this.state.month)) && (parseInt(this.state.thisYear)) === (parseInt(this.state.year)))
                {
                    return <button className='date-picker-this-day' onClick={() =>
                    {
                        // const value = this.state.year + '/' + this.state.month + '/' + ('0' + p).slice(-2)
                        const value = this.state.year + '/' + this.state.month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
                else
                {
                    return <button className='date-picker-day' onClick={() =>
                    {
                        // const value = this.state.year + '/' + this.state.month + '/' + ('0' + p).slice(-2)
                        const value = this.state.year + '/' + this.state.month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
            })
        }
        else if (month === 12)
        {
            this.daysOfWeek.style.height = '40px'

            return this.state.esfand.map(p =>
            {
                if ((parseInt(this.state.thisDay)) === p && (parseInt(this.state.thisMonth)) === (parseInt(this.state.month)) && (parseInt(this.state.thisYear)) === (parseInt(this.state.year)))
                {
                    return <button className='date-picker-this-day' onClick={() =>
                    {
                        // const value = this.state.year + '/' + this.state.month + '/' + ('0' + p).slice(-2)
                        const value = this.state.year + '/' + this.state.month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
                else
                {
                    return <button className='date-picker-day' onClick={() =>
                    {
                        // const value = this.state.year + '/' + this.state.month + '/' + ('0' + p).slice(-2)
                        const value = this.state.year + '/' + this.state.month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
            })
        }

        else if (month === 0)
        {

            this.daysOfWeek.style.height = '0px'
            this.emp.style.width = '0px'

            return this.state.months.map(p =>
                <button className='date-picker-month-0' onClick={() =>
                {
                    let mon = (this.state.months.indexOf(p) + 1).toString()
                    if (mon.length === 1)
                        mon = '0' + mon
                    this.setState({month: mon})
                }}>
                    {p}
                </button>
            )
        }
    }

    goPreviousMonth()
    {
        let month = parseInt(this.state.month)
        let year = parseInt(this.state.year)
        if (month !== 0)
        {
            if ((month - 1) >= 1)
            {
                month--
                month = month.toString()
                // if (month.length === 1)
                //     month = '0' + month

                this.setState({month})
            }
            else
            {
                year--
                year = year.toString()
                if (year.length === 1)
                    year = '0' + year

                month = 12
                month = month.toString()
                // if (month.length === 1)
                //     month = '0' + month

                this.setState({month, year})
            }
        }
        else
        {
            year--
            year = year.toString()
            if (year.length === 1)
                year = '0' + year

            this.setState({year})
        }
    }

    goNextMonth()
    {
        let month = parseInt(this.state.month)
        let year = parseInt(this.state.year)
        if (month !== 0)
        {
            if ((month + 1) <= 12)
            {
                month++
                month = month.toString()
                // if (month.length === 1)
                //     month = '0' + month

                this.setState({month})
            }
            else
            {
                year++
                year = year.toString()
                if (year.length === 1)
                    year = '0' + year

                month = 1
                month = month.toString()
                // if (month.length === 1)
                //     month = '0' + month

                this.setState({month, year})
            }
        }
        else
        {
            year++
            year = year.toString()
            if (year.length === 1)
                year = '0' + year

            this.setState({year})
        }
    }

    render()
    {
        return (
            <div className='date-picker-container' ref={e => this.main = e}>
                <input className={this.props.className ? this.props.className : 'date-picker-input'}
                       type="text"
                       value={!this.state.value.includes('null') ? this.state.value : ''}
                       onFocus={() => this.container.style.display = 'block'}
                       onChange={() => this.setState({...this.state, value: ''})}
                       placeholder={this.props.placeHolder}
                />
                <div ref={e => this.container = e} className='date-picker-calendar'>
                    <div style={{borderBottom: '1px solid #555555'}}>
                        <button className='date-picker-left-arrow' onClick={() => this.goPreviousMonth()}>
                            ❮
                        </button>

                        <button className='date-picker-show-year' onClick={() => this.setState({month: '0'})}>
                            {
                                this.renderMonth()
                            }
                            <span> </span>
                            <input type='number' className='date-picker-year'
                                   placeholder={this.state.year}
                                   onInput={(e) =>
                                   {
                                       if (e.target.value.length > 4)
                                       {
                                           e.target.value = e.target.value.slice(0, 4)
                                       }
                                   }}
                                   onBlur={(e) =>
                                   {
                                       if (e.target.value.length === 4)
                                       {
                                           this.setState({
                                               year: e.target.value
                                           })
                                           e.target.value = ''
                                       }
                                       else
                                       {
                                           e.target.value = ''
                                       }
                                   }}/>
                        </button>

                        <button className='date-picker-right-arrow' onClick={() => this.goNextMonth()}>
                            ❯
                        </button>
                    </div>

                    <div ref={e => this.daysOfWeek = e} style={{textAlign: 'right', height: '0px', overflowY: 'hidden', transitionDuration: '0.3s'}}>
                        <button className='date-picker-show-day'>
                            شنبه
                        </button>
                        <button className='date-picker-show-day'>
                            یکشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            دوشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            سه شنبه
                        </button>
                        <button className='date-picker-show-day'>
                            چهارشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            پنجشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            جمعه
                        </button>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <div ref={e => this.emp = e} className='date-picker-empty'>
                            <span> </span>
                        </div>
                        {
                            this.renderDays()
                        }
                        {/*<button className='date-picker-cancel' onClick={() =>*/}
                        {/*{*/}
                            {/*if (this.props.btnFunction)*/}
                            {/*{*/}
                                {/*this.props.btnFunction()*/}
                            {/*}*/}
                            {/*else*/}
                            {/*{*/}
                                {/*this.container.style.display = 'none'*/}
                            {/*}*/}
                        {/*}}>*/}
                            {/*{this.props.btnText ? this.props.btnText : 'لـــغــو'}*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>
        )
    }

}

export default MyDatePicker
