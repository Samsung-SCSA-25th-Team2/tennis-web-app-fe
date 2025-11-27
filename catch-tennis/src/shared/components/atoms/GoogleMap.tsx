import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface GoogleMapProps {
    latitude: number
    longitude: number
}


export function GoogleMap({
    latitude,
    longitude,
                          }:GoogleMapProps) {
    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                style={{ width: '100%', height: '400px' }}
                defaultCenter={{ lat: latitude, lng: longitude }}
                defaultZoom={14}
                gestureHandling="greedy"
                disableDefaultUI={true}
                mapId={'DEMO_MAP_ID'}
            >
                <AdvancedMarker position={{lat: latitude, lng: longitude}} >
                    <Pin/>
                </AdvancedMarker>
            </Map>
        </APIProvider>
    )
}