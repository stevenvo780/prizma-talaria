import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { Button } from 'reactstrap';
import { getOrderByDeliveryNumberAction } from '../../../../store/reducer';
import ReactMapGL, { Marker } from 'react-map-gl';
import { BsGeoFill } from 'react-icons/bs';
import './style.css';

const markerSize = (zoom) => zoom * 0.2;
export const MapOrderDealerFinish = (props) => {
  const dispatch = useDispatch();

  const deliveryNumber = props.match.params.id;
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );

  const [domiciliaryPosition, setDomiciliaryPosition] =
    useState(null);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: screen.height,
    latitude: 6.253817,
    longitude: -75.576694,
    zoom: 11,
  });

  const getPositionDomiciliary = () => {
    if (orderByDeliveryNumber) {
      let finalPositionDomiciliary = JSON.parse(
        orderByDeliveryNumber.pickupLocation
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
      if (!domiciliaryPosition) {
        setViewport({
          width: '100%',
          height: screen.height,
          latitude: finalPositionDomiciliary.latitude,
          longitude: finalPositionDomiciliary.longitude,
          zoom: 13,
        });
      }
      setDomiciliaryPosition(domiciliaryPositionState);
    }
  };
  useEffect(() => {
    dispatch(getOrderByDeliveryNumberAction(deliveryNumber));
  }, [dispatch]);
  useEffect(() => {
    getPositionDomiciliary();
  }, [orderByDeliveryNumber]);

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
          e.preventDefault;
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
        {domiciliaryPosition && (
          <>
            <Marker
              latitude={domiciliaryPosition.coordinates.lat}
              longitude={domiciliaryPosition.coordinates.lng}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <BsGeoFill
                style={{
                  transform: `scale(${markerSize(viewport.zoom)})`,
                  cursor: 'pointer',
                }}
              />
            </Marker>
          </>
        )}
      </ReactMapGL>
    </>
  );
};
