
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';
import { CgEditBlackPoint } from 'react-icons/cg';
import {
  setLocationTakeOrder,
} from '../../../../store/reducer';
import './style.css';

export const SelectPositionCustomer = () => {
  const dispatch = useDispatch();
  const customer = useSelector(
    (state) => state.customer.customer
  );
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100
  });

  const onMarkerDrag = useCallback((event) => {
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
    dispatch(setLocationTakeOrder({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    }))
  }, []);
  const geolocationDeliveryJson = useMemo(() => JSON.parse(customer?.geolocationDelivery || null), [customer?.geolocationDelivery]);
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '50vh',
    latitude: geolocationDeliveryJson?.latitude || 6.253817,
    longitude: geolocationDeliveryJson?.longitude || -75.576694,
    zoom: 11,
  });
  const successCallback = (position) => {
    if (!geolocationDeliveryJson) {
      setMarker({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      })
      setViewport({
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 15,
      })
    } else {
      setMarker({
        latitude: geolocationDeliveryJson.latitude,
        longitude: geolocationDeliveryJson.longitude
      })
      setViewport({
        ...viewport,
        latitude: geolocationDeliveryJson.latitude,
        longitude: geolocationDeliveryJson.longitude,
        zoom: 15,
      })
    }
  }

  React.useEffect(() => {
    setMarker({
      latitude: geolocationDeliveryJson?.latitude || 6.253817,
      longitude: geolocationDeliveryJson?.longitude || -75.576694,
    })
    setViewport({
      ...viewport,
      latitude: geolocationDeliveryJson?.latitude || 6.253817,
      longitude: geolocationDeliveryJson?.longitude || -75.576694,
      zoom: 15,
    })
  }, [customer?.geolocationDelivery]);

  const errorCallback = (error) => {
    console.error(error);
  };
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  React.useEffect(() => {
    dispatch(setLocationTakeOrder({
      longitude: marker.longitude,
      latitude: marker.latitude
    }))
  }, [marker]);

  const mapRef = useRef();

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const markerSize = (zoom) => zoom * 0.2;
  return (
    <>
      <ReactMapGL
        mapRef={mapRef}
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
        onViewportChange={handleViewportChange}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={onMarkerDrag}
        onTouchEnd={() => dispatch(setLocationTakeOrder({
          longitude: marker.longitude,
          latitude: marker.latitude
        }))}
      >
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
          draggable
          onDrag={onMarkerDrag}
        >
          <CgEditBlackPoint
            style={{
              transform: `scale(${markerSize(viewport.zoom)})`,
              cursor: 'pointer',
            }}
          />
        </Marker>

      </ReactMapGL>
    </>
  );
};
