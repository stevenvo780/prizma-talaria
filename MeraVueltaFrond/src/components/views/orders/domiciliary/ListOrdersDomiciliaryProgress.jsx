import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Thead, Tbody, Tr, Th, Td, TableWrap } from 'prizma-ui';

import {
  getAllOrdersByUserDomiciliaryAction,
} from '../../../../store/reducer';

const ListOrdersDomiciliary = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) =>
    state.order.orders.filter(
      (order) => order.orderState === 'Salida'
    )
  );
  React.useEffect(() => {
    dispatch(getAllOrdersByUserDomiciliaryAction());
  }, [dispatch]);

  return (
    <>
      <div>
        <div style={{ overflowY: 'scroll' }}>
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
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
    </>
  );
};
export default ListOrdersDomiciliary;
