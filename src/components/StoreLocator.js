import React from 'react';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react'

class StoreLocator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            stores: [{latitude: 37.889180, longitude: 41.124655, locationName: 'Batman, Turkey'},
                {latitude: 52.867902, longitude: -1.206724, locationName: 'Gotham, Nottingham, UK'},
                {latitude: 45.456915, longitude: -91.272941, locationName: 'Bruce, Wisconsin, USA'},
                {latitude: 40.925361, longitude: -74.276024, locationName: 'Wayne, New Jersey, USA'}]
        };

    }

    // Creating Markers for all the stores
    showMarkers = () => {
        return this.state.stores.map((store, index) => {
            return (<Marker
                    key={index}
                    id={index}
                    position={{
                        lat: store.latitude,
                        lng: store.longitude
                    }}
                    onClick={this.onMarkerClick}
                    name={store.locationName}
                    title={'PopIt'}/>
            )
        })
    };

    // Creating an InfoWindow for the Marker that was clicked (activeMarker)
    showInfoWindows = () => {
        if (this.state.showingInfoWindow) {
            return <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                <div>
                    <div className="font-weight-bold">
                        PopIt
                        <br/>
                    </div>
                    <div>
                        {this.state.selectedPlace.name}
                    </div>
                </div>
            </InfoWindow>
        }
    };

    // Handling a click event on a Marker (showing an InfoWindow)
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    };

    render() {
        const style = {
            width: '500px',
            height: '400px',
            left: '25px'
        };
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <h4 className="text-center">Come visit us in our stores!</h4>
                </div>
                <br/>
                <div className="row justify-content-center">
                    <div className="col-sm-6 col-sm-offset-3">
                        <Map
                            google={this.props.google}
                            zoom={1}
                            initialCenter={{
                                lat: 36.348609,
                                lng: -23.990378
                            }}
                            style={style}>
                            {this.showMarkers()}
                            {this.showInfoWindows()}
                        </Map>
                    </div>
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyDFhfB2YykRThfbqSPlkqcc97eHxFeQvF8'),
})(StoreLocator);