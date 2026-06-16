import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "redux-first-history";
import ReactSelect from 'react-select';
import * as XLSX from "xlsx/xlsx";
import {
  Row,
  Col,
} from "reactstrap";
import {
  Button,
  Input,
  Card,
  CardBody,
  Alert,
  Modal,
  Checkbox,
} from "prizma-ui";
import {
  getAllOrderByCompanyForStatusAction,
  deleteOrderAction,
  searchOrdersAction,
  getOrderByDeliveryNumberDoneAction,
  updateOrderAction,
  updateOrderMassiveAction,
  setOrderTabIndex,
  createOrderAction,
  createOrderMassiveDoneAction,
  deleteMassiveOrdersAction
} from "../../../../../store/reducer";
import { RxReload } from "react-icons/rx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  BsEye,
  BsPencil,
  BsTrash,
  BsTruck,
  BsJournalPlus,
  BsJournalArrowUp,
  BsBoxSeam,
} from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import {
  ModalDetailOrder,
  SaveOrderModal,
  PurchaseNumberAddModal,
  UploadFileModal,
  UploadFileResultModal,
  URLModal,
  PaginationButtons,
  ModalConfirmationDelete,
  DeleteDomiciliaryModal,
  validateMany,
  color
} from "./ModalsOrder";
import { ModalAssignDomiciliarys } from "./ModalAssignDomiciliarys";
import DynamicTooltip from "../../../../../components/hooks/DynamicTooltip";

// Map reactstrap/bootstrap color strings to prizma-ui Button variants
const colorToVariant = (c) => {
  if (c === "success") return "primary";
  if (c === "danger") return "danger";
  if (c === "warning") return "accent";
  if (c === "secondary") return "secondary";
  if (c === "info") return "secondary";
  return "primary";
};

const OrdersByStatus = (props) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const ordersSearch = useSelector((state) => state.order.ordersSearch);
  const [toggleCreate, setToggleCreate] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [toggleDeleteMassive, setToggleDeleteMassive] = useState(false);
  const [toggleDetail, setToggleDetail] = useState(false);
  const [toggleAssignDomiciliary, setToggleAssignDomiciliary] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderSelect, setOrderSelect] = useState(null);
  const [take, setTake] = useState(20);
  const [takeSelect, setTakeSelect] = useState(20);
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [toggleDirection, setToggleDirection] = useState(false);
  const handlePage = (direction) => {
    const newSkip = direction === "next" ? skip + take : skip - take;
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newSkip >= 0) {
      dispatch(
        getAllOrderByCompanyForStatusAction({
          state: props.state,
          take: take,
          skip: newSkip,
          orderQuery: toggleDirection,
        }),
      );
      setSkip(newSkip);
      setPage(newPage);
    }
  };

  // Search
  const [orderWord, setOrderWord] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [timeSlotFilter, setTimeSlotFilter] = useState("");

  const zones = React.useMemo(() => {
    const uniqueZones = [...new Set(orders.map(o => o.zone).filter(z => z))];
    return uniqueZones.map(zone => ({ value: zone, label: zone }));
  }, [orders]);

  const timeSlots = React.useMemo(() => {
    const uniqueTimeSlots = [...new Set(orders.map(o => o.pickupTimeSlot).filter(t => t))];
    return uniqueTimeSlots.map(timeSlot => ({ value: timeSlot, label: timeSlot }));
  }, [orders]);

  const search = () => {
    if (orderWord != "") {
      dispatch(
        searchOrdersAction({
          word: orderWord,
          state: props.state,
          orderQuery: toggleDirection,
          take: take,
          skip: 0,
        }),
      );
    } else {
      setTake(take);
    }
  };


  // Borrar domiciliario
  const [toggleDeleteDomiciliary, setToggleDeleteDomiciliary] = useState(false);
  const [deleteSheetOrderDomiciliary, setDeleteSheetOrderDomiciliary] =
    useState(false);
  const handleDeleteDomiciliaryClose = () => {
    setToggleDeleteDomiciliary(!toggleDeleteDomiciliary);
  };
  const handleDeleteDomiciliary = (purchaseNumber) => {
    let dataAPI = {
      domiciliary: "0",
      orderState: "EsperaDespacho",
    };
    dispatch(
      updateOrderAction({
        id: purchaseNumber,
        data: dataAPI,
      }),
    );
    setToggleDeleteDomiciliary(false);
  };

  const [toggleDeleteDomiciliaryMassive, setToggleDeleteDomiciliaryMassive] = useState(false);
  const [deleteSheetOrderDomiciliaryMassive, setDeleteSheetOrderDomiciliaryMassive] =
    useState(false);
  const handleDeleteDomiciliaryMassive = () => {
    setToggleDeleteDomiciliaryMassive(!toggleDeleteDomiciliaryMassive);
  };
  const handleRemoveMassiveDomiciliary = () => {
    const data = [];
    selectedOrders.forEach(element => {
      const filteredObj = Object.fromEntries(
        Object.entries(element).filter(([key, value]) => value !== null && value !== undefined)
      );
      const dataApi = {
        id: filteredObj.id,
        purchaseNumber: filteredObj.purchaseNumber?.toString(),
        deliveryNumber: filteredObj.deliveryNumber?.toString(),
        domiciliary: "0",
        orderState: "EsperaDespacho",
      }
      data.push(dataApi);
    });
    dispatch(updateOrderMassiveAction({ orders: data }));
    setToggleDeleteDomiciliary(false);
  };

  const handleDeleteMassive = () => {
    const data = [];
    selectedOrders.forEach(element => {
      const filteredObj = Object.fromEntries(
        Object.entries(element).filter(([key, value]) => value !== null && value !== undefined)
      );
      data.push(filteredObj.deliveryNumber?.toString());
    });
    dispatch(
      deleteMassiveOrdersAction({
        deliverysNumber: data,
      }),
    );
    setToggleDeleteDomiciliary(false);
  };

  // Upload orders
  const orderMassiveResult = useSelector((state) =>
    state.order.orderMassiveResult
  );
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [uploadFileModal, setUploadFileModal] = React.useState(false);
  const [togglePurchaseNumber, setTogglePurchaseNumber] = useState(false);
  const [purchaseNumberModal, setPurchaseNumberModal] = React.useState(null);
  const [phoneNumberModal, setPhoneNumberModal] = React.useState();
  const [toggleSaveManyOrders, setToggleSaveManyOrders] = useState(false);
  const [prefixClientPhone, setPrefixClientPhone] = React.useState({
    value: '57',
    label: 'Colombia +57',
  });
  const [toggleResultUploadFile, setToggleResultUploadFile] = React.useState(
    false
  );
  const handleToggleResultUploadFile = () => {
    if (toggleResultUploadFile === true) {
      dispatch(createOrderMassiveDoneAction([]));
    }
    setToggleResultUploadFile(!toggleResultUploadFile);
  };

  const handleCreateNewSheetOrder = async () => {
    let dataAPI = {
      purchaseNumber: purchaseNumberModal?.replace(/\s/g, ""),
    };
    if (phoneNumberModal) {
      if (!prefixClientPhone) {
        setPrefixClientPhone({
          value: '57',
          label: 'Colombia +57',
        });
        dataAPI.prefix = '57';
      }
      dataAPI.clientPhone = phoneNumberModal.replace(/\s/g, "");;
    }
    dispatch(createOrderAction(dataAPI));
    setTogglePurchaseNumber(false);
  };

  const handleCreateManySheetOrder = async () => {
    const data = [];
    selectedOrders.forEach(element => {
      const filteredObj = Object.fromEntries(
        Object.entries(element).filter(([key, value]) => value !== null && value !== undefined)
      );
      const dataApi = {
        id: filteredObj.id,
        purchaseNumber: filteredObj.purchaseNumber?.toString(),
        deliveryNumber: filteredObj.deliveryNumber?.toString(),
        orderState: "EsperaDespacho",
      }
      data.push(dataApi);
    });
    dispatch(updateOrderMassiveAction({ orders: data }));
    dispatch(setOrderTabIndex('2'));
  };
  const [orderSelected, setOrderSelected] = useState(false);
  const handleCreateSheetOrder = () => {
    let dataAPI = {
      orderState: 'EsperaDespacho',
    };
    dispatch(
      updateOrderAction({
        id: orderSelected.deliveryNumber,
        data: dataAPI,
      }),
    );
    dispatch(setOrderTabIndex('2'));
  };

  // Actualizaciones
  useEffect(() => {
    if (orders.length === 0 && ordersSearch.length === 0) {
      dispatch(
        getAllOrderByCompanyForStatusAction({
          state: props.state,
          take,
          skip,
          orderQuery: toggleDirection,
        }),
      );
    }
  }, []);

  useEffect(() => {
    dispatch(
      getAllOrderByCompanyForStatusAction({
        state: props.state,
        take,
        skip,
        orderQuery: toggleDirection,
      }),
    );
  }, [take]);

  React.useEffect(() => {
    if (orderMassiveResult.length > 0) {
      handleToggleResultUploadFile();
      setTake(take);
      setSelectedOrders([]);
    }
  }, [orderMassiveResult]);

  // Exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    dateFrom: '',
    dateTo: '',
    zone: '',
    timeSlot: '',
    status: 'Entregada'
  });

  const exportToExcel = (data, fileName) => {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFile(workBook, fileName);
  };

  const handleExport = () => {
    let filteredOrders = orders;

    if (exportFilters.dateFrom) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.creationDate) >= new Date(exportFilters.dateFrom)
      );
    }
    if (exportFilters.dateTo) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.creationDate) <= new Date(exportFilters.dateTo)
      );
    }
    if (exportFilters.zone) {
      filteredOrders = filteredOrders.filter(order => order.zone === exportFilters.zone);
    }
    if (exportFilters.timeSlot) {
      filteredOrders = filteredOrders.filter(order => order.pickupTimeSlot === exportFilters.timeSlot);
    }
    if (exportFilters.status) {
      filteredOrders = filteredOrders.filter(order => order.orderState === exportFilters.status);
    }

    const exportData = filteredOrders.map(order => ({
      'Número de Compra': order.purchaseNumber,
      'Número de Entrega': order.deliveryNumber,
      'Cliente': `${order.name} ${order.lastName}`,
      'Teléfono': `+${order.prefix} ${order.clientPhone}`,
      'Dirección': order.deliveryAddress,
      'Zona': order.zone,
      'Horario': order.pickupTimeSlot,
      'Estado': order.orderState,
      'Fecha': order.creationDate,
    }));

    const fileName = `ordenes_${exportFilters.status}_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(exportData, fileName);
    setExportModalOpen(false);
  };

  return (
    <>
      <Row>
        <Col className="search-views-contain" sm={2} xs={6}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="buscar" className="sr-only">Buscar pedidos</label>
            <Input
              type="text"
              id="buscar"
              placeholder="Buscar"
              onChange={(e) => { e.preventDefault(); setOrderWord(e.target.value); }}
              onKeyDown={(target) => {
                if (target.key === 'Enter') {
                  search();
                }
              }}
              onClick={(e) => {
                if (e.nativeEvent.offsetX <= 40) {
                  e.preventDefault();
                  search();
                }
              }}
              className="search-views-standard"
            />
          </div>
        </Col>
        <Col sm={2} xs={6}>
          <ReactSelect
            isClearable
            placeholder="Zona"
            value={zones.find(zone => zone.value === zoneFilter) || null}
            onChange={(selectedZone) => {
              setZoneFilter(selectedZone ? selectedZone.value : '');
            }}
            options={zones}
          />
        </Col>
        {props.state === "Compra" && (
          <Col sm={2} xs={6}>
            <ReactSelect
              isClearable
              placeholder="Horario"
              value={timeSlots.find(slot => slot.value === timeSlotFilter) || null}
              onChange={(selectedSlot) => {
                setTimeSlotFilter(selectedSlot ? selectedSlot.value : '');
              }}
              options={timeSlots}
            />
          </Col>
        )}
        <Col sm={2} xs={4} style={{ marginTop: "10px", textAlign: "center", top: 10 }}>
          <p>Pagina: {page}</p>
        </Col>
        <Col sm={2} xs={3} style={{ marginTop: 10 }}>
          <label htmlFor="cantidad" className="sr-only">Cantidad de pedidos por página</label>
          <Input
            type="number"
            id="cantidad"
            placeholder="Cantidad"
            value={takeSelect}
            maxLength="2000"
            onChange={(count) => {
              if (Number(count.target.value) <= 2000) {
                setTakeSelect(count.target.value);
              }
            }}
            onKeyDown={(target) => {
              if (target.key === 'Enter') {
                setTake(parseInt(takeSelect));
              }
            }}
            style={{ width: "100%" }}
          />
          <p className="sub-text-button" style={{ marginLeft: "20%" }} >Pedidos</p>
        </Col>
        {props.state !== "Entregada" && (
          <Col sm={2} xs={2}>
            <div className="checkbox-bar-orders">
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedOrders(orders);
                  } else {
                    setSelectedOrders([]);
                  }
                  setSelectAll(e.target.checked);
                }}
                className="form-check-input-order"
                checked={selectAll}
                id="selectAll"
              />
            </div>
            <DynamicTooltip
              targetId="selectAll"
              tooltipText="Seleccionar todos"
              placement="right"
            />
          </Col>
        )}
        <Col sm={2} xs={4}>
          <Button
            variant="secondary"
            aria-label={toggleDirection ? "Ordenar ascendente" : "Ordenar descendente"}
            onClick={(e) => {
              e.preventDefault();
              setToggleDirection(!toggleDirection);
              setSkip(0);
              setPage(1);
              dispatch(
                getAllOrderByCompanyForStatusAction({
                  state: props.state,
                  take: 20,
                  skip: 0,
                  orderQuery: !toggleDirection,
                }),
              );
            }}
          >
            {toggleDirection ? <FaArrowDown aria-hidden="true" /> : <FaArrowUp aria-hidden="true" />}
          </Button>
          {props.state === "Entregada" && (
            <Button
              variant="primary"
              onClick={() => setExportModalOpen(true)}
              style={{ marginLeft: '10px' }}
            >
              Exportar
            </Button>
          )}
        </Col>
        <Col sm={1} xs={3}>
          <PaginationButtons margin={5} handlePage={handlePage} />
        </Col>
        {props.state === "Compra" && (
          <Col xs={8} sm={9}>
            <Button
              className='order-bar-button'
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                setPurchaseNumberModal(null);
                setPhoneNumberModal(null);
                setPrefixClientPhone(null);
                setTogglePurchaseNumber(true);
              }}
              id="new"
            >
              <BsJournalPlus size={15} /> Nueva
            </Button>
            <DynamicTooltip
              targetId="new"
              tooltipText="Crear una nueva orden"
              placement="right"
            />
            <input
              type="file"
              id="excel-file"
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
            />
            <Button
              className='order-bar-button'
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setUploadFileModal(true);
              }}
              id="massive"
            >
              <BsJournalArrowUp size={15} /> masivas
            </Button>
            <DynamicTooltip
              targetId="massive"
              tooltipText="Subir ordenes masivas"
              placement="right"
            />
          </Col>
        )}
        {selectedOrders.length > 0 && (
          <>
            {props.state === "Compra" && (
              <Col sm={1} xs={2}>
                <Button
                  className="float-right"
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setToggleSaveManyOrders(!toggleSaveManyOrders);
                  }}
                  id="delivery-assign"
                >
                  <BsBoxSeam size={20} />
                </Button>
                <DynamicTooltip
                  targetId="delivery-assign"
                  tooltipText="Crear entregas"
                  placement="right"
                />
              </Col>
            )}
            {props.state === "EsperaDespacho" && (
              <Col sm={10} xs={validateMany(selectedOrders) == false ? 12 : 8}>
                {validateMany(selectedOrders) == false ? (
                  <Alert tone="danger">
                    Debe tener todos los datos obligatorios en la orden para poder
                    asignar el domiciliario
                  </Alert>
                ) : (
                  <>
                    <Button
                      className="float-right"
                      variant={validateMany(selectedOrders) ? "primary" : "secondary"}
                      onClick={(e) => {
                        e.preventDefault();
                        if (validateMany(selectedOrders)) setToggleAssignDomiciliary(!toggleAssignDomiciliary);
                      }}
                      id="delivery-assign"
                    >
                      <BsTruck size={20} />
                    </Button>
                    <DynamicTooltip
                      targetId="delivery-assign"
                      tooltipText="Asignar domiciliario"
                      placement="right"
                    />
                  </>
                )}
              </Col>
            )}
            {(props.state !== "Compra" && props.state !== "EsperaDespacho") && (
              <Col sm={10} xs={8}>
                <Button
                  className="float-right"
                  variant={validateMany(selectedOrders) ? "primary" : "secondary"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteDomiciliaryMassive();
                  }}
                  id="remove-massive-assign"
                >
                  <FiUserX size={20} />
                </Button>
                <DynamicTooltip
                  targetId="remove-massive-assign"
                  tooltipText="Remover domiciliarios"
                  placement="right"
                />
              </Col>
            )}
            <Col sm={1} xs={(validateMany(selectedOrders) == false && props.state === "EsperaDespacho") ? 3 : 2}>
              <>
                <Button
                  className="float-right"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setToggleDeleteMassive(!toggleDeleteMassive)
                  }}
                  id="delete-assign"
                >
                  <BsTrash size={20} />
                </Button>
                <DynamicTooltip
                  targetId="delete-assign"
                  tooltipText="Eliminar ordenes"
                  placement="right"
                />
              </>
            </Col>
            <Col sm={1} xs={2} className="text-center">
              <>
                <p style={{ position: "relative", left: (props.state !== "Compra") ? "-20px" : "0", top: (props.state === "Compra") ? "0px" : "10px" }} className="circle-count">{selectedOrders.length}</p>
              </>
            </Col>
          </>
        )}
      </Row>
      <hr style={{ marginTop: "0px", marginBottom: "5px" }} />
      <Row className="content-card">
        {orders?.filter(order =>
            (!zoneFilter || order.zone === zoneFilter) &&
            (!timeSlotFilter || order.pickupTimeSlot === timeSlotFilter)
          ).length === 0 && (
          <Col sm={12}>
            <p role="status" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Sin pedidos en este estado
            </p>
          </Col>
        )}
        {orders?.filter(order =>
            (!zoneFilter || order.zone === zoneFilter) &&
            (!timeSlotFilter || order.pickupTimeSlot === timeSlotFilter)
          ).map((order, i) => {
          const xs = order.orderState == "Compra" ? 6 : 4;
          const sm = order.orderState == "Compra" ? 3 : 4;
          return (
            <Col
              key={i}
              sm={6}
            >
              <Card
                style={{
                  width: "100%",
                  height: "fit-content",
                  maxHeight: "90%",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  className="cui-card__header"
                  style={{ height: "40px" }}
                >
                  {(order.orderState !== "Entregada") && (
                    <div className="float-right">
                      <Checkbox
                        onChange={(e) => {
                          if (e.target.checked === false) {
                            setSelectedOrders(
                              selectedOrders.filter(
                                (selectedOrder) =>
                                  selectedOrder.purchaseNumber !== order.purchaseNumber,
                              ),
                            );
                          } else {
                            setSelectedOrders([...selectedOrders, order]);
                          }
                        }}
                        checked={selectedOrders.some(
                          (selectedOrder) =>
                            selectedOrder.purchaseNumber ===
                            order.purchaseNumber,
                        )}
                        className='checkbox-card'
                      />
                    </div>
                  )}
                  # Compra: {order.purchaseNumber}
                </div>
                <CardBody style={{ width: "100%" }}>
                  {order.deliveryNumber != null && (
                    <p style={{ marginBottom: "2px" }}>
                      # Entrega: {order.deliveryNumber}
                    </p>
                  )}
                  {order.name != null && (
                    <p style={{ marginBottom: "2px" }}>
                      Nombre: {order.name} {order.lastName}
                    </p>
                  )}
                  {order.clientPhone != null && (
                    <p style={{ marginBottom: "2px" }}>
                      Teléfono: +{order.prefix} {order.clientPhone}
                    </p>
                  )}
                  {order.deliveryPacket != null && (
                    <p style={{ marginBottom: "2px" }}>Paquete: {order.deliveryPacket}</p>
                  )}
                  {order.zone && (
                    <p style={{ marginBottom: "2px" }}>Zona: {order.zone}</p>
                  )}
                  {order.pickupTimeSlot && (
                    <p style={{
                      marginBottom: "2px",
                      backgroundColor: props.state === "Compra" ? "#e8f5e8" : "transparent",
                      padding: props.state === "Compra" ? "4px 8px" : "0",
                      borderRadius: props.state === "Compra" ? "4px" : "0",
                      fontWeight: props.state === "Compra" ? "bold" : "normal",
                      color: props.state === "Compra" ? "#2d5016" : "inherit"
                    }}>
                      Horario: {order.pickupTimeSlot}
                    </p>
                  )}
                  <Row>
                    {order.orderState == "Compra" && (
                      <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} xs={xs} sm={sm}>
                        <Button
                          variant="ghost"
                          style={{ width: "100%", height: "60%" }}
                          onClick={(e) => {
                            setOrderSelected(order);
                            setToggleCreate(!toggleCreate);
                          }}
                          id={`create-new-delivery-${i}`}
                        >
                          <BsBoxSeam size={20} className="sub-icon-button" />
                          <p className="sub-text-button">Entregar</p>
                        </Button>
                      </Col>
                    )}
                    <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} xs={xs} sm={sm}>
                      <Button
                        variant="ghost"
                        style={{ width: "100%", height: "60%" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setToggleDetail(!toggleDetail)
                          setOrderDetail(order);
                        }}
                        id={`detail-${i}`}
                      >
                        <BsEye size={20} className="sub-icon-button" />
                        <p className="sub-text-button">Ver</p>
                      </Button>
                    </Col>
                    {(order.orderState === "Compra") && (
                      <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} xs={xs} sm={sm}>
                        <Button
                          variant="ghost"
                          style={{ width: "100%", height: "60%" }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(process.env.REACT_APP_REACT_HOST + '/takeOrder/' + order.deliveryNumber, '_blank')
                          }}
                          id={`edit-${i}`}
                        >
                          <BsPencil size={20} className="sub-icon-button" />
                          <p className="sub-text-button">Editar</p>
                        </Button>
                      </Col>
                    )}
                    {(order.orderState === "EsperaDespacho") && (
                      <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} xs={xs} sm={sm}>
                        <Button
                          variant={colorToVariant(color(order))}
                          style={{ width: "100%", height: "60%" }}
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(getOrderByDeliveryNumberDoneAction(null));
                            dispatch(
                              push(
                                `/company/editorder/${order.deliveryNumber}`,
                              ),
                            );
                          }}
                          id={`edit-${i}`}
                        >
                          <BsPencil size={20} className="sub-icon-button" />
                          <p className="sub-text-button">Editar</p>
                        </Button>
                      </Col>
                    )}
                    {order.orderState != "Entregada" && (
                      <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} xs={xs} sm={sm}>
                        <Button
                          variant="ghost"
                          style={{ width: "100%", height: "60%" }}
                          onClick={(e) => {
                            e.preventDefault();
                            setToggleDelete(!toggleDelete)
                            setOrderSelect(order);
                          }}
                          id={`delete-${i}`}
                        >
                          <BsTrash size={20} className="sub-icon-button" />
                          <p className="sub-text-button">Borrar</p>
                        </Button>
                      </Col>
                    )}
                    {order.domiciliary != null &&
                      order.orderState != "Entregada" && (
                        <Col style={{ paddingLeft: "5px", paddingRight: "5px" }} xs={xs} sm={sm}>
                          <Button
                            variant="ghost"
                            style={{ width: "100%", height: "60%" }}
                            disabled={order.domiciliary != null ? false : true}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteDomiciliaryClose();
                              setDeleteSheetOrderDomiciliary(
                                order.purchaseNumber,
                              );
                            }}
                            id={`remove-${i}`}
                          >
                            <FiUserX size={20} className="sub-icon-button" />
                            <p className="sub-text-button">Remover</p>
                          </Button>
                          <DynamicTooltip
                            targetId={`remove-${i}`}
                            tooltipText="Remover domiciliario"
                            placement="right"
                          />
                        </Col>
                      )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
      {orderDetail != null && (
        <ModalDetailOrder
          order={orderDetail}
          toggle={toggleDetail}
          handleChange={() => {
            setToggleDetail(!toggleDetail);
          }}
        />
      )}
      <URLModal
        toggle={toggleCreate}
        handleChange={() => {
          setToggleCreate(!toggleCreate);
        }}
        handleCreateSheetOrder={handleCreateSheetOrder}
      />
      <SaveOrderModal
        toggle={toggleSaveManyOrders}
        handleChange={handleCreateManySheetOrder}
        handleClose={() => {
          setToggleSaveManyOrders(!toggleSaveManyOrders);
        }}
      />
      <PurchaseNumberAddModal
        toggle={togglePurchaseNumber}
        handleChange={handleCreateNewSheetOrder}
        handleClose={() => {
          setTogglePurchaseNumber(!togglePurchaseNumber);
        }}
        handleChangePurchaseNumber={(purchaseNumber) => {
          setPurchaseNumberModal(purchaseNumber.target.value);
        }}
        handleChangePhoneNumber={(phoneNumber) => {
          setPhoneNumberModal(phoneNumber.target.value);
        }}
        handlePrefixChange={(prefix) => {
          setPrefixClientPhone(prefix);
        }}
        prefixClientPhone={prefixClientPhone}
        purchaseNumberModal={purchaseNumberModal}
        phoneNumberModal={phoneNumberModal}
      />
      <UploadFileModal
        toggle={uploadFileModal}
        handleClose={() => {
          setUploadFileModal(!uploadFileModal);
        }}
      />
      <UploadFileResultModal
        toggle={toggleResultUploadFile}
        handleClose={handleToggleResultUploadFile}
        orderMassiveResult={orderMassiveResult}
      />
      <ModalConfirmationDelete
        toggle={toggleDelete}
        handleChange={(e) => {
          {
            e.preventDefault();
            dispatch(deleteOrderAction(orderSelect.deliveryNumber));
            setToggleDelete(!toggleDelete)
          }
        }}
        handleClose={() => {
          setToggleDelete(!toggleDelete)
        }}
      />
      <ModalConfirmationDelete
        toggle={toggleDeleteMassive}
        handleChange={(e) => {
          {
            e.preventDefault();
            handleDeleteMassive();
            setToggleDeleteMassive(!toggleDeleteMassive)
          }
        }}
        handleClose={() => {
          setToggleDeleteMassive(!toggleDeleteMassive)
        }}
      />
      <ModalAssignDomiciliarys
        toggle={toggleAssignDomiciliary}
        handleClose={() => {
          setToggleAssignDomiciliary(!toggleAssignDomiciliary);
        }}
        orders={selectedOrders}
      />
      <DeleteDomiciliaryModal
        toggle={toggleDeleteDomiciliaryMassive}
        handleChange={handleRemoveMassiveDomiciliary}
        handleClose={handleDeleteDomiciliaryMassive}
        deleteDomiciliary={deleteSheetOrderDomiciliaryMassive}
      />
      <DeleteDomiciliaryModal
        toggle={toggleDeleteDomiciliary}
        handleChange={handleDeleteDomiciliary}
        handleClose={handleDeleteDomiciliaryClose}
        deleteDomiciliary={deleteSheetOrderDomiciliary}
      />
      <Button
        className="button-reload"
        variant="ghost"
        aria-label="Recargar pedidos"
        onClick={() =>
          dispatch(
            getAllOrderByCompanyForStatusAction({
              state: props.state,
              take,
              skip,
              orderQuery: toggleDirection,
            }),
          )
        }
      >
        <RxReload aria-hidden="true" />
      </Button>

      {/* Modal de exportación */}
      <Modal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Ordenes"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleExport}>
              Exportar
            </Button>
            <Button variant="secondary" onClick={() => setExportModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="dateFrom">Fecha desde</label>
          <Input
            type="date"
            id="dateFrom"
            value={exportFilters.dateFrom}
            onChange={(e) => setExportFilters({...exportFilters, dateFrom: e.target.value})}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="dateTo">Fecha hasta</label>
          <Input
            type="date"
            id="dateTo"
            value={exportFilters.dateTo}
            onChange={(e) => setExportFilters({...exportFilters, dateTo: e.target.value})}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Zona</label>
          <ReactSelect
            isClearable
            placeholder="Seleccionar zona"
            value={zones.find(zone => zone.value === exportFilters.zone) || null}
            onChange={(selectedZone) => {
              setExportFilters({...exportFilters, zone: selectedZone ? selectedZone.value : ''});
            }}
            options={zones}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Horario</label>
          <ReactSelect
            isClearable
            placeholder="Seleccionar horario"
            value={timeSlots.find(slot => slot.value === exportFilters.timeSlot) || null}
            onChange={(selectedSlot) => {
              setExportFilters({...exportFilters, timeSlot: selectedSlot ? selectedSlot.value : ''});
            }}
            options={timeSlots}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Estado</label>
          <ReactSelect
            value={{value: exportFilters.status, label: exportFilters.status}}
            onChange={(selectedStatus) => {
              setExportFilters({...exportFilters, status: selectedStatus.value});
            }}
            options={[
              {value: 'Entregada', label: 'Entregada'},
              {value: 'Compra', label: 'Compra'},
              {value: 'EsperaDespacho', label: 'Espera Despacho'},
              {value: 'EsperaSalida', label: 'Espera Salida'},
              {value: 'Aceptada', label: 'Aceptada'},
              {value: 'Salida', label: 'Salida'}
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default OrdersByStatus;
