import React from 'react'
import Maps from './Maps'
import PropTypes from 'prop-types'

class FancyMaps extends React.Component
{
    static propTypes = {
        pin: PropTypes.string,
        id: PropTypes.number,
        disableChange: PropTypes.bool,
        disableSearch: PropTypes.bool,
        getPin: PropTypes.func
    }

    constructor(props)
    {
        super(props)
        this.state =
            {
                zoom: 11.6,
                sign: false,
                lat: 0,
                lng: 0,
                searchArray: [],
                searchLat: 0,
                searchLng: 0
            }
    }

    onClick = (x) =>
    {
        if (!this.props.disableChange)
        {
            const lat = x.latLng.lat()
            const lng = x.latLng.lng()
            this.setState({...this.state, sign: true, lat, lng}, () =>
            {
                if (this.props.getPin) this.props.getPin(lat + ',' + lng)
            })
        }
    }

    componentDidMount()
    {
        if (this.props.pin && this.props.pin !== '')
        {
            let position = this.props.pin.split(',')
            this.setState({
                ...this.state,
                sign: true,
                lat: parseFloat(position[0]),
                lng: parseFloat(position[1]),
                searchLat: parseFloat(position[0]),
                searchLng: parseFloat(position[1])
            })
        }
        else
        {
            this.setState({...this.state, searchLat: 35.6892, searchLng: 51.3890})
        }
    }

    componentWillReceiveProps(nextProps, nextContext)
    {
        if (nextProps.id !== this.props.id && nextProps.pin && nextProps.pin !== '')
        {
            let position = nextProps.pin.split(',')
            this.setState({
                ...this.state,
                sign: true,
                lat: parseFloat(position[0]),
                lng: parseFloat(position[1]),
                searchLat: parseFloat(position[0]),
                searchLng: parseFloat(position[1])
            })
        }
        else if (nextProps.id !== this.props.id && !nextProps.pin)
        {
            this.setState({...this.state, searchLat: 35.6892, searchLng: 51.3890, sign: false})
        }
    }

    handleSearchChange = (e) =>
    {
        if (e.target.value.length >= 3)
        {
            fetch(`https://developers.parsijoo.ir/web-service/v1/map/?type=search&q=${e.target.value}`, {
                headers: {
                    'api-key': '96e2bee5de4d496081117c23ccf9c177',
                    'Cache-Control': 'no-cache'
                }
            })
                .then(res => res.json())
                .then(resJson =>
                {
                    this.setState({...this.state, searchArray: [...resJson.result.items]})
                })
        }
        else
        {
            this.setState({...this.state, searchArray: []})
        }
    }

    handleSearchSelect(p)
    {
        this.setState({
            ...this.state,
            searchLat: parseFloat(p.latitude),
            searchLng: parseFloat(p.longitude),
            zoom: 17,
            searchArray: []
        })
    }

    render()
    {
        return (
            <div className='maps-container'>
                <div className='maps-search-logo' style={this.props.disableSearch ? {display: 'none'} : {}}>
                    <input type='text'
                           className='maps-search'
                           placeholder='جست و جو ...'
                           onChange={this.handleSearchChange}/>
                    <br/>
                    <div className='maps-search-cont'>
                        {
                            this.state.searchArray.map((p,i) =>
                                <div key={i} className='maps-cursor-pointer' onClick={this.handleSearchSelect.bind(this, p)}>
                                    {p.title}
                                </div>
                            )
                        }
                    </div>
                </div>

                <Maps onClick={this.onClick}
                      sign={this.state.sign}
                      zoom={this.state.zoom}
                      lat={this.state.lat}
                      lng={this.state.lng}
                      defLat={this.state.searchLat}
                      defLng={this.state.searchLng}
                />
            </div>

        )
    }

}

export default FancyMaps