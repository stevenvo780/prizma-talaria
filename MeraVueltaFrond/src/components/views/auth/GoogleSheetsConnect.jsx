import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { updateUserAction } from '../../../store/reducer';
import {
  Container,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Card,
  Row,
  CardBody,
} from 'reactstrap';
import InfoAlert from '../../hooks/InfoAlert';

export const GoogleSheetsConnect = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.login.user);
  const [googleSheets, setGoogleSheets] = useState(user.googleSheets);

  const handleGoogleSheetsChange = (googleSheetsData) => {
    setGoogleSheets(googleSheetsData.target.value);
  };

  const handleUpdateUser = (event) => {
    event.preventDefault();
    let data = {
      googleSheets: googleSheets,
    };
    dispatch(updateUserAction({ id: user.id, data: data }));
    dispatch(push('/'));
  };

  return (
    <>
      <div>
        <Container className="themed-container">
          <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#0c5460' }}>
            Conecta con Google Sheets y lleva tus reportes al siguiente nivel
          </h2>
          <Card style={{ width: '100%', height: 'auto', backgroundColor: '#d1ecf1', borderColor: '#bee5eb' }}>
            <CardBody>
              <ol>
                <li>
                  Descarga el formato de Google Sheets y sube el archivo a tu Google Drive.
                </li>
                <li>
                  Luego cambia los permisos de tu archivo a "Cualquier persona con el enlace" y "Puede editar".
                </li>
                <li>
                  Copia el enlace de tu archivo y pégalo en el campo de abajo.
                </li>
                <li>
                  Oprime el botón "Guardar" y listo.
                </li>
              </ol>
            </CardBody>
          </Card>
          <hr />
          <Form className="form">
            <Col>
              <h5 style={{ fontWeight: 'bold', color: '#0c5460' }}>URL de Google Sheets:</h5>
              <FormGroup row>
                <Col sm={10}>
                  <Input
                    type="text"
                    id="sheet.besUrl"
                    defaultValue={user.googleSheets}
                    placeholder="Agrega tu link de tu archivo de Google Sheets"
                    onChange={handleGoogleSheetsChange}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Form>
          <Row>
            <Col sm={2}>
              <Button
                color="success"
                onClick={handleUpdateUser}
              >
                Guardar
              </Button>
            </Col>
            <Col sm={10}>
              <div>
                <a href={process.env.REACT_APP_URL_FORMAT_GOOGLE_SHEETS_DB} download>
                  <Button color="info">Descargar formato</Button>{' '}
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
