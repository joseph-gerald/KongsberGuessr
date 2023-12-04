import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface StreetViewProps {
    lat: number;
    lng: number;
}

const StreetView: React.FC<StreetViewProps> = ({ lat, lng }) => {
    const streetViewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyDPd41N40KlY6TvlPUVeA0MYIB6jmYIY64",
            version: "weekly",
        });

        loader.load().then(() => {
            if (streetViewRef.current) {
                const streetView = new google.maps.StreetViewPanorama(streetViewRef.current, {
                    position: { lat, lng },
                    pov: { heading: 165, pitch: 0 },
                    visible: true,
                    addressControl: false,
                    showRoadLabels: false,
                });
            }
        });
    }, [lat, lng]);

    return <div style={{ height: "100%", width: "100%" }} ref={streetViewRef} />;
};

const Map: React.FC<StreetViewProps> = ({ lat, lng }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyDPd41N40KlY6TvlPUVeA0MYIB6jmYIY64",
            version: "weekly",
        });

        loader.load().then(() => {
            if (mapRef.current) {
                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: 40, lng: -30 },
                    zoom: 2,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                map.addListener('click', function (event) {
                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }

                    markerRef.current = new google.maps.Marker({
                        position: event.latLng,
                        map: map,
                    });
                });
            }
        });
    }, [lat, lng]);

    return <div style={{ height: "100%", width: "100%" }} ref={mapRef} />;
};

export { StreetView, Map };

