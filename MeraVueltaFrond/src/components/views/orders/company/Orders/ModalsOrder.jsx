import React from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx/xlsx";
import {
  Button,
  ButtonGroup,
  Modal,
  Input,
  Alert,
  Card,
  CardBody,
} from 'prizma-ui';
import {
  Row,
  Col,
} from 'reactstrap';
import ReactSelect from 'react-select';
import {
  createOrderMassiveAction,
} from '../../../../../store/reducer';
import {
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import moment from 'moment';
import { FiMapPin } from 'react-icons/fi';

const parseJSON = (str, defaultValue = {}) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('Invalid JSON in order data:', e);
    return defaultValue;
  }
};

export const ModalDetailOrder = (props) => {
  const { toggle, handleChange, order } = props;

  // Defensive check for order structure
  if (!order || typeof order !== 'object') {
    return (
      <Modal
        open={toggle}
        onClose={handleChange}
        title="Error: Orden inválida"
      >
        <p>No se pudo cargar la información de la orden.</p>
      </Modal>
    );
  }

  const state = (order) => {
    if (!order || typeof order !== 'object') {
      return "Estado desconocido";
    }
    const orderState = order.orderState;
    if (orderState === "EsperaDespacho") {
      return "En entrega";
    } else if (orderState === "EsperaSalida") {
      return "Asignada";
    } else if (orderState === "Aceptada") {
      return "En ruta";
    } else if (orderState === "Salida") {
      return "En curso";
    } else if (orderState === "Entregada") {
      return "Finalizada";
    } else if (orderState === "Rechazada") {
      return "Rechazada";
    } else if (orderState === "Compra") {
      return "Orden de compra";
    } else {
      return `Orden de compra (${orderState || "sin estado"})`;
    }
  }

  return (
    <Modal
      open={toggle}
      onClose={handleChange}
      title={<span># Compra: {order.purchaseNumber} - {state(order)}</span>}
      style={{ maxWidth: '90vw', width: '900px' }}
    >
      <Col sm={12}>
        <Card style={{ width: '100%', height: '90%' }}>
          <CardBody style={{ width: '100%' }}>
            <Row>
              {order.pickupPicture != null ? (
                <>
                  <Col xs={12} sm={6}>
                    <img
                      src={order.pickupPicture}
                      alt="Foto de recolección"
                      style={{ width: '100%', height: 'auto', marginBottom: '1rem' }}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <div>
                      {(order.deliveryNumber != null) && (
                        <>
                          <p>
                            URL: <a href={`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`} target="_blank" rel="noopener noreferrer">
                              {`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`}
                            </a>
                          </p>
                          <p>#Entrega: {order.deliveryNumber}</p>
                          <p>Domiciliario: {order.domiciliary?.name}</p>
                        </>
                      )}
                      <p>Nombre: {order.name}  {" "}   {order.lastName}</p>
                      <p>Teléfono: <a href={`https://wa.me/${order.prefix}${order.clientPhone}`} target="_blank" rel="noopener noreferrer">+{order.prefix} {order.clientPhone}</a></p>
                      <p>Paquete: {order.deliveryPacket}</p>
                      {(order.geolocationDelivery != null) && (
                        (() => {
                          const geoDeliveryObj = parseJSON(order.geolocationDelivery);
                          return geoDeliveryObj?.latitude && geoDeliveryObj?.longitude ? (
                            <p>
                              Geolocalización de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${geoDeliveryObj.latitude},${geoDeliveryObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                            </p>
                          ) : (
                            <p>Geolocalización no disponible</p>
                          );
                        })()
                      )}
                      {(order.deliveryAddress != null) && (
                        <p>
                          Dirección de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.deliveryAddress}</a>
                        </p>
                      )}
                      {(order.pickupLocation != null) && (
                        (() => {
                          const pickupLocationObj = parseJSON(order.pickupLocation);
                          return pickupLocationObj?.latitude && pickupLocationObj?.longitude ? (
                            <p>
                              Ubicación de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${pickupLocationObj.latitude},${pickupLocationObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                            </p>
                          ) : (
                            <p>Ubicación no disponible</p>
                          );
                        })()
                      )}
                      {(order.pickupAddress != null) && (
                        <p>
                          Dirección de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.pickupAddress}</a>
                        </p>
                      )}
                      <p>Departamento: {order.department}</p>
                      <p>Ciudad: {order.city}</p>
                      <p>Barrio: {order.neighborhood}</p>
                      <p>Grupo residencial: {order.residentialGroupName}</p>
                      <p>Número de casa o apartamento: {order.houseNumberOrApartment}</p>
                      <p>Estado: {state(order)}</p>
                      <p>Fecha de creación: {moment(order.creationDate).format('HH:mm:ss YYYY/MM/DD')}</p>
                      <p>Ultima Actualización: {moment(order.updatedAt).format('HH:mm:ss YYYY/MM/DD')}</p>
                      {(order.deliveryNote != null) && (<p>Nota de entrega: {order.deliveryNote}</p>)}
                      {(order.paymentMethod != null) && (<p>Metodo de pago: {order.paymentMethod}</p>)}
                      {(order.email != null) && (<p>Email: {order.email}</p>)}
                      {(order.documentNumber != null) && (<p>Documento: {order.documentNumber}</p>)}
                      {(order.documentNumber != null) && (<p>Tipo de documento: {order.typeDocument}</p>)}
                      {(order.pickupTime != null) && (<p>Hora de recolección: {order.pickupTime}</p>)}
                      {(order.dealerNote != null) && (<p>Nota del distribuidor: {order.dealerNote}</p>)}
                    </div>
                  </Col>
                </>
              ) : (
                <Col xs={12}>
                  <Row>
                    <Col xs={12} sm={6}>
                      <div>
                        {(order.deliveryNumber != null) && (
                          <>
                            <p>
                              URL: <a href={`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`} target="_blank" rel="noopener noreferrer">
                                {`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`}
                              </a>
                            </p>
                            <p>#Entrega: {order.deliveryNumber}</p>
                            <p>Domiciliario: {order.domiciliary?.name}</p>
                          </>
                        )}
                        <p>Nombre: {order.name}  {" "}   {order.lastName}</p>
                        <p>Teléfono: <a href={`https://wa.me/${order.prefix}${order.clientPhone}`} target="_blank" rel="noopener noreferrer">+{order.prefix} {order.clientPhone}</a></p>
                        <p>Paquete: {order.deliveryPacket}</p>
                        <p>Departamento: {order.department}</p>
                        <p>Ciudad: {order.city}</p>
                        <p>Barrio: {order.neighborhood}</p>
                        <p>Grupo residencial: {order.residentialGroupName}</p>
                        <p>Número de casa o apartamento: {order.houseNumberOrApartment}</p>
                      </div>
                    </Col>
                    <Col xs={12} sm={6}>
                      {(order.geolocationDelivery != null) && (
                        (() => {
                          const geoDeliveryObj = parseJSON(order.geolocationDelivery);
                          return geoDeliveryObj?.latitude && geoDeliveryObj?.longitude ? (
                            <p>
                              Geolocalización de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${geoDeliveryObj.latitude},${geoDeliveryObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                            </p>
                          ) : (
                            <p>Geolocalización no disponible</p>
                          );
                        })()
                      )}
                      {(order.deliveryAddress != null) && (
                        <p>
                          Dirección de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.deliveryAddress}</a>
                        </p>
                      )}
                      {(order.pickupLocation != null) && (
                        (() => {
                          const pickupLocationObj = parseJSON(order.pickupLocation);
                          return pickupLocationObj?.latitude && pickupLocationObj?.longitude ? (
                            <p>
                              Ubicación de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${pickupLocationObj.latitude},${pickupLocationObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                            </p>
                          ) : (
                            <p>Ubicación no disponible</p>
                          );
                        })()
                      )}
                      {(order.pickupAddress != null) && (
                        <p>
                          Dirección de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.pickupAddress}</a>
                        </p>
                      )}
                      <p>Estado: {state(order)}</p>
                      <p>Fecha de creación: {moment(order.creationDate).format('HH:mm:ss YYYY/MM/DD')}</p>
                      <p>Ultima Actualización: {moment(order.updatedAt).format('HH:mm:ss YYYY/MM/DD')}</p>
                      {(order.deliveryNote != null) && (<p>Nota de entrega: {order.deliveryNote}</p>)}
                      {(order.paymentMethod != null) && (<p>Metodo de pago: {order.paymentMethod}</p>)}
                      {(order.email != null) && (<p>Email: {order.email}</p>)}
                      {(order.documentNumber != null) && (<p>Documento: {order.documentNumber}</p>)}
                      {(order.documentNumber != null) && (<p>Tipo de documento: {order.typeDocument}</p>)}
                      {(order.pickupTime != null) && (<p>Hora de recolección: {order.pickupTime}</p>)}
                      {(order.dealerNote != null) && (<p>Nota del distribuidor: {order.dealerNote}</p>)}
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Modal>
  );
};

export const URLModal = (props) => {
  const { toggle, handleChange, handleCreateSheetOrder } = props;
  return (
    <Modal
      open={toggle}
      onClose={handleChange}
      title="¿Estas seguro de crear esta orden?"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              handleCreateSheetOrder();
              handleChange();
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              handleChange();
            }}
          >
            Cancelar
          </Button>
        </div>
      }
    />
  );
};

export const PurchaseNumberAddModal = (props) => {
  const {
    handleChange,
    handleClose,
    toggle,
    handleChangePurchaseNumber,
    handleChangePhoneNumber,
    handlePrefixChange,
    prefixClientPhone,
    phoneNumberModal,
  } = props;
  const [error, setError] = React.useState(null);
  const handleSave = async (e) => {
    e.preventDefault();
    if (phoneNumberModal && phoneNumberModal.length > 0) {
      if (phoneNumberModal.length < 10) {
        setError('El numero Movil debe tener 10 dígitos');
        return;
      }
    }
    const result = await handleChange();
    if (typeof result === 'string') {
      setError(result);
    } else {
      setError(false);
    }
  };
  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={(e) => handleSave(e)}>
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </div>
      }
    >
      <p>Añada el numero de compra</p>
      <Input
        type="number"
        id="purchaseNumber"
        placeholder="Numero de compra"
        name="purchaseNumber"
        onChange={handleChangePurchaseNumber}
      />
      <br />
      <p>Puedes opcionalmente añadir el numero del cliente y se le enviara la URL para que llene su vuelta</p>
      <Row>
        <Col sm={5}>
          <ReactSelect
            onChange={handlePrefixChange}
            value={(prefixClientPhone) ? prefixClientPhone : {
              value: '57',
              label: 'Colombia +57',
            }}
            inputProps={{ autoComplete: 'off' }}
            required
            placeholder="Prefijo"
            options={[
              {
                value: '57',
                label: 'Colombia +57',
              },
            ]}
          />
        </Col>
        <Col sm={5}>
          <Input
            type="number"
            id="phoneNumber"
            placeholder="Numero celular del cliente"
            name="phoneNumber"
            onChange={handleChangePhoneNumber}
          />
        </Col>
      </Row>
      {error && (
        <>
          <br />
          <Alert tone="danger">{error}</Alert>
        </>
      )}
    </Modal>
  );
};

export const UploadFileModal = (props) => {
  const dispatch = useDispatch();
  const { handleClose, toggle } = props;

  function handleExcelFile(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array" });
      let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(firstSheet);
      if (json.length > 2000) {
        alert('Solo se pueden subir 2000 ordenes a la vez');
        return;
      }
      for (let i = 0; i < json.length; i++) {
        const dataJson = json[i];
        for (let j = 0; j < Object.keys(dataJson).length; j++) {
          const key = Object.keys(dataJson)[j];
          json[i][key] = dataJson[key].toString();
        }
      }
      dispatch(createOrderMassiveAction({ orders: json }));
      e.target.files = null;
      handleClose();
    };
  }
  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Ordenes masivas"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <a href={process.env.REACT_APP_URL_FORMAT_MASSIVE_ORDERS} download>
              <Button variant="secondary">Descargar archivo</Button>{' '}
            </a>
          </div>
          <div>
            <input
              type="file"
              id="excel-file"
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
            />
            <Button
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("excel-file").value = "";
                document.getElementById("excel-file").click();
                document.getElementById("excel-file").onchange = handleExcelFile;
              }}
            >
              Subir varias ordenes
            </Button>
          </div>
        </div>
      }
    >
      <p>Para subir un archivo de excel con varias ordenes, por favor descargue el formato y llénalo con los datos de las ordenes que desea crear.</p>
      <p>Solo puedes subir de a 2000 ordenes a la ves</p>
      <p>Una vez llenado el archivo, por favor súbalo con el botón de subir varias ordenes</p>
    </Modal>
  );
};

export const UploadFileResultModal = (props) => {
  const { handleClose, toggle, orderMassiveResult } = props;
  const [createdOrders, setCreatedOrders] = React.useState(0);
  const [otherStatusOrders, setOtherStatusOrders] = React.useState(0);

  React.useEffect(() => {
    let created = 0;
    let otherStatus = 0;

    orderMassiveResult.forEach((item) => {
      if (
        item.status.toLowerCase() === 'creada' ||
        item.status.toLowerCase() === 'borrada' ||
        item.status.toLowerCase() === 'actualizada' ||
        item.status.toLowerCase() === 'orden ya existe'
      ) {
        created++;
      } else {
        otherStatus++;
      }
    });

    setCreatedOrders(created);
    setOtherStatusOrders(otherStatus);
  }, [orderMassiveResult]);

  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Ordenes masivas"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        </div>
      }
    >
      <div
        style={{
          height: '40vh',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {orderMassiveResult.map((item, i) => (
          <p key={i}>
            Estado: {item.status} <br />
            Número de compra: {item.order.purchaseNumber}
            {item.order.purchaseNumber == null && (
              <>
                Número de entrega: {item.order?.deliveryNumber}
              </>
            )}
          </p>
        ))}
      </div>
      <hr />
      <div style={{ width: '100%' }}>
        <p>Ordenes exitosas: {createdOrders}</p>
        <p>Ordenes con error: {otherStatusOrders}</p>
      </div>
    </Modal>
  );
};

export const SaveOrderModal = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={handleChange}>
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </div>
      }
    >
      <p>¿Estás seguro/a de crear las ordenes?</p>
    </Modal>
  );
};

export function PaginationButtons({ handlePage, margin }) {
  return (
    <div className="float-right">
      <ButtonGroup style={{ margin: margin }}>
        <Button
          variant="secondary"
          aria-label="Página anterior"
          style={{ margin: margin, marginRight: "1px" }}
          onClick={() => handlePage("previous")}
        >
          <BsChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          aria-label="Página siguiente"
          onClick={() => handlePage("next")}
          className="ml-auto"
          style={{ margin: margin }}
        >
          <BsChevronRight aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const ModalConfirmationDelete = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={handleChange}>
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </div>
      }
    >
      <p>¿Estás seguro/a de que desea eliminar?</p>
    </Modal>
  );
};

export const DeleteDomiciliaryModal = (props) => {
  const { handleChange, handleClose, toggle, deleteDomiciliary } = props;
  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              handleChange(deleteDomiciliary);
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <p>¿Estás seguro/a de que desea remover el domiciliario?</p>
    </Modal>
  );
};

const validateFormAllData = (order) => {
  if (
    order.deliveryNumber &&
    order.purchaseNumber &&
    order.name &&
    order.lastName &&
    order.clientPhone &&
    order.creationDate &&
    order.department &&
    order.city &&
    order.neighborhood &&
    order.residentialGroupName &&
    order.houseNumberOrApartment &&
    order.geolocationDelivery &&
    order.pickupAddress &&
    order.deliveryAddress &&
    order.orderState
  ) {
    return true;
  } else {
    return false;
  }
}

const validateAssignDomiciliary = (order) => {
  if (
    order.deliveryNumber &&
    order.purchaseNumber &&
    order.department &&
    order.city &&
    order.pickupAddress &&
    order.deliveryAddress &&
    order.deliveryPacket &&
    order.orderState
  ) {
    return true;
  } else {
    return false;
  }
}

export const validateMany = (selectedOrders) => {
  let validate = 0;
  if (selectedOrders.length > 0) {
    for (let index = 0; index < selectedOrders.length; index++) {
      const order = selectedOrders[index];
      if (validateAssignDomiciliary(order)) {
        validate++;
      }
    }
  }
  if (validate === selectedOrders.length) {
    return true;
  } else {
    return false;
  }
};

export const color = (order) => {
  if (validateAssignDomiciliary(order)) {
    return "success";
  } else if (validateFormAllData(order)) {
    return "warning";
  } else {
    return "primary";
  }
};
