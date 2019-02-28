import React from 'react'
import debounce from 'lodash/debounce'
import {compose, withProps, lifecycle} from 'recompose'
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps'

const Maps = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD36Sc8nBz7Nb5w_P5Wce_HidKpg6Mlnco&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{height: '100%'}}/>,
        containerElement: <div style={{height: '100%'}}/>,
        mapElement: <div style={{height: '100%'}}/>
    }),
    lifecycle({
        componentWillMount()
        {
            const refs = {}

            this.setState({
                ...this.state,
                bounds: null,
                center: {
                    lat: this.props.defLat, lng: this.props.defLng
                },
                markers: [],
                onMapMounted: ref =>
                {
                    refs.map = ref
                },
                onBoundsChanged: debounce(
                    () =>
                    {
                        if (refs.map !== null)
                            this.setState({...this.state, bounds: refs.map.getBounds(), center: refs.map.getCenter()})
                        let {onBoundsChange} = this.props
                        if (onBoundsChange)
                        {
                            onBoundsChange(refs.map)
                        }
                    },
                    100,
                    {maxWait: 10000}
                )
            })
        },
        componentWillReceiveProps(next)
        {
            if (next.defLat !== this.props.defLat)
            {
                const refs = {}
                this.setState({
                    ...this.state,
                    bounds: null,
                    center: {
                        lat: next.defLat, lng: next.defLng
                    },
                    markers: [],
                    onMapMounted: ref =>
                    {
                        refs.map = ref
                    },
                    onBoundsChanged: debounce(
                        () =>
                        {
                            if (refs.map !== null)
                            {
                                this.setState({...this.state, bounds: refs.map.getBounds(), center: refs.map.getCenter()})
                            }
                            let {onBoundsChange} = next
                            if (onBoundsChange)
                            {
                                onBoundsChange(refs.map)
                            }
                        },
                        100,
                        {maxWait: 10000}
                    )
                })
            }
        }
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={props.zoom}
        zoom={props.zoom}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
        onClick={(x) => props.onClick(x)}>
        {
            props.sign ? <Marker position={{lat: props.lat, lng: props.lng}}/> : null
        }
    </GoogleMap>
)


export default Maps