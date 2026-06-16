import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Table, Thead, Tbody, Tr, Th, Td, TableWrap } from 'prizma-ui';
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
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  <Th>URL</Th>
                  <Th scope="col">Número Entrega</Th>
                  <Th scope="col">Número Compra</Th>
                  <Th scope="col">Email</Th>
                  <Th scope="col">Nombres</Th>
                  <Th scope="col">Apellidos</Th>
                  <Th scope="col">Documento</Th>
                  <Th scope="col">Tipo de documento</Th>
                  <Th scope="col">Fecha Creación</Th>
                  <Th scope="col">Telefono Cliente</Th>
                  <Th scope="col">Dirección Recogida</Th>
                  <Th scope="col">Ubicación Recogida</Th>
                  <Th scope="col">Dirección Entrega</Th>
                  <Th scope="col">Departamento</Th>
                  <Th scope="col">Ciudad</Th>
                  <Th scope="col">Barrio</Th>
                  <Th scope="col">Nombre Conjunto Residencial</Th>
                  <Th scope="col">Número De Casa O Apto</Th>
                  <Th scope="col">Paquete A Entregar</Th>
                  <Th scope="col">Estado Pedido</Th>
                  <Th scope="col">Nota Domiciliario</Th>
                  <Th scope="col">Tipo de pago</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order, i) => (
                  <Tr key={i}>
                    <Td>
                      <Button
                        variant="ghost"
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
                    </Td>
                    <Td>{order.deliveryNumber}</Td>
                    <Td>{order.purchaseNumber}</Td>
                    <Td>{order.email}</Td>
                    <Td>{order.name}</Td>
                    <Td>{order.lastName}</Td>
                    <Td>{order.documentNumber}</Td>
                    <Td>{order.typeDocument}</Td>
                    <Td>{order.creationDate}</Td>
                    <Td>{order.prefix ? "+" : ""}{order.prefix} {order.clientPhone}</Td>
                    <Td>{order.pickupAddress}</Td>
                    <Td>{order.pickupLocation}</Td>
                    <Td>{order.department}</Td>
                    <Td>{order.city}</Td>
                    <Td>{order.neighborhood}</Td>
                    <Td>{order.residentialGroupName}</Td>
                    <Td>{order.houseNumberOrApartment}</Td>
                    <Td>{order.deliveryPacket}</Td>
                    <Td>{order.orderState}</Td>
                    <Td>{order.domiciliary}</Td>
                    <Td>{order.deliveryNote}</Td>
                    <Td>{order.paymentMethod}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        </div>
      </div>
      <URLModal
        toggle={toggleUrl}
        handleChange={() => setToggleUrl(false)}
        url={activeLink}
      />
    </>
  );
};

const URLModal = (props) => {
  const { toggle, handleChange, url } = props;
  return (
    <Modal
      open={toggle}
      onClose={handleChange}
      title="URL de la orden"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={handleChange}>
            Cerrar
          </Button>
        </div>
      }
    >
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
    </Modal>
  );
};

export default ListOrdersDomiciliaryFinished;
