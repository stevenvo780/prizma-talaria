import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Row,
  Alert,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  Input
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { confirmEmailAction, resendEmailAction } from '../../../store/reducer';

const ConfirmEmail = (props) => {
  const token = props.match.params.token;
  const dispatch = useDispatch();
  const errorConfirmEmail = useSelector((state) => state.login.errorConfirmEmail);
  const confirmEmail = useSelector((state) => state.login.user?.confirmEmail);
  const user = useSelector((state) => state.login.user);
  useEffect(() => {
    if (token != "null") {
      dispatch(confirmEmailAction(token));
    }
  }, []);
  useEffect(() => {
    if (user != null && user.confirmEmail === true) {
      dispatch(push('/'));
    }
  }, [user]);
  const [email, setEmail] = useState('');
  return (
    <Container>
      <Card
        style={{
          width: '100%',
          position: "relative",
          top: "30vh",
          height: "35vh",
        }}
      >
        <CardBody>
          <CardTitle tag="h5">
            Confirmar tu correo
          </CardTitle>
          <CardSubtitle
            className="mb-2 text-muted"
            tag="h6"
          >
            Se requiere confirmar tu correo
          </CardSubtitle>
          <Row>

            {(token == "null") && (
              <Col >
                <Alert color="info">
                  Ingresa a tu correo y confirma tu cuenta
                </Alert>
                {(user == null) && (
                  <>
                    <Input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={() => dispatch(resendEmailAction(email))}>Re enviar</Button>
                  </>
                )}
                {(user != null) && (
                  <>
                    <Button onClick={() => dispatch(resendEmailAction(user.email))}>Re enviar</Button>
                  </>
                )}
                <Button onClick={() => dispatch(push('/'))}>Volver</Button>
              </Col>
            )}
            {(token != "null") && (
              <>
                {(errorConfirmEmail === true) && (
                  <Col>
                    <Alert color="danger">Ocurrió un error al confirmar tu correo</Alert>
                    {(user == null) && (
                      <>
                        <Input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
                        <Button onClick={() => dispatch(resendEmailAction(email))}>Re enviar</Button>
                      </>
                    )}
                    {(user != null) && (
                      <>
                        <Button onClick={() => dispatch(resendEmailAction(user.email))}>Re enviar</Button>
                      </>
                    )}
                    <Button onClick={() => dispatch(push('/'))}>Volver</Button>
                  </Col>
                )}
                {(errorConfirmEmail === false) && (
                  <>
                    {(confirmEmail === true) && (
                      <Col>
                        <Alert color="success">Email confirmado correctamente</Alert>
                        <Button onClick={(e) => { e.preventDefault(); dispatch(push('/')) }}>Continuar</Button>
                      </Col>
                    )}
                    {(confirmEmail === false) && (
                      <Col>
                        <Alert color="info">Confirmando el correo</Alert>
                      </Col>
                    )}
                  </>
                )}
              </>
            )}
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ConfirmEmail;
