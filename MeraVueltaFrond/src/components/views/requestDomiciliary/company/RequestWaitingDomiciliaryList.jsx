import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Card,
  CardBody,
  CardText,
  Col,
  Row,
} from 'reactstrap';
import {
  getAllDomiciliaryCompanyRequestByCompanyAction,
  deleteDomiciliaryCompanyRequestAction,
} from '../../../../store/reducer';
import { RxReload } from 'react-icons/rx';

const RequestWaitingDomiciliaryList = () => {
  const dispatch = useDispatch();
  const domiciliaryCompanyRequest = useSelector(
    (state) =>
      state.domiciliaryCompanyRequest.domiciliaryCompanyRequests
  );
  const [
    deleteDomiciliaryCompanyRequest,
    setDeleteDomiciliaryCompanyRequest,
  ] = React.useState(false);

  const [toggleDelete, setToggleDelete] = React.useState(false);

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setToggleDelete(!toggleDelete);
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    handleDeleteClose(event);
    dispatch(deleteDomiciliaryCompanyRequestAction(id));
  };

  React.useEffect(() => {
    dispatch(getAllDomiciliaryCompanyRequestByCompanyAction());
  }, []);

  const handleKeyPress = (target) => {
    if (target.charCode == 13) {
      search();
    }
  };
  const [domiciliaryOrdersFiltering, setDomiciliaryOrdersFiltering] =
    React.useState(null);
  const [orderWord, setOrderWord] = React.useState('');
  const search = () => {
    const orderDomiciliarySearchSelected = [];
    domiciliaryCompanyRequest.map((domiciliary) => {
      if (domiciliary.domiciliary.name.includes(orderWord)) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (
        domiciliary.domiciliary.lastName.includes(orderWord)
      ) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (
        domiciliary.domiciliary.documentNumber.includes(orderWord)
      ) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (
        domiciliary.domiciliary.clientPhone.includes(orderWord)
      ) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (domiciliary.domiciliary.email.includes(orderWord)) {
        orderDomiciliarySearchSelected.push(domiciliary);
      }
    });
    setDomiciliaryOrdersFiltering(orderDomiciliarySearchSelected);
  };
  const handleChangeWord = (e, word) => {
    e.preventDefault();
    setOrderWord(word);
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
        <Input
          type="text"
          id="buscar"
          placeholder="Buscar"
          onChange={(e) => handleChangeWord(e, e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-views-standard"
        />
        <br />
        <Row >
          {domiciliaryOrdersFiltering !== null
            ? domiciliaryOrdersFiltering.map((domiciliary, i) => (
              <DomiciliaryRequestCard
                key={i}
                domiciliary={domiciliary.domiciliary}
                handleRequestClose={handleDeleteClose}
                setRequestDomiciliaryCompanyRequest={setDeleteDomiciliaryCompanyRequest}
              />
            ))
            : domiciliaryCompanyRequest.map((domiciliary, i) => (
              <DomiciliaryRequestCard
                key={i}
                domiciliary={domiciliary.domiciliary}
                handleRequestClose={handleDeleteClose}
                setRequestDomiciliaryCompanyRequest={setDeleteDomiciliaryCompanyRequest}
              />
            ))}
        </Row>
      </div>
      <DeleteDomiciliaryCompanyRequestModal
        toggle={toggleDelete}
        handleChange={handleDelete}
        handleClose={handleDeleteClose}
        deleteDomiciliaryCompanyRequest={
          deleteDomiciliaryCompanyRequest
        }
      />
      <Button className='button-reload' onClick={() => dispatch(getAllDomiciliaryCompanyRequestByCompanyAction())}><RxReload /></Button>
    </>
  );
};

const DeleteDomiciliaryCompanyRequestModal = (props) => {
  const {
    handleChange,
    handleClose,
    toggle,
    deleteDomiciliaryCompanyRequest,
  } = props;
  return (
    <Modal isOpen={toggle} toggle={handleChange}>
      <ModalHeader toggle={handleChange}>Confirmar</ModalHeader>
      <ModalBody>
        ¿Estás seguro/a de que desea eliminar el pedido seleccionada?
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={(e) =>
            handleChange(e, deleteDomiciliaryCompanyRequest)
          }
        >
          Aceptar
        </Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

const DomiciliaryRequestCard = ({ domiciliary, handleRequestClose, setRequestDomiciliaryCompanyRequest }) => (
  <Col style={{ marginTop: "10px" }} sm="4">
    <Card style={{ margin: 0, padding: 0, paddingBottom: "10px", width: "100%", height: "fit-content", maxHeight: "90%", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }} body>
      <CardBody>
        <CardText>
          {domiciliary.name} {domiciliary.lastName}
        </CardText>
        <CardText>
          Documento: {domiciliary.documentNumber}
        </CardText>
        <CardText>
          {domiciliary.email}
        </CardText>
        <Button
          color="danger"
          onClick={(e) => {
            handleDeleteClose(e);
            setDeleteDomiciliaryCompanyRequest(
              domiciliary.id
            );
          }}
        >
          Eliminar
        </Button>
      </CardBody>
    </Card>
  </Col>
);

export default RequestWaitingDomiciliaryList;
