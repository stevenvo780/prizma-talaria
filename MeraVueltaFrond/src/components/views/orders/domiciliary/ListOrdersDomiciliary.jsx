import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Table, Thead, Tbody, Tr, Th, Td, TableWrap } from 'prizma-ui';
import { BsCheckLg, BsXLg } from 'react-icons/bs';

import {
  getAllOrdersByUserDomiciliaryAction,
  updateOrderAction,
  searchOrdersAction,
  addNotification
} from '../../../../store/reducer';

const ListOrdersDomiciliary = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) =>
    state.order.orders.filter(
      (order) => order.orderState === 'EsperaSalida'
    )
  );
  React.useEffect(() => {
    dispatch(getAllOrdersByUserDomiciliaryAction());
  }, [dispatch]);

  React.useEffect(() => { }, [orders]);

  const accept = (e, deliveryNumber) => {
    e.preventDefault();
    const orderByDeliveryNumber = orders.find(
      (order) => order.deliveryNumber === deliveryNumber
    );
    if (orderByDeliveryNumber) {
      let dataAPI = {
        orderState: 'Salida',
      };
      dispatch(
        updateOrderAction({
          id: orderByDeliveryNumber.deliveryNumber,
          data: dataAPI,
        })
      );
    }
  };

  const reject = (e, deliveryNumber) => {
    e.preventDefault();
    const orderByDeliveryNumber = orders.find(
      (order) => order.deliveryNumber === deliveryNumber
    );
    if (orderByDeliveryNumber) {
      let dataAPI = {
        orderState: 'Rechazada',
      };
      dispatch(
        updateOrderAction({
          id: orderByDeliveryNumber.deliveryNumber,
          data: dataAPI,
        })
      );
      dispatch(
        addNotification({
          message: `La entrega #${deliveryNumber} ha sido rechazada.`,
          color: 'info',
        })
      );
    }
  };
  const [orderWord, setOrderWord] = React.useState("");
  const search = () => {
    if (orderWord === "") {
      dispatch(getAllOrdersByUserDomiciliaryAction());
    } else {
      dispatch(searchOrdersAction(orderWord));
    }
  };
  const handleChangeWord = (e, word) => {
    e.preventDefault();
    setOrderWord(word);
  };

  const handleKeyDown = (target) => {
    if (target.key === 'Enter') {
      search();
    }
  };
  return (
    <>
      <div>
        <div style={{ overflow: 'auto' }}>
          <label htmlFor="buscar" className="sr-only">Buscar pedidos</label>
          <Input
            type="text"
            id="buscar"
            placeholder="Buscar"
            onChange={(e) => handleChangeWord(e, e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-views-standard"
          />
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  <Th scope="col">Aceptar</Th>
                  <Th scope="col">Cancelar</Th>
                  <Th scope="col">Número Entrega</Th>
                  <Th scope="col">Número Compra</Th>
                  <Th scope="col">Nombres</Th>
                  <Th scope="col">Apellidos</Th>
                  <Th scope="col">Telefono Cliente</Th>
                  <Th scope="col">Fecha Creación</Th>
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
                  <Tr key={order.deliveryNumber}>
                    <Td>
                      <Button
                        variant="primary"
                        aria-label="Aceptar entrega"
                        onClick={(e) => {
                          accept(e, order.deliveryNumber);
                        }}
                      >
                        <BsCheckLg size={20} aria-hidden="true" />
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        variant="danger"
                        aria-label="Rechazar entrega"
                        onClick={(e) => {
                          reject(e, order.deliveryNumber);
                        }}
                      >
                        <BsXLg size={20} aria-hidden="true" />
                      </Button>
                    </Td>
                    <Td>{order.deliveryNumber}</Td>
                    <Td>{order.purchaseNumber}</Td>
                    <Td>{order.name}</Td>
                    <Td>{order.lastName}</Td>
                    <Td>{order.creationDate}</Td>
                    <Td>{order.prefix ? "+" : ""}{order.prefix} {order.clientPhone}</Td>
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
    </>
  );
};
export default ListOrdersDomiciliary;
