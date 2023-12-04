import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import game_utils from "../../../utils/game_utils";

interface StreetViewProps {
    lat: number;
    lng: number;
}

const StreetView: React.FC<StreetViewProps> = ({ lat, lng }) => {
    const streetViewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: game_utils.apiKey,
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

                // @ts-ignore
                window.setLocation = (lat, lng) => {
                    streetView.setPosition({ lat, lng });
                }
            }
        });
    }, [lat, lng]);

    return <div style={{ height: "100%", width: "100%" }} ref={streetViewRef} />;
};

const Map: React.FC<StreetViewProps> = ({ lat, lng }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const answerMarkerRef = useRef<google.maps.Marker | null>(null);
    const answerLine = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: game_utils.apiKey,
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

                // @ts-ignore
                window.getLocation = () => {
                    if (markerRef.current) {
                        const position = markerRef.current.getPosition();
                        return position?.toJSON();
                    }
                }

                // @ts-ignore
                window.setAnswerMarker = (lat, lng) => {
                    if (answerMarkerRef.current) {
                        answerMarkerRef.current.setMap(null);
                    }

                    answerMarkerRef.current = new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#FF00FF', // Change fill color to blue
                            fillOpacity: 1.0,
                            strokeWeight: 0,
                            scale: 8,
                        },
                    });

                    if (answerLine.current) {
                        answerLine.current.setMap(null);
                    }

                    answerLine.current = new google.maps.Polyline({
                        path: [
                            { lat, lng },
                            { lat: markerRef.current?.getPosition()?.lat(), lng: markerRef.current?.getPosition()?.lng() }
                        ],
                        geodesic: true,
                        strokeColor: '#FF00FF', // Change stroke color to blue
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });

                    answerLine.current.setMap(map);
                }
            }
        });
    }, [lat, lng]);

    return <div style={{ height: "100%", width: "100%" }} ref={mapRef} />;
};

export { StreetView, Map };

