import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Input, ConfirmDialog } from 'prizma-ui';
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

  const handleRequestClose = () => {
    setToggleRequest(false);
  };

  const handleRequest = () => {
    dispatch(
      createDomiciliaryCompanyRequestAction({
        company: user.id,
        domiciliary: requestDomiciliaryCompanyRequest,
      })
    );
    setToggleRequest(false);
  };

  React.useEffect(() => {
    dispatch(domiciliarysByCompanyDomiciliaryCompanyRequestAction());
  }, []);

  const handleKeyPress = (target) => {
    if (target.key === 'Enter') {
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
      } else if (domiciliary.lastName.includes(orderWord)) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (domiciliary.documentNumber.includes(orderWord)) {
        orderDomiciliarySearchSelected.push(domiciliary);
      } else if (domiciliary.clientPhone.includes(orderWord)) {
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

  const list =
    domiciliaryOrdersFiltering !== null
      ? domiciliaryOrdersFiltering
      : domiciliarys;

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
          onKeyDown={handleKeyPress}
          className="search-views-standard"
        />
        <br />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {list.map((domiciliary, i) => (
            <DomiciliaryRequestCard
              key={i}
              domiciliary={domiciliary}
              onRequestClick={(id) => {
                setRequestDomiciliaryCompanyRequest(id);
                setToggleRequest(true);
              }}
            />
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={toggleRequest}
        onClose={handleRequestClose}
        onConfirm={handleRequest}
        title="Confirmar"
        message="¿Quieres enviar una solicitud para afiliar este domiciliario?"
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        tone="primary"
      />
      <Button
        variant="ghost"
        className="button-reload"
        onClick={() => dispatch(domiciliarysByCompanyDomiciliaryCompanyRequestAction())}
      >
        <RxReload />
      </Button>
    </>
  );
};

const DomiciliaryRequestCard = ({ domiciliary, onRequestClick }) => (
  <div style={{ marginTop: '10px', width: 'calc(33.33% - 10px)', minWidth: '260px' }}>
    <Card
      raised
      style={{
        margin: 0,
        padding: 0,
        paddingBottom: '10px',
        width: '100%',
        height: 'fit-content',
        maxHeight: '90%',
      }}
    >
      <CardBody>
        <p>
          {domiciliary.name} {domiciliary.lastName}
        </p>
        <p>Documento: {domiciliary.documentNumber}</p>
        <p>{domiciliary.email}</p>
        <Button
          variant="primary"
          onClick={() => onRequestClick(domiciliary.id)}
        >
          Enviar solicitud
        </Button>
      </CardBody>
    </Card>
  </div>
);

export default RequestDomiciliaryList;
