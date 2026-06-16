import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { Button } from 'prizma-ui';
import {
  getFromDealerPositionAction,
  getOrderByDeliveryNumberAction,
} from '../../../../store/reducer';
import ReactMapGL, { Marker } from 'react-map-gl';
import { FaRegPaperPlane } from 'react-icons/fa';
import { BsGeo } from 'react-icons/bs';
import getDistance from 'geolib/es/getDistance';

import './style.css';

export const MapOrderDealer = (props) => {
  const dispatch = useDispatch();

  const deliveryNumber = props.match.params.id;
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );

  const positionDomiciliary = useSelector(
    (state) => state.domiciliary.dealerPosition
  );

  const [domiciliaryPosition, setDomiciliaryPosition] =
    useState(null);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: '108vh',
    latitude: 6.253817,
    longitude: -75.576694,
    zoom: 11,
  });

  function getZoomFromDistance(distance) {
    return 20 - Math.log2(distance / 30);
  }
  function getCenterPoint(point1, point2) {
    const lat = (point1.latitude + point2.latitude) / 2;
    const lng = (point1.longitude + point2.longitude) / 2;
    return { latitude: lat, longitude: lng };
  }

  const getPositionDomiciliary = () => {
    let distance = 700000;
    let centralPoint = {
      latitude: 0,
      longitude: 0,
    };
    if (geolocationDeliveryJson !== null && positionDomiciliary !== null) {
      let finalPositionDomiciliary = JSON.parse(
        positionDomiciliary.position
      );
      distance = getDistance(
        { latitude: geolocationDeliveryJson.latitude, longitude: geolocationDeliveryJson.longitude },
        { latitude: finalPositionDomiciliary.latitude, longitude: finalPositionDomiciliary.longitude }
      );
      centralPoint = getCenterPoint(
        { latitude: geolocationDeliveryJson.latitude, longitude: geolocationDeliveryJson.longitude },
        { latitude: finalPositionDomiciliary.latitude, longitude: finalPositionDomiciliary.longitude }
      );
    }

    const zoom = getZoomFromDistance(distance);
    if (orderByDeliveryNumber) {
      if (positionDomiciliary) {
        let finalPositionDomiciliary = JSON.parse(
          positionDomiciliary.position
        );
        const domiciliaryPositionState = {
          id: 20,
          type: 'User',
          numero_orden: orderByDeliveryNumber.deliveryNumber,
          deliveryAddress: `${orderByDeliveryNumber.deliveryAddress}`,
          phoneNumber: orderByDeliveryNumber.clientPhone,
          domiciliary: orderByDeliveryNumber.domiciliary,
          coordinates: {
            lat: finalPositionDomiciliary.latitude,
            lng: finalPositionDomiciliary.longitude,
          },
        };
        setDomiciliaryPosition(domiciliaryPositionState);

        if (!domiciliaryPosition) {
          setViewport({
            width: '100%',
            height: '108vh',
            latitude: centralPoint.latitude,
            longitude: centralPoint.longitude,
            zoom
          });
        }
      }
    }
  };

  // Get order by delivery number
  useEffect(() => {
    dispatch(getOrderByDeliveryNumberAction(deliveryNumber));
  }, [dispatch]);
  // update in map position domiciliary if positionDomiciliary update
  useEffect(() => {
    getPositionDomiciliary();
  }, [positionDomiciliary]);
  // Get position domiciliary if orderByDeliveryNumber update
  useEffect(() => {
    if (orderByDeliveryNumber !== null) {
      dispatch(
        getFromDealerPositionAction(
          orderByDeliveryNumber.domiciliary.id
        )
      );
    }
  }, [dispatch, orderByDeliveryNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(
        getFromDealerPositionAction(
          orderByDeliveryNumber.domiciliary.id
        )
      );
    }, 20000);
    return () => clearTimeout(timer);
  }, [dispatch, positionDomiciliary, orderByDeliveryNumber]);
  const geolocationDeliveryJson = orderByDeliveryNumber?.geolocationDelivery ? JSON.parse(orderByDeliveryNumber.geolocationDelivery) : null;
  const deliverySize = (zoom) => zoom * 0.2;
  const domiciliarySize = (zoom) => zoom * 0.1;

  return (
    <>
      <Button
        style={{
          position: 'absolute',
          top: '0',
          left: '2vh',
          zIndex: 5,
        }}
        onClick={(e) => {
          e.preventDefault();
          dispatch(push(`/takeOrder/${deliveryNumber}`));
        }}
        color="contained"
      >
        Ver detalle de la orden{' '}
      </Button>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
        onViewportChange={(nextViewport) =>
          setViewport(nextViewport)
        }
      >
        {geolocationDeliveryJson && (
          <Marker
            latitude={geolocationDeliveryJson.latitude}
            longitude={geolocationDeliveryJson.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <BsGeo
              style={{
                transform: `scale(${deliverySize(viewport.zoom)})`,
                cursor: 'pointer',
                color: 'green',
              }}
            />
            Entrega
          </Marker>
        )}
        {domiciliaryPosition && (
          <>
            <Marker
              latitude={domiciliaryPosition.coordinates.lat}
              longitude={domiciliaryPosition.coordinates.lng}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <FaRegPaperPlane
                style={{
                  transform: `scale(${domiciliarySize(viewport.zoom)})`,
                  cursor: 'pointer',
                  color: 'blue',
                }}
              />
              {" "}
              {" "}
              Domiciliario
            </Marker>
          </>
        )}
      </ReactMapGL>
    </>
  );
};
