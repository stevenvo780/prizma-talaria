import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col
} from 'reactstrap';
import {
  getAllDomiciliaryCompanyRequestByDomiciliaryAction,
  updateDomiciliaryCompanyRequestAction,
} from '../../../../store/reducer';

const RequestDomiciliaryList = () => {
  const dispatch = useDispatch();
  const domiciliaryCompanyRequests = useSelector(
    (state) =>
      state.domiciliaryCompanyRequest.domiciliaryCompanyRequests
  );
  const user = useSelector((state) => state.login.user);
  const [
    requestDomiciliaryCompanyRequest,
    setRequestDomiciliaryCompanyRequest,
  ] = React.useState(null);

  const [toggleRequest, setToggleRequest] = React.useState(false);

  const handleRequestClose = (e) => {
    e.preventDefault();
    setToggleRequest(!toggleRequest);
  };

  const handleRequest = (
    event,
    requestDomiciliaryCompanyRequestSelected,
    response
  ) => {
    event.preventDefault();
    handleRequestClose(event);
    dispatch(
      updateDomiciliaryCompanyRequestAction({
        id: requestDomiciliaryCompanyRequestSelected.requestDomiciliaryCompanyRequestId,
        data: {
          company: requestDomiciliaryCompanyRequestSelected.companyId,
          domiciliary: user.id.toString(),
          state: response,
        },
      })
    );
  };

  React.useEffect(() => {
    dispatch(getAllDomiciliaryCompanyRequestByDomiciliaryAction());
  }, [dispatch]);

  return (
    <>
      <div
        style={{
          position: 'relative',
          left: '2%',
          left: '2%',
          height: 'calc(100vh - 100px)',
          width: '98%',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <Row>
          {domiciliaryCompanyRequests.map((domiciliary, i) => (
            <RequestCard key={i} domiciliary={domiciliary} handleRequestClose={handleRequestClose} setRequestDomiciliaryCompanyRequest={setRequestDomiciliaryCompanyRequest} />
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
        Enviar solicitud para afiliarse a esta empresa
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={(e) =>
            handleChange(e, requestDomiciliaryCompanyRequest, 'agree')
          }
        >
          Aceptar
        </Button>
        <Button
          color="danger"
          onClick={(e) =>
            handleChange(
              e,
              requestDomiciliaryCompanyRequest,
              'refused'
            )
          }
        >
          Rechazar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const RequestCard = ({ domiciliary, handleRequestClose
  , setRequestDomiciliaryCompanyRequest }) => {
  return (
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
          <Button
            color="success"
            onClick={(e) => {
              handleRequestClose(e);
              setRequestDomiciliaryCompanyRequest({
                companyId: domiciliary.company.id,
                requestDomiciliaryCompanyRequestId:
                  domiciliary.id,
              });
            }}
          >
            Responder
          </Button>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RequestDomiciliaryList;
