import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, ConfirmDialog } from 'prizma-ui';
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

  const handleDeleteClose = () => {
    setToggleDelete(false);
  };

  const handleDelete = () => {
    dispatch(deleteDomiciliaryCompanyAction(deleteDomiciliaryCompany));
    setToggleDelete(false);
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {domiciliaryCompany.map((domiciliary, i) => (
            <div
              key={i}
              style={{ marginTop: '10px', width: 'calc(33.33% - 10px)', minWidth: '260px' }}
            >
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
                    {domiciliary.company.name} {domiciliary.company.lastName}
                  </p>
                  <p>{domiciliary.company.documentNumber}</p>
                  <p>{domiciliary.company.email}</p>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeleteDomiciliaryCompany(domiciliary.id);
                      setToggleDelete(true);
                    }}
                  >
                    Eliminar
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={toggleDelete}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Confirmar"
        message="¿ Estás seguro/a de que desea eliminar la relación con esta empresa ??"
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        tone="danger"
      />
    </>
  );
};

export default MyDomiciliaryList;
