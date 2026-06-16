import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFromDealerByCompanyAction,
  searchAllOrdersAction,
} from '../../../../store/reducer';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { FaRegPaperPlane } from 'react-icons/fa';
import getCenter from 'geolib/es/getCenter';
import {
  Button,
} from "reactstrap";

import './style.css';

export const MapAllDealer = () => {
  const dispatch = useDispatch();

  const positionsDomiciliary = useSelector(
    (state) => state.domiciliary.dealersPositions
  );
  const [centralPoint, setCentralPoint] = useState(null);

  const [initialLoad, setInitialLoad] = useState(true);

  const [domiciliaryPosition, setDomiciliaryPosition] =
    useState([]);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: "78vh",
    latitude: 6.253817,
    longitude: -75.576694,
    zoom: 11,
  });

  const getPositionDomiciliary = () => {
    if (positionsDomiciliary.length > 0) {
      let centralPoints = [];
      for (let index = 0; index < positionsDomiciliary.length; index++) {
        const positionDomiciliary = positionsDomiciliary[index];
        let finalPositionDomiciliary = JSON.parse(
          positionDomiciliary.position.position
        );
        centralPoints.push({ latitude: finalPositionDomiciliary.latitude, longitude: finalPositionDomiciliary.longitude });
      }
      setCentralPoint(getCenter(centralPoints));
      setDomiciliaryPosition(centralPoints);
    }
  };

  useEffect(() => {
    if (centralPoint && initialLoad === true) {
      setViewport({
        width: '100%',
        height: "78vh",
        latitude: centralPoint.latitude,
        longitude: centralPoint.longitude,
        zoom: 12,
      });
      setInitialLoad(false);
    }
  }, [centralPoint]);

  useEffect(() => {
    getPositionDomiciliary()
  }, [positionsDomiciliary]);

  useEffect(() => {
    dispatch(getFromDealerByCompanyAction());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(getFromDealerByCompanyAction());
    }, 20000);
    return () => clearInterval(timer);
  }, []);
  const domiciliarySize = (zoom) => zoom * 0.1;
  const [selectedDomiciliary, setSelectedDomiciliary] = useState(null);
  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
        onViewportChange={(nextViewport) =>
          setViewport(nextViewport)
        }
      >
        {(domiciliaryPosition.length > 0 && positionsDomiciliary.length > 0) && (
          <>
            {domiciliaryPosition.map((domiciliary, index) => (
              <div key={index}>
                <Marker
                  latitude={domiciliary.latitude}
                  longitude={domiciliary.longitude}
                  offsetLeft={-20}
                  offsetTop={-10}
                >
                  <FaRegPaperPlane
                    onClick={() => setSelectedDomiciliary({
                      latitude: domiciliary.latitude,
                      longitude: domiciliary.longitude,
                      domiciliary: positionsDomiciliary[index]?.domiciliaryCompany.domiciliary,
                      status: positionsDomiciliary[index].status
                    })}
                    style={{
                      transform: `scale(${domiciliarySize(viewport.zoom)})`,
                      cursor: 'pointer',
                      color: '#095169',
                    }}
                  />
                  {" "}
                  {" "}
                  {positionsDomiciliary[index]?.domiciliaryCompany.domiciliary.name} {positionsDomiciliary[index]?.domiciliaryCompany.domiciliary.lastName}
                </Marker>
              </div>
            ))}
            {selectedDomiciliary && (
              <Popup
                latitude={selectedDomiciliary.latitude}
                longitude={selectedDomiciliary.longitude}
                onClose={() => setSelectedDomiciliary(null)}
                closeOnClick={false}
                closeButton={true}
                tipSize={5}
              >
                <div>
                  <h5>{selectedDomiciliary.domiciliary.name} {selectedDomiciliary.domiciliary.lastName}</h5>
                  <p>Asignadas: {selectedDomiciliary.status.WAIT_EXIT}</p>
                  <p>En ruta: {selectedDomiciliary.status.AGREE}</p>
                  <p>En curso: {selectedDomiciliary.status.EXIT}</p>
                  <p>Entregadas: Hoy: {selectedDomiciliary.status.DELIVERED_TODAY} / Siempre: {selectedDomiciliary.status.DELIVERED}</p>
                  <Button style={{ zIndex: 100 }} color="primary" onClick={(e) => {
                    e.preventDefault();
                    dispatch(searchAllOrdersAction({
                      word: selectedDomiciliary.domiciliary.documentNumber,
                      take: 50,
                      skip: 0,
                    }));
                  }}>Ver pedidos</Button>
                </div>
              </Popup>
            )}
          </>
        )}
      </ReactMapGL>
    </>
  );
};
