import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  Row,
  Col,
} from 'reactstrap';
import {
  Button,
  Card,
  CardBody,
  Input,
} from 'prizma-ui';
import {
  setOrderStep,
  setOrderTabIndex,
  setVueltasTabIndex,
  searchOrdersAction,
  searchAllOrdersOrder,
  searchAllOrdersAction,
  searchOrdersByStateAllAction,
} from '../../../../../store/reducer';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { TbDirections } from "react-icons/tb";
import {
  BsEye,
} from "react-icons/bs";
import {
  ModalDetailOrder,
  PaginationButtons,
} from "./ModalsOrder";

const OrdersByStatusSearch = (props) => {
  const { word, stateOrder } = props;
  const [take, setTake] = useState(50);
  const [takeSelect, setTakeSelect] = useState(50);
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const handlePage = (direction) => {
    const newSkip = direction === "next" ? skip + take : skip - take;
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newSkip >= 0) {
      dispatch(
        searchAllOrdersAction({
          word: word,
          take: take,
          skip: newSkip,
        }),
      );
      setSkip(newSkip);
      setPage(newPage);
    }
  };
  const orders = useSelector((state) => state.order.ordersSearch);
  const dispatch = useDispatch();

  const [toggleDetail, setToggleDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const handleToggleDetail = () => setToggleDetail(!toggleDetail)

  const handleSection = (order) => {
    setOrderStep(order);
    if (order.orderState === "EsperaDespacho") {
      dispatch(searchOrdersAction({ word: word, state: "EsperaDespacho", orderQuery: false, take: take, skip: skip }));
      dispatch(push("/company/orders"));
      dispatch(setOrderTabIndex("2"));
    } else if (order.orderState === "EsperaSalida") {
      dispatch(searchOrdersAction({ word: word, state: "EsperaSalida", orderQuery: false, take: take, skip: skip }));
      dispatch(push("/company/vueltas"));
      dispatch(setVueltasTabIndex("EsperaSalida"));
    } else if (order.orderState === "Aceptada") {
      dispatch(searchOrdersAction({ word: word, state: "Aceptada", orderQuery: false, take: take, skip: skip }));
      dispatch(push("/company/vueltas"));
      dispatch(setVueltasTabIndex("Aceptada"));
    } else if (order.orderState === "Salida") {
      dispatch(searchOrdersAction({ word: word, state: "Salida", orderQuery: false, take: take, skip: skip }));
      dispatch(push("/company/vueltas"));
      dispatch(setVueltasTabIndex("Salida"));
    } else if (order.orderState === "Entregada") {
      dispatch(searchOrdersAction({ word: word, state: "Entregada", orderQuery: false, take: take, skip: skip }));
      dispatch(push("/company/vueltas"));
      dispatch(setVueltasTabIndex("Entregada"));
    } else if (order.orderState === "Compra") {
      dispatch(searchOrdersAction({ word: word, state: "Compra", orderQuery: false, take: take, skip: skip }));
      dispatch(push("/company/orders"));
      dispatch(setOrderTabIndex("1"));
    }
    handleToggleDetail();
  }

  const state = (order) => {
    if (order.orderState === "EsperaDespacho") {
      return "Entregas";
    } else if (order.orderState === "EsperaSalida") {
      return "Asignadas";
    } else if (order.orderState === "Aceptada") {
      return "En ruta";
    } else if (order.orderState === "Salida") {
      return "En curso";
    } else if (order.orderState === "Entregada") {
      return "Finalizadas";
    } else {
      return "Ordenes de compra";
    }
  }
  const [toggleDirection, setToggleDirection] = useState(false);
  const handleToggleDirection = () => {
    setToggleDirection(!toggleDirection);
    dispatch(searchAllOrdersOrder(!toggleDirection));
  }

  React.useEffect(() => {
    if (stateOrder === "all") {
      dispatch(
        searchAllOrdersAction({
          word: word,
          take: take,
          skip: skip,
        }),
      );
    }
  }, [take]);

  React.useEffect(() => {
    if (stateOrder !== "all") {
      dispatch(searchOrdersByStateAllAction({ word: word, state: stateOrder, orderQuery: false, take: take, skip: skip }));
    }
  }, [stateOrder]);

  return (
    <>
      <Row style={{ marginTop: "5px" }}>
        <Col sm={3} xs={5}>
          <h4 style={{ margin: 0 }}>{word}</h4>
        </Col>
        <Col sm={2} xs={3}>
          <h4 style={{ margin: 0 }}>#: {orders.length}</h4>
        </Col>
        <Col sm={2} xs={4}>
          <Input
            type="number"
            id="cantidad"
            placeholder="Cantidad"
            value={takeSelect}
            onChange={(count) => {
              setTakeSelect(count.target.value);
            }}
            onKeyDown={(target) => {
              if (target.key === 'Enter') {
                setTake(parseInt(takeSelect))
              }
            }}
            style={{ width: "80%", margin: 0, padding: 0, textAlign: "center" }}
          />
          <p className="sub-text-button" style={{ marginLeft: "20%" }}>Pedidos</p>
        </Col>
        <Col sm={2} xs={3} style={{ textAlign: "center" }}>
          <p>Pagina: {page}</p>
        </Col>
        <Col sm={1} xs={2}>
          <Button
            variant="secondary"
            style={{ margin: 0 }}
            onClick={(e) => { e.preventDefault(); handleToggleDirection(!toggleDirection) }}
          >
            {toggleDirection ? <FaArrowDown /> : <FaArrowUp />}
          </Button>
        </Col>
        <Col sm={2} xs={7}>
          <PaginationButtons margin={0} handlePage={handlePage} />
        </Col>
      </Row>
      <hr style={{ marginTop: "5px", marginBottom: "5px" }} />
      <Row style={{
        position: 'relative',
        height: "90vh",
        overflowY: 'auto',
        marginTop: 10
      }}>
        {orders?.map((order, i) => (
          <Col
            key={i}
            sm={4}
          >
            <Card
              style={{
                width: '100%',
                height: 'fit-content',
                maxHeight: "90%",
              }}
            >
              <div
                className="cui-card__header"
                style={{ height: "40px" }}
              >
                # Compra: {order.purchaseNumber}
              </div>
              <CardBody style={{ width: "100%" }}>
                <p style={{ marginBottom: "2px" }}>
                  Estado: {state(order)}
                </p>
                {(order.deliveryNumber != null) && (
                  <p style={{ marginBottom: "2px" }}>
                    # Entrega: {order.deliveryNumber}
                  </p>
                )}
                {(order.name != null) && (
                  <p style={{ marginBottom: "2px" }}>
                    Nombre: {order.name}  {" "}   {order.lastName}
                  </p>
                )}
                {(order.clientPhone != null) && (
                  <p style={{ marginBottom: "2px" }}>
                    Teléfono: +{order.prefix} {order.clientPhone}
                  </p>
                )}
                {(order.deliveryPacket != null) && (
                  <p style={{ marginBottom: "2px" }}>
                    Paquete: {order.deliveryPacket}
                  </p>
                )}
                {(order.domiciliary != null) && (
                  <p style={{ marginBottom: "2px" }}>
                    Domiciliario: {order.domiciliary.name} {order.domiciliary.lastName}
                  </p>
                )}
                <Row>
                  <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} sm={6} xs={6}>
                    <Button
                      variant="ghost"
                      style={{ width: "100%", height: "60%" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleDetail();
                        setOrderDetail(order);
                      }}
                      id={`detail-${i}`}
                    >
                      <BsEye size={20} className="sub-icon-button" />
                      <p className="sub-text-button">Ver</p>
                    </Button>
                  </Col>
                  <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} sm={6} xs={6}>
                    <Button
                      variant="primary"
                      style={{ width: "100%", height: "60%" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSection(order)
                      }}
                      id={`see-${i}`}
                    >
                      <TbDirections size={20} className="sub-icon-button" />
                      <p className="sub-text-button">Ir</p>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      {(orderDetail != null) && (
        <ModalDetailOrder order={orderDetail} toggle={toggleDetail} handleChange={handleToggleDetail} />
      )}
    </>
  );
};

export default OrdersByStatusSearch;
