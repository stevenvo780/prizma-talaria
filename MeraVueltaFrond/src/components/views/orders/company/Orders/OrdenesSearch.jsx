import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'prizma-ui';
import OrdersByStatusSearch from '../Orders/OrdersByStatusSearch';
import {
  searchAllOrdersAction,
} from '../../../../../store/reducer';

const OrdenesSearch = (props) => {
  const { word } = props.match.params;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState('all');
  const orders = useSelector((state) => state.order.ordersSearch);

  React.useEffect(() => {
    if (orders?.length === 0) {
      dispatch(
        searchAllOrdersAction({
          word: word,
          take: 50,
          skip: 0,
        }),
      );
    }
  }, []);

  const tabs = [
    {
      key: 'all',
      label: 'Todas',
      content: <OrdersByStatusSearch word={word} stateOrder={"all"} />,
    },
    {
      key: 'Compra',
      label: 'Compras',
      content: <OrdersByStatusSearch word={word} stateOrder={"Compra"} />,
    },
    {
      key: 'EsperaSalida',
      label: 'Asignadas',
      content: <OrdersByStatusSearch word={word} stateOrder={"EsperaSalida"} />,
    },
    {
      key: 'Aceptada',
      label: 'En ruta',
      content: <OrdersByStatusSearch word={word} stateOrder={"Aceptada"} />,
    },
    {
      key: 'Salida',
      label: 'En curso',
      content: <OrdersByStatusSearch word={word} stateOrder={"Salida"} />,
    },
    {
      key: 'Entregada',
      label: 'Finalizadas',
      content: <OrdersByStatusSearch word={word} stateOrder={"Entregada"} />,
    },
  ];

  return (
    <div>
      <Tabs
        tabs={tabs}
        value={activeTab}
        onChange={(key) => setActiveTab(key)}
      />
    </div>
  );
};

export default OrdenesSearch;
