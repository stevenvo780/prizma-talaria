import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Input, ConfirmDialog } from 'prizma-ui';
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

  const handleDeleteClose = () => {
    setToggleDelete(false);
  };

  const handleDelete = () => {
    dispatch(deleteDomiciliaryCompanyRequestAction(deleteDomiciliaryCompanyRequest));
    setToggleDelete(false);
  };

  React.useEffect(() => {
    dispatch(getAllDomiciliaryCompanyRequestByCompanyAction());
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

  const list =
    domiciliaryOrdersFiltering !== null
      ? domiciliaryOrdersFiltering
      : domiciliaryCompanyRequest;

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
              domiciliary={domiciliary.domiciliary}
              onDeleteClick={(id) => {
                setDeleteDomiciliaryCompanyRequest(id);
                setToggleDelete(true);
              }}
            />
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={toggleDelete}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Confirmar"
        message="¿Estás seguro/a de que desea eliminar el pedido seleccionada?"
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        tone="danger"
      />
      <Button
        variant="ghost"
        className="button-reload"
        onClick={() => dispatch(getAllDomiciliaryCompanyRequestByCompanyAction())}
      >
        <RxReload />
      </Button>
    </>
  );
};

const DomiciliaryRequestCard = ({ domiciliary, onDeleteClick }) => (
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
          variant="danger"
          onClick={() => onDeleteClick(domiciliary.id)}
        >
          Eliminar
        </Button>
      </CardBody>
    </Card>
  </div>
);

export default RequestWaitingDomiciliaryList;
