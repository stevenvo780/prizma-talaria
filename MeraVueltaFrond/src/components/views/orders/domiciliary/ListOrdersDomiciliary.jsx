import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { BsCheckLg, BsXLg } from 'react-icons/bs';

import {
  getAllOrdersByUserDomiciliaryAction,
  updateOrderAction,
  searchOrdersAction
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

  const handleKeyPress = (target) => {
    if (target.charCode == 13) {
      search();
    }
  }
  return (
    <>
      <div>
        <div style={{ overflowY: 'scroll' }}>
          <Input
            type="text"
            id="buscar"
            placeholder="Buscar"
            onChange={(e) => handleChangeWord(e, e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-views-standard"
          />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Aceptar</th>
                <th scope="col">Cancelar</th>
                <th scope="col">Número Entrega</th>
                <th scope="col">Número Compra</th>
                <th scope="col">Nombres</th>
                <th scope="col">Apellidos</th>
                <th scope="col">Telefono Cliente</th>
                <th scope="col">Fecha Creación</th>
                <th scope="col">Dirección Entrega</th>
                <th scope="col">Departamento</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Barrio</th>
                <th scope="col">Nombre Conjunto Residencial</th>
                <th scope="col">Número De Casa O Apto</th>
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
                      color="success"
                      onClick={(e) => {
                        accept(e, order.deliveryNumber);
                      }}
                    >
                      <BsCheckLg size={20} />
                    </Button>
                  </td>
                  <td>
                    <Button color="secondary">
                      <BsXLg size={20} />
                    </Button>
                  </td>
                  <td>{order.deliveryNumber}</td>
                  <td>{order.purchaseNumber}</td>
                  <td>{order.name}</td>
                  <td>{order.lastName}</td>
                  <td>{order.creationDate}</td>
                  <td>{order.prefix ? "+" : ""}{order.prefix} {order.clientPhone}</td>
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
    </>
  );
};
export default ListOrdersDomiciliary;
