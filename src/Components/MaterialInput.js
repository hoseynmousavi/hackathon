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

    handleChange = (e) =>
    {
        const value = e.target.value
        this.setState({...this.state, value}, () =>
        {
            this.props.getValue(value)
        })
    }

    handleFocus = () =>
    {
        this.setState({...this.state, focused: true})
    }

    handleBlur = () =>
    {
        this.setState({...this.state, focused: false})
    }

    handleKeyDown = (e) =>
    {
        if (this.props.onKeyDown)
            this.props.onKeyDown(e)
    }

    handleClick = () =>
    {
        this.textRef.focus()
    }

    render()
    {
        return (
            <div className={this.props.className ? this.props.className + ' material-input' : 'material-input'}>
                {
                    this.props.isTextArea ?
                        <textarea maxLength={this.props.maxLength}
                                  ref={e => this.textRef = e}
                                  className='material-input-textarea'
                                  value={this.props.defaultValue}
                                  onChange={this.handleChange}
                                  onFocus={this.handleFocus}
                                  onKeyDown={this.handleKeyDown}
                                  onBlur={this.handleBlur}
                                  style={this.props.borderColor ? {borderColor: this.props.borderColor} : {}}
                        />
                        :
                        <input type={this.props.type ? this.props.type : 'text'}
                               maxLength={this.props.maxLength}
                               autoComplete="new-password"
                               ref={e => this.textRef = e}
                               className='material-input-text'
                               value={this.props.defaultValue}
                               onChange={this.handleChange}
                               onFocus={this.handleFocus}
                               onKeyDown={this.handleKeyDown}
                               onBlur={this.handleBlur}
                               style={this.props.borderColor ? {borderColor: this.props.borderColor} : {}}
                        />
                }

                <label className={this.state.focused || this.state.value.trim().length > 0 ? 'material-input-label-out' : this.props.isTextArea ? 'material-area-label' : 'material-input-label'}
                       style={{backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'white'}}
                       onClick={this.handleClick}>{this.props.label}</label>
            </div>
        )
    }
}

export default MaterialInput