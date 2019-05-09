import React, {Component} from 'react'
import PropTypes from 'prop-types'

class MaterialInput extends Component
{
    static propTypes = {
        className: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        getValue: PropTypes.func.isRequired,
        maxLength: PropTypes.number,
        isTextArea: PropTypes.bool,
        reload: PropTypes.bool,
        defaultValue: PropTypes.string,
        borderColor: PropTypes.string,
    }

    constructor(props)
    {
        super(props)
        this.state = {
            value: '',
            focused: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentWillReceiveProps(nextProps, nextContext)
    {
        if (nextProps.reload)
        {
            this.setState({...this.state, value: ''}, () => this.textRef.value = '')
        }

        if (nextProps.defaultValue)
        {
            const value = nextProps.defaultValue
            this.setState({...this.state, value})
        }
    }

    handleChange(e)
    {
        const value = e.target.value
        this.setState({...this.state, value}, () =>
        {
            this.props.getValue(value)
        })
    }

    handleFocus()
    {
        this.setState({...this.state, focused: true})
    }

    handleBlur()
    {
        this.setState({...this.state, focused: false})
    }

    handleKeyDown(e)
    {
        this.props.onKeyDown && this.props.onKeyDown(e)
    }

    handleClick()
    {
        this.textRef.focus()
    }


    render()
    {
        const {className, isTextArea, maxLength, borderColor, type, label, backgroundColor} = this.props
        const {focused, value} = this.state

        return (
            <div className={className ? className + ' material-input' : 'material-input'}>
                {
                    isTextArea ?
                        <textarea maxLength={maxLength}
                                  ref={e => this.textRef = e}
                                  className='material-input-textarea'
                                  value={value}
                                  onChange={this.handleChange}
                                  onFocus={this.handleFocus}
                                  onKeyDown={this.handleKeyDown}
                                  onBlur={this.handleBlur}
                                  style={borderColor ? {borderColor} : {}}
                        />
                        :
                        <input type={type ? type : 'text'}
                               maxLength={maxLength}
                               autoComplete="new-password"
                               ref={e => this.textRef = e}
                               className='material-input-text'
                               value={value}
                               onChange={this.handleChange}
                               onFocus={this.handleFocus}
                               onKeyDown={this.handleKeyDown}
                               onBlur={this.handleBlur}
                               style={borderColor ? {borderColor} : {}}
                        />
                }

                <label className={focused || value.trim().length > 0 ? 'material-input-label-out' : 'material-input-label'}
                       style={{backgroundColor: backgroundColor ? backgroundColor : 'white'}}
                       onClick={this.handleClick}>
                    {label}
                </label>
            </div>
        )
    }
}

export default MaterialInput