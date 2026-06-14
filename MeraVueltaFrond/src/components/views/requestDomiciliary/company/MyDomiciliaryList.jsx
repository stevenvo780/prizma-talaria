import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardText,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';

import {
  getAllDomiciliaryCompanyByCompanyAction,
  deleteDomiciliaryCompanyAction,
} from '../../../../store/reducer';
import { RxReload } from 'react-icons/rx';

const MyDomiciliaryList = () => {
  const dispatch = useDispatch();
  const domiciliaryCompany = useSelector(
    (state) => state.domiciliaryCompany.domiciliaryCompanys
  );
  const [deleteDomiciliaryCompany, setDeleteDomiciliaryCompany] =
    React.useState(false);

  const [toggleDelete, setToggleDelete] = React.useState(false);

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setToggleDelete(!toggleDelete);
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    handleDeleteClose(event);
    dispatch(deleteDomiciliaryCompanyAction(id));
  };

  React.useEffect(() => {
    dispatch(getAllDomiciliaryCompanyByCompanyAction());
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
    domiciliaryCompany.map((domiciliary) => {
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
        <Row>
          {domiciliaryOrdersFiltering !== null
            ? domiciliaryOrdersFiltering.map((domiciliary, i) => (
              <DomiciliaryCard key={i} domiciliary={domiciliary} handleDeleteClose={handleDeleteClose} setDeleteDomiciliaryCompany={setDeleteDomiciliaryCompany} />
            ))
            : domiciliaryCompany.map((domiciliary, i) => (
              <DomiciliaryCard key={i} domiciliary={domiciliary} handleDeleteClose={handleDeleteClose} setDeleteDomiciliaryCompany={setDeleteDomiciliaryCompany} />
            ))}
        </Row>
      </div>
      <DeleteDomiciliaryCompanyModal
        toggle={toggleDelete}
        handleChange={handleDelete}
        handleClose={handleDeleteClose}
        deleteDomiciliaryCompany={deleteDomiciliaryCompany}
      />
      <Button className='button-reload' onClick={() => dispatch(getAllDomiciliaryCompanyByCompanyAction())}><RxReload /></Button>
    </>
  );
};

const DeleteDomiciliaryCompanyModal = (props) => {
  const {
    handleChange,
    handleClose,
    toggle,
    deleteDomiciliaryCompany,
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
          onClick={(e) => handleChange(e, deleteDomiciliaryCompany)}
        >
          Aceptar
        </Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

const DomiciliaryCard = ({ domiciliary, handleDeleteClose, setDeleteDomiciliaryCompany }) => (
  <Col style={{ marginTop: "10px" }} sm="4">
    <Card style={{ margin: 0, padding: 0, paddingBottom: "10px", width: "100%", height: "fit-content", maxHeight: "90%", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }} body>
      <CardBody>
        <CardText>
          {domiciliary.company.companyName}
        </CardText>
        <CardText>
          {domiciliary.domiciliary.name} {domiciliary.domiciliary.lastName}
        </CardText>
        <CardText>
          Documento: {domiciliary.domiciliary.documentNumber}
        </CardText>
        <CardText>
          {domiciliary.domiciliary.email}
        </CardText>
        <Button
          color="danger"
          onClick={(e) => {
            handleDeleteClose(e);
            setDeleteDomiciliaryCompany(domiciliary.id);
          }}
        >
          Eliminar
        </Button>
      </CardBody>
    </Card>
  </Col>
);

export default MyDomiciliaryList;
