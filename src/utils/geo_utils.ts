import React from "react";

interface Geolocation {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error?: any;
}

// https://github.com/uidotdev/usehooks/blob/main/index.js#L287
export function useGeolocation(options = {}) {
  const [state, setState] = React.useState<Geolocation>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const optionsRef = React.useRef(options);

  React.useEffect(() => {
    const onEvent = ({
      coords,
      timestamp,
    }: {
      coords: GeolocationCoordinates;
      timestamp: number;
    }) => {
      setState({
        loading: false,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
      });
    };

    const onEventError = (error: any) => {
      setState((s) => ({
        ...s,
        loading: false,
        error,
      }));
    };

    navigator.geolocation.getCurrentPosition(
      onEvent,
      onEventError,
      optionsRef.current,
    );

    const watchId = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      optionsRef.current,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
