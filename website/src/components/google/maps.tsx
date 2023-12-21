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
    let marker: google.maps.Marker | null = null;

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
                window.setStreetViewMarker = (lat, lng) => {

                    if (marker) {
                        marker.setMap(null);
                    }

                    const currentLat = streetView.getPosition()?.lat();
                    const currentLng: any = streetView.getPosition()?.lng();

                    const angle = Math.atan2(lat - streetView.getPosition()?.lat(), lng - streetView.getPosition()?.lng());
                    const latInDirection = currentLat + Math.sin(angle) * 0.0001;
                    const lngInDirection = currentLng + Math.cos(angle) * 0.0001;

                    const scale = 200;

                    marker = new google.maps.Marker({
                        position: { lat: latInDirection, lng: lngInDirection },
                        map: streetView,
                        icon: {
                            url: '/imgs/direction_arrow.png',
                            scaledSize: new google.maps.Size(scale, scale),
                            anchor: new google.maps.Point(0, 450)
                        }
                    });
                }

                // @ts-ignore
                window.getPlayerLocation = (key) => {
                    if (refrenceKey != key) return "error";
                    return streetView.getPosition()?.toJSON();
                }
                // add marker
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
                    streetViewControl: true,
                    mapTypeId: "satellite"
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
                window.getLocation = () => {
                    if (startMarkerRef.current) {
                        const position = startMarkerRef.current.getPosition();
                        return position?.toJSON();
                    }
                }

                // @ts-ignore
                window.setLocationAndZoom = async (targetLat, targetLng, targetZoom) => {
                    let lat = map.getCenter().lat();
                    let lng = map.getCenter().lng();
                    let zoom = map.getZoom();

                    let distance = Math.sqrt(Math.pow(targetLat - lat, 2) + Math.pow(targetLng - lng, 2));
                    let last_distance = distance + 1;

                    const smoothness = 20;

                    // @ts-ignore
                    setStreetViewMarker(endMarkerRef.current.getPosition().lat(), endMarkerRef.current.getPosition().lng());

                    while (distance > 0.0001 && distance < last_distance) {

                        lat = lat + (targetLat - lat) / (smoothness);
                        lng = lng + (targetLng - lng) / (smoothness);
                        zoom = zoom + (targetZoom - zoom) / (smoothness);

                        map.setCenter({ lat, lng });
                        map.setZoom(zoom);

                        last_distance = distance;
                        distance = Math.sqrt(Math.pow(targetLat - lat, 2) + Math.pow(targetLng - lng, 2));

                        await new Promise((r) => setTimeout(r, 5));
                    }
                }

                // @ts-ignore
                window.setPlayerLocation = (lat, lng) => {
                    const oldMarkerCurrent = startMarkerRef.current;

                    startMarkerRef.current = new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        icon: {
                            url: '/imgs/you_arrow.png',
                            scaledSize: new google.maps.Size(50, 50),
                        },
                    });

                    if (oldMarkerCurrent) {
                        setTimeout(() => {
                            oldMarkerCurrent.setMap(null);
                        }, 50);

                        pathLine.current = new google.maps.Polyline({
                            path: [
                                { lat, lng },
                                { lat: oldMarkerCurrent.getPosition()?.lat(), lng: oldMarkerCurrent.getPosition()?.lng() }
                            ],
                            map: map,
                            geodesic: true,
                            strokeColor: '#c76c27',
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                        });
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

