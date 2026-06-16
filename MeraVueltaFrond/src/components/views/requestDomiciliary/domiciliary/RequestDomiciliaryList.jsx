import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Modal } from 'prizma-ui';
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
    if (e) e.preventDefault();
    setToggleRequest(!toggleRequest);
  };

  const handleRequest = (
    event,
    requestDomiciliaryCompanyRequestSelected,
    response
  ) => {
    if (event) event.preventDefault();
    setToggleRequest(false);
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
          height: 'calc(100vh - 100px)',
          width: '98%',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {domiciliaryCompanyRequests.map((domiciliary, i) => (
            <RequestCard
              key={i}
              domiciliary={domiciliary}
              handleRequestClose={handleRequestClose}
              setRequestDomiciliaryCompanyRequest={setRequestDomiciliaryCompanyRequest}
            />
          ))}
        </div>
      </div>
      <RequestDomiciliaryCompanyRequestModal
        toggle={toggleRequest}
        handleChange={handleRequest}
        handleClose={() => setToggleRequest(false)}
        requestDomiciliaryCompanyRequest={requestDomiciliaryCompanyRequest}
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
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            onClick={(e) =>
              handleChange(e, requestDomiciliaryCompanyRequest, 'agree')
            }
          >
            Aceptar
          </Button>
          <Button
            variant="danger"
            onClick={(e) =>
              handleChange(e, requestDomiciliaryCompanyRequest, 'refused')
            }
          >
            Rechazar
          </Button>
        </div>
      }
    >
      Enviar solicitud para afiliarse a esta empresa
    </Modal>
  );
};

const RequestCard = ({ domiciliary, handleRequestClose, setRequestDomiciliaryCompanyRequest }) => {
  return (
    <div style={{ width: '30%', minWidth: '200px' }}>
      <Card raised style={{ marginBottom: '10px' }}>
        <CardBody>
          <p>{domiciliary.company.name} {domiciliary.company.lastName}</p>
          <p>{domiciliary.company.documentNumber}</p>
          <p>{domiciliary.company.email}</p>
          <Button
            variant="primary"
            onClick={(e) => {
              handleRequestClose(e);
              setRequestDomiciliaryCompanyRequest({
                companyId: domiciliary.company.id,
                requestDomiciliaryCompanyRequestId: domiciliary.id,
              });
            }}
          >
            Responder
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default RequestDomiciliaryList;
