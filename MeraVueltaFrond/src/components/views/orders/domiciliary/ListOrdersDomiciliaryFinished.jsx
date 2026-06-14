import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { getAllOrdersByUserDomiciliaryAction } from '../../../../store/reducer';

const ListOrdersDomiciliaryFinished = () => {
  const dispatch = useDispatch();
  const [toggleUrl, setToggleUrl] = React.useState(false);
  const [activeLink, setActiveLink] = React.useState(false);
  const handleCloseUrl = () => setToggleUrl(!toggleUrl);
  const orders = useSelector((state) =>
    state.order.orders.filter(
      (order) => order.orderState === 'Entregada'
    )
  );
  React.useEffect(() => {
    dispatch(getAllOrdersByUserDomiciliaryAction());
  }, [dispatch]);
  const handleSetLikn = (e, link) => {
    e.preventDefault();
    setActiveLink(link);
  };

  return (
    <>
      <div>
        <div style={{ overflowY: 'scroll' }}>
          <table className="table">
            <thead>
              <tr>
                <th>URL</th>
                <th scope="col">Número Entrega</th>
                <th scope="col">Número Compra</th>
                <th scope="col">Email</th>
                <th scope="col">Nombres</th>
                <th scope="col">Apellidos</th>
                <th scope="col">Documento</th>
                <th scope="col">Tipo de documento</th>
                <th scope="col">Fecha Creación</th>
                <th scope="col">Telefono Cliente</th>
                <th scope="col">Dirección Recogida</th>
                <th scope="col">Ubicación Recogida</th>
                <th scope="col">Dirección Entrega</th>
                <th scope="col">Departamento</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Barrio</th>
                <th scope="col">Nombre Conjunto Residencial</th>
                <th scope="col">Nuúmero De Casa O Apto</th>
                <th scope="col">Paquete A Entregar</th>
                <th scope="col">Estado Pedido </th>
                <th scope="col">Nota Domiciliario</th>
                <th scope="col">Tipo de pago</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i}>
                  <td>
                    <Button
                      color="primary"
                      onClick={(e) => {
                        handleCloseUrl();
                        handleSetLikn(
                          e,
                          `${process.env.REACT_APP_REACT_HOST}/takeOrder/${order.deliveryNumber}`
                        );
                      }}
                    >
                      ver URL
                    </Button>
                  </td>
                  <td>{order.deliveryNumber}</td>
                  <td>{order.purchaseNumber}</td>
                  <td>{order.email}</td>
                  <td>{order.name}</td>
                  <td>{order.lastName}</td>
                  <td>{order.documentNumber}</td>
                  <td>{order.typeDocument}</td>
                  <td>{order.creationDate}</td>
                  <td>{order.prefix ? "+" : ""}{order.prefix} {order.clientPhone}</td>
                  <td>{order.pickupAddress}</td>
                  <td>{order.pickupLocation}</td>
                  <td>{order.department}</td>
                  <td>{order.city}</td>
                  <td>{order.neighborhood}</td>
                  <td>{order.residentialGroupName}</td>
                  <td>{order.houseNumberOrApartment}</td>
                  <td>{order.deliveryPacket}</td>
                  <td>{order.orderState}</td>
                  <td>{order.domiciliary}</td>
                  <td>{order.deliveryNote}</td>
                  <td>{order.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <URLModal
        toggle={toggleUrl}
        handleChange={handleCloseUrl}
        url={activeLink}
      />
    </>
  );
};
const URLModal = (props) => {
  const { toggle, handleChange, url } = props;
  return (
    <Modal isOpen={toggle} toggle={handleChange}>
      <ModalHeader toggle={handleChange}>URL de la orden</ModalHeader>
      <ModalBody>
        <a href={url} target="_blank">
          {url}
        </a>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            handleChange();
          }}
        >
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
export default ListOrdersDomiciliaryFinished;
