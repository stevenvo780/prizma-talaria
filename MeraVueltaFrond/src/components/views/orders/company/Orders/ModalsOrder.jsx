import React from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx/xlsx";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Alert,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Container,
} from 'reactstrap';
import Select from 'react-select';
import {
  createOrderMassiveAction,
} from '../../../../../store/reducer';
import {
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import moment from 'moment';
import { FiMapPin } from 'react-icons/fi';

export const ModalDetailOrder = (props) => {
  const { toggle, handleChange, order } = props;
  const state = (order) => {
    if (order.orderState === "EsperaDespacho") {
      return "En entrega";
    } else if (order.orderState === "EsperaSalida") {
      return "Asignada";
    } else if (order.orderState === "Aceptada") {
      return "En ruta";
    } else if (order.orderState === "Salida") {
      return "En curso";
    } else if (order.orderState === "Entregada") {
      return "Finalizada";
    } else {
      return "Ordenen de compra";
    }
  }

  return (
    <Modal isOpen={toggle} toggle={handleChange} size="xl">
      <ModalHeader
        toggle={handleChange}
      >
        <span># Compra: {order.purchaseNumber} - {state(order)}</span>
      </ModalHeader>
      <ModalBody>
        <Col sm={12}>
          <Card className="my-2" style={{ width: '100%', height: '90%' }}>
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
                      <CardText>
                        {(order.deliveryNumber != null) && (
                          <>
                            <CardText>
                              URL: <a href={`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`} target="_blank">
                                {`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`}
                              </a>
                            </CardText>
                            <CardText>
                              #Entrega: {order.deliveryNumber}
                            </CardText>
                            <CardText>
                              Domiciliario: {order.domiciliary?.name}
                            </CardText>
                          </>
                        )}
                        <CardText>
                          Nombre: {order.name}  {" "}   {order.lastName}
                        </CardText>
                        <CardText>
                          Teléfono: <a href={`https://wa.me/${order.prefix}${order.clientPhone}`} target="_blank" rel="noopener noreferrer">+{order.prefix} {order.clientPhone}</a>
                        </CardText>
                        <CardText>
                          Paquete: {order.deliveryPacket}
                        </CardText>
                        {(order.geolocationDelivery != null) && (
                          (() => {
                            const geoDeliveryObj = JSON.parse(order.geolocationDelivery);
                            return (
                              <CardText>
                                Geolocalización de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${geoDeliveryObj.latitude},${geoDeliveryObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                              </CardText>
                            );
                          })()
                        )}
                        {(order.deliveryAddress != null) && (
                          <CardText>
                            Dirección de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.deliveryAddress}</a>
                          </CardText>
                        )}

                        {(order.pickupLocation != null) && (
                          (() => {
                            const pickupLocationObj = JSON.parse(order.pickupLocation);
                            return (
                              <CardText>
                                Ubicación de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${pickupLocationObj.latitude},${pickupLocationObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                              </CardText>
                            );
                          })()
                        )}
                        {(order.pickupAddress != null) && (
                          <CardText>
                            Dirección de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.pickupAddress}</a>
                          </CardText>
                        )}
                        <CardText>
                          Departamento: {order.department}
                        </CardText>
                        <CardText>
                          Ciudad: {order.city}
                        </CardText>
                        <CardText>
                          Barrio: {order.neighborhood}
                        </CardText>
                        <CardText>
                          Grupo residencial: {order.residentialGroupName}
                        </CardText>
                        <CardText>
                          Número de casa o apartamento: {order.houseNumberOrApartment}
                        </CardText>
                        <CardText>
                          Estado: {state(order)}
                        </CardText>
                        <CardText>
                          Fecha de creación: {moment(order.creationDate).format('HH:mm:ss YYYY/MM/DD')}
                        </CardText>
                        <CardText>
                          Ultima Actualización: {moment(order.updatedAt).format('HH:mm:ss YYYY/MM/DD')}
                        </CardText>
                        {(order.deliveryNote != null) && (
                          <CardText>
                            Nota de entrega: {order.deliveryNote}
                          </CardText>
                        )}
                        {(order.paymentMethod != null) && (
                          <CardText>
                            Metodo de pago: {order.paymentMethod}
                          </CardText>
                        )}
                        {(order.email != null) && (
                          <CardText>
                            Email: {order.email}
                          </CardText>
                        )}
                        {(order.documentNumber != null) && (
                          <CardText>
                            Documento: {order.documentNumber}
                          </CardText>
                        )}
                        {(order.documentNumber != null) && (
                          <CardText>
                            Tipo de documento: {order.typeDocument}
                          </CardText>
                        )}
                        {(order.pickupTime != null) && (
                          <CardText>
                            Hora de recolección: {order.pickupTime}
                          </CardText>
                        )}
                        {(order.dealerNote != null) && (
                          <CardText>
                            Nota del distribuidor: {order.dealerNote}
                          </CardText>
                        )}
                      </CardText>
                    </Col>
                  </>
                ) : (
                  <Col xs={12}>
                    <Row>
                      <Col xs={12} sm={6}>
                        <CardText>
                          {(order.deliveryNumber != null) && (
                            <>
                              <CardText>
                                URL: <a href={`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`} target="_blank">
                                  {`${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`}
                                </a>
                              </CardText>
                              <CardText>
                                #Entrega: {order.deliveryNumber}
                              </CardText>
                              <CardText>
                                Domiciliario: {order.domiciliary?.name}
                              </CardText>
                            </>
                          )}
                          <CardText>
                            Nombre: {order.name}  {" "}   {order.lastName}
                          </CardText>
                          <CardText>
                            Teléfono: <a href={`https://wa.me/${order.prefix}${order.clientPhone}`} target="_blank" rel="noopener noreferrer">+{order.prefix} {order.clientPhone}</a>
                          </CardText>
                          <CardText>
                            Paquete: {order.deliveryPacket}
                          </CardText>
                          <CardText>
                            Departamento: {order.department}
                          </CardText>
                          <CardText>
                            Ciudad: {order.city}
                          </CardText>
                          <CardText>
                            Barrio: {order.neighborhood}
                          </CardText>
                          <CardText>
                            Grupo residencial: {order.residentialGroupName}
                          </CardText>
                          <CardText>
                            Número de casa o apartamento: {order.houseNumberOrApartment}
                          </CardText>
                        </CardText>
                      </Col>
                      <Col xs={12} sm={6}>
                        {(order.geolocationDelivery != null) && (
                          (() => {
                            const geoDeliveryObj = JSON.parse(order.geolocationDelivery);
                            return (
                              <CardText>
                                Geolocalización de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${geoDeliveryObj.latitude},${geoDeliveryObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                              </CardText>
                            );
                          })()
                        )}
                        {(order.deliveryAddress != null) && (
                          <CardText>
                            Dirección de entrega: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.deliveryAddress}</a>
                          </CardText>
                        )}

                        {(order.pickupLocation != null) && (
                          (() => {
                            const pickupLocationObj = JSON.parse(order.pickupLocation);
                            return (
                              <CardText>
                                Ubicación de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${pickupLocationObj.latitude},${pickupLocationObj.longitude}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> Ver en Google Maps</a>
                              </CardText>
                            );
                          })()
                        )}
                        {(order.pickupAddress != null) && (
                          <CardText>
                            Dirección de recolección: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`} target="_blank" rel="noopener noreferrer"><FiMapPin /> {order.pickupAddress}</a>
                          </CardText>
                        )}
                        <CardText>
                          Estado: {state(order)}
                        </CardText>
                        <CardText>
                          Fecha de creación: {moment(order.creationDate).format('HH:mm:ss YYYY/MM/DD')}
                        </CardText>
                        <CardText>
                          Ultima Actualización: {moment(order.updatedAt).format('HH:mm:ss YYYY/MM/DD')}
                        </CardText>
                        {(order.deliveryNote != null) && (
                          <CardText>
                            Nota de entrega: {order.deliveryNote}
                          </CardText>
                        )}
                        {(order.paymentMethod != null) && (
                          <CardText>
                            Metodo de pago: {order.paymentMethod}
                          </CardText>
                        )}
                        {(order.email != null) && (
                          <CardText>
                            Email: {order.email}
                          </CardText>
                        )}
                        {(order.documentNumber != null) && (
                          <CardText>
                            Documento: {order.documentNumber}
                          </CardText>
                        )}
                        {(order.documentNumber != null) && (
                          <CardText>
                            Tipo de documento: {order.typeDocument}
                          </CardText>
                        )}
                        {(order.pickupTime != null) && (
                          <CardText>
                            Hora de recolección: {order.pickupTime}
                          </CardText>
                        )}
                        {(order.dealerNote != null) && (
                          <CardText>
                            Nota del distribuidor: {order.dealerNote}
                          </CardText>
                        )}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export const URLModal = (props) => {
  const { toggle, handleChange, handleCreateSheetOrder } = props;
  return (
    <Modal isOpen={toggle} toggle={handleChange}>
      <ModalHeader toggle={handleChange}>
        ¿Estas seguro de crear esta orden?
      </ModalHeader>
      <ModalFooter>
        <Button
          color="success"
          onClick={(e) => {
            e.preventDefault;
            handleCreateSheetOrder();
            handleChange();
          }}
        >
          Aceptar
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            handleChange();
          }}
        >
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
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
    e.preventDefault;
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
    <Modal isOpen={toggle} toggle={handleClose}>
      <ModalHeader>Confirmar</ModalHeader>
      <ModalBody>
        Añada el numero de compra
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
            <Select
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
            <Alert color="danger">{error}</Alert>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={(e) => handleSave(e)}>
          Aceptar
        </Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export const UploadFileModal = (props) => {
  const dispatch = useDispatch();
  const { handleClose, toggle } =
    props;

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
    <Modal isOpen={toggle} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Ordenes masivas</ModalHeader>
      <ModalBody>
        <p>Para subir un archivo de excel con varias ordenes, por favor descargue el formato y llénalo con los datos de las ordenes que desea crear.</p>
        <p>Solo puedes subir de a 2000 ordenes a la ves</p>
        <p>Una vez llenado el archivo, por favor sábalo con el botón de subir varias ordenes</p>
      </ModalBody>
      <ModalFooter>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <a href={process.env.REACT_APP_URL_FORMAT_MASSIVE_ORDERS} download>
              <Button color="info">Descargar archivo</Button>{' '}
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
              color="success"
              onClick={(e) => {
                e.preventDefault;
                document.getElementById("excel-file").value = "";
                document.getElementById("excel-file").click();
                document.getElementById("excel-file").onchange = handleExcelFile;
              }}
            >
              Subir varias ordenes
            </Button>
          </div>
        </div>
      </ModalFooter>
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
    <Modal isOpen={toggle} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Ordenes masivas</ModalHeader>
      <ModalBody>
        <div
          style={{
            height: (screen.height * 40) / 100,
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
        <div
          style={{
            width: '100%',
          }}
        >
          <p>Ordenes exitosas: {createdOrders}</p>
          <p>Ordenes con error: {otherStatusOrders}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
};

export const SaveOrderModal = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <>
      <Modal isOpen={toggle} toggle={handleChange}>
        <ModalHeader toggle={handleClose}>Confirmar</ModalHeader>
        <ModalBody>
          ¿Estás seguro/a de crear las ordenes?
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleChange}>
            Aceptar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export function PaginationButtons({ handlePage, margin }) {
  return (
    <div className="float-right">
      <ButtonGroup style={{ margin: margin }}>
        <Button style={{ margin: margin, marginRight: "1px" }} color="secondary" onClick={() => handlePage("previous")}>
          <BsChevronLeft />
        </Button>
        <Button
          color="secondary"
          onClick={() => handlePage("next")}
          className="ml-auto"
          style={{ margin: margin }}
        >
          <BsChevronRight />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const ModalConfirmationDelete = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <Modal isOpen={toggle} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirmar</ModalHeader>
      <ModalBody>
        ¿Estás seguro/a de que desea eliminar?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleChange}>
          Aceptar
        </Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export const DeleteDomiciliaryModal = (props) => {
  const { handleChange, handleClose, toggle, deleteDomiciliary } = props;
  return (
    <Modal isOpen={toggle} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirmar</ModalHeader>
      <ModalBody>
        ¿Estás seguro/a de que desea remover el domiciliario?
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={(e) => {
            e.preventDefault();
            handleChange(deleteDomiciliary);
          }}
        >
          Aceptar
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault;
            handleClose();
          }}
        >
          Cancelar
        </Button>
      </ModalFooter>
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

