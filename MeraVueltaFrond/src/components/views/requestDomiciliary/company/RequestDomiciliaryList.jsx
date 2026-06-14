import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Row,
  Col,
  Card,
  CardText,
  CardBody
} from 'reactstrap';
import {
  domiciliarysByCompanyDomiciliaryCompanyRequestAction,
  createDomiciliaryCompanyRequestAction,
} from '../../../../store/reducer';
import { RxReload } from 'react-icons/rx';

const RequestDomiciliaryList = () => {
  const dispatch = useDispatch();
  const domiciliarys = useSelector(
    (state) => state.domiciliaryCompanyRequest.domiciliarys
  );
  const user = useSelector((state) => state.login.user);
  const [
    requestDomiciliaryCompanyRequest,
    setRequestDomiciliaryCompanyRequest,
  ] = React.useState(false);

  const [toggleRequest, setToggleRequest] = React.useState(false);

  const handleRequestClose = (e) => {
    e.preventDefault();
    setToggleRequest(!toggleRequest);
  };

  const handleRequest = (event, id) => {
    event.preventDefault();
    handleRequestClose(event);
    dispatch(
      createDomiciliaryCompanyRequestAction({
        company: user.id,
        domiciliary: id,
      })
    );
  };

  React.useEffect(() => {
    dispatch(domiciliarysByCompanyDomiciliaryCompanyRequestAction());
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
    domiciliarys.map((domiciliary) => {
      if (domiciliary.name.includes(orderWord)) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (
        domiciliary.lastName.includes(orderWord)
      ) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (
        domiciliary.documentNumber.includes(orderWord)
      ) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (
        domiciliary.clientPhone.includes(orderWord)
      ) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (domiciliary.email.includes(orderWord)) {
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
              <DomiciliaryRequestCard key={i} domiciliary={domiciliary} handleRequestClose={handleRequestClose} setRequestDomiciliaryCompanyRequest={setRequestDomiciliaryCompanyRequest} />
            ))
            : domiciliarys.map((domiciliary, i) => (
              <DomiciliaryRequestCard key={i} domiciliary={domiciliary} handleRequestClose={handleRequestClose} setRequestDomiciliaryCompanyRequest={setRequestDomiciliaryCompanyRequest} />
            ))}
        </Row>
      </div>
      <RequestDomiciliaryCompanyRequestModal
        toggle={toggleRequest}
        handleChange={handleRequest}
        handleClose={handleRequestClose}
        requestDomiciliaryCompanyRequest={
          requestDomiciliaryCompanyRequest
        }
      />
      <Button className='button-reload' onClick={() => dispatch(domiciliarysByCompanyDomiciliaryCompanyRequestAction())}><RxReload /></Button>
    </>
  );
};

const RequestDomiciliaryCompanyRequestModal = (props) => {
  const {
    handleChange,
    handleClose,
    toggle,
    requestDomiciliaryCompanyRequest,
  } = props;
  return (
    <Modal isOpen={toggle} toggle={handleChange}>
      <ModalHeader toggle={handleChange}>Confirmar</ModalHeader>
      <ModalBody>
        ¿Quieres enviar una solicitud para afiliar este domiciliario?
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={(e) =>
            handleChange(e, requestDomiciliaryCompanyRequest)
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
          color="primary"
          onClick={(e) => {
            handleRequestClose(e);
            setRequestDomiciliaryCompanyRequest(domiciliary.id);
          }}
        >
          Enviar solicitud
        </Button>
      </CardBody>
    </Card>
  </Col>
);

export default RequestDomiciliaryList;
