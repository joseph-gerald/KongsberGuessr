import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import game_utils from "../../../utils/game_utils";
import { start } from "repl";

const startLatmap = (game_utils.boundings.latMax + game_utils.boundings.latMin) / 2;
const startLngmap = (game_utils.boundings.lngMax + game_utils.boundings.lngMin) / 2;

interface StreetViewProps {
    lat: number;
    lng: number;
}

const StreetView: React.FC<StreetViewProps> = ({ lat, lng }) => {
    const streetViewRef = useRef<HTMLDivElement>(null);
    let refrenceKey = lat + lng;

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
                    refrenceKey = lat + lng;
                }

                // @ts-ignore
                window.getPlayerLocation = (key) => {
                    if (refrenceKey != key) return "error";
                    return streetView.getPosition()?.toJSON();
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
                    //center: { lat: 40, lng: -30 },
                    center: { lat: startLatmap, lng: startLngmap },
                    zoom: 12,
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
                window.clearStuff = () => {
                    for (const item of [markerRef, answerMarkerRef, answerLine]) {
                        if (item.current) {
                            item.current.setMap(null);
                        }
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
                        map: map,
                        geodesic: true,
                        strokeColor: '#FF00FF', // Change stroke color to blue
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                }
            }
        });
    }, [lat, lng]);

    return <div style={{ height: "100%", width: "100%", zIndex: 45 }} ref={mapRef} />;
};

const EducationMap: React.FC<StreetViewProps> = ({ lat, lng }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const startMarkerRef = useRef<google.maps.Marker | null>(null);
    const endMarkerRef = useRef<google.maps.Marker | null>(null);
    const pathLine = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: game_utils.apiKey,
            version: "weekly",
        });

        function clearStuff() {
            for (const item of [startMarkerRef, endMarkerRef, pathLine]) {
                if (item.current) {
                    item.current.setMap(null);
                }
            }
        }

        loader.load().then(() => {
            if (mapRef.current) {
                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: startLatmap, lng: startLngmap },
                    zoom: 12,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                // @ts-ignore
                window.setChallenge = (start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
                    clearStuff();

                    startMarkerRef.current = new google.maps.Marker({
                        position: start,
                        map: map,
                        icon: {
                            url: '/imgs/you_arrow.png',
                            scaledSize: new google.maps.Size(50, 50),
                        },
                    });

                    endMarkerRef.current = new google.maps.Marker({
                        position: end,
                        map: map,
                        icon: {
                            url: '/imgs/target_arrow.png',
                            scaledSize: new google.maps.Size(100, 100),
                        },
                    });
                }

                // @ts-ignore
                window.setPlayerLocation = (lat, lng) => {
                    const oldMarkerCurrent = startMarkerRef.current;

                    const newMarker = new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        icon: {
                            url: '/imgs/you_arrow.png',
                            scaledSize: new google.maps.Size(50, 50),
                        },
                    });

                    startMarkerRef.current = newMarker;

                    if (oldMarkerCurrent) {
                        setTimeout(() => {
                            oldMarkerCurrent.setMap(null);
                        }, 50);
                    }
                }

                // @ts-ignore
                window.clearStuff = clearStuff;
            }
        });
    }, [lat, lng]);

    return <div style={{ height: "100%", width: "100%", zIndex: 45 }} ref={mapRef} />;
};

export { StreetView, Map, EducationMap };

