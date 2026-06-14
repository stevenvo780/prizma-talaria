import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col
} from 'reactstrap';
import {
  getAllDomiciliaryCompanyByDomiciliaryAction,
  deleteDomiciliaryCompanyAction,
} from '../../../../store/reducer';

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
    dispatch(getAllDomiciliaryCompanyByDomiciliaryAction());
  }, [dispatch]);

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
        <Row>
          {domiciliaryCompany.map((domiciliary, i) => (
            <Col style={{ marginTop: "10px" }} sm="4">
              <Card style={{ margin: 0, padding: 0, paddingBottom: "10px", width: "100%", height: "fit-content", maxHeight: "90%", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }} body>
                <CardBody>
                  <CardText>
                    {domiciliary.company.name} {domiciliary.company.lastName}
                  </CardText>
                  <CardText>
                    {domiciliary.company.documentNumber}
                  </CardText>
                  <CardText>
                    {domiciliary.company.email}
                  </CardText>
                  <Button color="danger" onClick={(e) => {
                    handleDeleteClose(e);
                    setDeleteDomiciliaryCompany(domiciliary.id);
                  }}>
                    Eliminar
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <DeleteDomiciliaryCompanyModal
        toggle={toggleDelete}
        handleChange={handleDelete}
        handleClose={handleDeleteClose}
        deleteDomiciliaryCompany={deleteDomiciliaryCompany}
      />
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
        ¿ Estás seguro/a de que desea eliminar la relación con esta
        empresa ??
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



export default MyDomiciliaryList;
