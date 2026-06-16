import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx/xlsx";
import ReactSelect from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Card, CardBody, Modal, Input } from 'prizma-ui';
import {
  getAllCustomersAction,
  deleteCustomerAction,
  setCustomerTakeCustomer,
  setStepCustomer,
  createCustomersMassiveAction,
  updateCustomerAction
} from '../../../store/reducer';
import { RxReload } from 'react-icons/rx';
import CreateCustomerStep1 from './CreateCustomerStep1';
import CreateCustomerStep2 from './CreateCustomerStep2';

const Customers = () => {
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customer.customers
  );
  const orderStep = useSelector(
    (state) => state.customer.step
  );
  const [deleteCustomerID, setDeleteCustomerID] =
    React.useState(null);

  const [toggleDelete, setToggleDelete] = React.useState(false);

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setToggleDelete(!toggleDelete);
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    handleDeleteClose(event);
    dispatch(deleteCustomerAction(id));
  };

  React.useEffect(() => {
    dispatch(getAllCustomersAction());
  }, []);

  const [customerFiltering, setCustomerFiltering] =
    React.useState(null);
  const [searchWord, setSearchWord] = React.useState('');
  const [zoneFilter, setZoneFilter] = React.useState('');

  const zones = React.useMemo(() => {
    const uniqueZones = [...new Set(customers.map(c => c.zone).filter(z => z))];
    return uniqueZones.map(zone => ({ value: zone, label: zone }));
  }, [customers]);

  const search = () => {
    let customerSearchSelected = customers;

    if (zoneFilter) {
      customerSearchSelected = customerSearchSelected.filter(customer =>
        customer.zone === zoneFilter
      );
    }

    if (searchWord) {
      customerSearchSelected = customerSearchSelected.filter((customer) => {
        return (customer.name && customer.name.includes(searchWord)) ||
               (customer.lastName && customer.lastName.includes(searchWord)) ||
               (customer.documentNumber && customer.documentNumber.includes(searchWord)) ||
               (customer.clientPhone && customer.clientPhone.includes(searchWord)) ||
               (customer.email && customer.email.includes(searchWord)) ||
               (customer.zone && customer.zone.includes(searchWord));
      });
    }

    setCustomerFiltering(customerSearchSelected);
  };

  const handleChangeWord = (e, word) => {
    e.preventDefault();
    setSearchWord(word);
  };

  const [modalOpen, setModalOpen] = React.useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);

  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };
  const translateKeysToSpanish = (data) => {
    return data.map((item) => {
      const translatedItem = {};
      Object.keys(item).forEach((key) => {
        const spanishKey = englishToSpanishKeys[key];
        translatedItem[spanishKey] = item[key];
      });
      return translatedItem;
    });
  };
  const exportToExcel = (data, fileName) => {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFile(workBook, fileName);
  };
  const dataInEnglish = [];
  for (const element of customers) {
    let object = {};
    Object.assign(object, element);
    dataInEnglish.push(object);
  }
  const exportData = () => {
    for (let index = 0; index < dataInEnglish.length; index++) {
      if (dataInEnglish[index].id) {
        delete dataInEnglish[index].id;
      }
      if (dataInEnglish[index].order) {
        delete dataInEnglish[index].order;
      }
      if (dataInEnglish[index].updatedAt) {
        delete dataInEnglish[index].updatedAt;
      }
      if (dataInEnglish[index].createdAt) {
        delete dataInEnglish[index].createdAt;
      }
      if (dataInEnglish[index].company) {
        delete dataInEnglish[index].company;
      }
    }
    const dataInSpanish = translateKeysToSpanish(dataInEnglish);
    exportToExcel(dataInSpanish, "ClientesTalaria.xlsx");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    const currentCustomers = customerFiltering !== null ? customerFiltering : customers;
    const reorderedCustomers = Array.from(currentCustomers);
    const [removed] = reorderedCustomers.splice(startIndex, 1);
    reorderedCustomers.splice(endIndex, 0, removed);

    reorderedCustomers.forEach((customer, index) => {
      const newOrder = index + 1;
      if (customer.order !== newOrder) {
        dispatch(updateCustomerAction({
          id: customer.id,
          data: { ...customer, order: newOrder }
        }));
      }
    });

    if (customerFiltering !== null) {
      setCustomerFiltering(reorderedCustomers);
    }
  };
  return (
    <>
      <div
        style={{
          position: 'relative',
          left: '2%',
          height: 'calc(100vh - 100px)',
          width: '98%',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <Button variant="primary" onClick={() => {
          dispatch(setCustomerTakeCustomer(null));
          dispatch(setStepCustomer(0));
          toggleModal();
        }}>Crear cliente</Button>
        <Button variant="primary" onClick={toggleUploadModal}>
          Cargar clientes masivamente
        </Button>
        <Button variant="primary" onClick={exportData}>
          Descargar datos
        </Button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ flex: '0 0 50%', maxWidth: '50%' }}>
            <Input
              type="text"
              id="buscar"
              placeholder="Buscar"
              onChange={(e) => handleChangeWord(e, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              className="search-views-standard"
            />
          </div>
          <div style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>
            <ReactSelect
              isClearable
              placeholder="Filtrar por zona"
              value={zones.find(zone => zone.value === zoneFilter) || null}
              onChange={(selectedZone) => {
                setZoneFilter(selectedZone ? selectedZone.value : '');
                setTimeout(search, 100);
              }}
              options={zones}
            />
          </div>
          <div style={{ flex: '0 0 16.666%', maxWidth: '16.666%' }}>
            <Button
              variant="primary"
              onClick={search}
              style={{ width: '100%' }}
            >
              Buscar
            </Button>
          </div>
        </div>
        <br />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="customers">
            {(provided) => (
              <div
                style={{ display: 'flex', flexWrap: 'wrap' }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {(customerFiltering !== null ? customerFiltering : customers)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((customer, i) => (
                    <Draggable key={customer.id} draggableId={customer.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                          }}
                        >
                          <CustomerCard
                            customer={customer}
                            handleDeleteClose={handleDeleteClose}
                            setDeleteCustomerID={setDeleteCustomerID}
                            toggleModal={toggleModal}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <DeleteCustomerModal
        toggle={toggleDelete}
        handleChange={handleDelete}
        handleClose={handleDeleteClose}
        deleteCustomerID={deleteCustomerID}
      />
      <Button className='button-reload' onClick={() => dispatch(getAllCustomersAction())}><RxReload /></Button>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        title="Crear cliente"
        footer={
          <Button variant="secondary" onClick={toggleModal}>Cerrar</Button>
        }
      >
        {(orderStep === 0) ?
          <CreateCustomerStep1 />
          : <CreateCustomerStep2 />}
      </Modal>
      <UploadCustomerModal toggle={uploadModalOpen} handleClose={toggleUploadModal} />
    </>
  );
};

const DeleteCustomerModal = (props) => {
  const {
    handleChange,
    handleClose,
    toggle,
    deleteCustomerID,
  } = props;
  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <>
          <Button
            variant="primary"
            onClick={(e) => handleChange(e, deleteCustomerID)}
          >
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </>
      }
    >
      ¿Estás seguro/a de que desea eliminar el cliente seleccionado?
    </Modal>
  );
};

const CustomerCard = ({ customer, handleDeleteClose, setDeleteCustomerID, toggleModal }) => {
  const dispatch = useDispatch();
  return (
    <div style={{ marginTop: '10px', padding: '0 8px', width: '33.333%' }}>
      <Card raised style={{ margin: 0, padding: 0, paddingBottom: '10px', width: '100%', height: 'fit-content', maxHeight: '90%' }}>
        <CardBody>
          <p>Orden: {customer.order}</p>
          <p>{customer.name} {customer.lastName}</p>
          <p>Celular: {customer.clientPhone}</p>
          {customer.zone && (
            <p>Zona: {customer.zone}</p>
          )}
          <Button
            variant="primary"
            onClick={() => { dispatch(setCustomerTakeCustomer(customer)); toggleModal(); }}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              handleDeleteClose(e);
              setDeleteCustomerID(customer.id);
            }}
          >
            Eliminar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

const UploadCustomerModal = ({ toggle, handleClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = React.useRef(null);

  const handleExcelFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(firstSheet);
      const convertedJson = json.map((item) => {
        const convertedItem = {};
        Object.keys(item).forEach((key) => {
          const translatedKey = translateToEnglish(key);
          convertedItem[translatedKey] = item[key];
          convertedItem[translatedKey] = String(item[key]);
        });
        return convertedItem;
      });
      dispatch(createCustomersMassiveAction(convertedJson));
      handleClose();
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadFormatFile = () => {
    const link = document.createElement('a');
    link.href = process.env.REACT_APP_URL_FORMAT_MASSIVE_CUSTOMERS;
    link.download = 'formato_clientes.xlsx';
    link.click();
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Subir clientes masivamente"
      footer={
        <>
          <Button variant="secondary" onClick={downloadFormatFile}>
            Descargar formato
          </Button>
          <Button variant="primary" onClick={handleSelectFile}>
            Seleccionar archivo
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cerrar
          </Button>
        </>
      }
    >
      <p>
        Para subir clientes utilizando un archivo de Excel, por favor descargue el formato y llénelo con los datos
        de los clientes que desea agregar.
      </p>
      <p>Una vez llenado el archivo, puede subirlo utilizando el botón "Seleccionar archivo".</p>
      <input
        type="file"
        id="excel-file"
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
        onChange={handleExcelFile}
        ref={fileInputRef}
      />
    </Modal>
  );
};

const translateToEnglish = (key) => {
  switch (key) {
    case "Orden":
      return "order";
    case "TelefonoCliente":
      return "clientPhone";
    case "Prefijo":
      return "prefix";
    case "Compania":
      return "company";
    case "Nombres":
      return "name";
    case "Apellidos":
      return "lastName";
    case "Documento":
      return "documentNumber";
    case "TipoDeDocumento":
      return "typeDocument";
    case "Email":
      return "email";
    case "FechaCreacion":
      return "creationDate";
    case "Ciudad":
      return "city";
    case "Departamento":
      return "department";
    case "Barrio":
      return "neighborhood";
    case "NombreConjuntoResidencial":
      return "residentialGroupName";
    case "NumeroDeCasaOApto":
      return "houseNumberOrApartment";
    case "DireccionEntrega":
      return "deliveryAddress";
    case "TipoDePago":
      return "paymentMethod";
    case "GeolocalizacionEntrega":
      return "geolocationDelivery";
    case "Zona":
      return "zone";
    default:
      return key;
  }
};

const englishToSpanishKeys = {
  "order": "Orden",
  "clientPhone": "TelefonoCliente",
  "prefix": "Prefijo",
  "company": "Compania",
  "name": "Nombres",
  "lastName": "Apellidos",
  "documentNumber": "Documento",
  "typeDocument": "TipoDeDocumento",
  "email": "Email",
  "creationDate": "FechaCreacion",
  "city": "Ciudad",
  "department": "Departamento",
  "neighborhood": "Barrio",
  "residentialGroupName": "NombreConjuntoResidencial",
  "houseNumberOrApartment": "NumeroDeCasaOApto",
  "deliveryAddress": "DireccionEntrega",
  "paymentMethod": "TipoDePago",
  "geolocationDelivery": "GeolocalizacionEntrega",
  "zone": "Zona",
};

export default Customers;
