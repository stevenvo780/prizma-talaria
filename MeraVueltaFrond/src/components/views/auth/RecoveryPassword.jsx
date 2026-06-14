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
  Input,
  Label
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { sendEmailRecoveryPasswordAction, recoveryPasswordAction } from '../../../store/reducer';

const RecoveryPassword = (props) => {
  const token = props.match.params.token;
  const dispatch = useDispatch();
  const recoveryPasswordError = useSelector((state) => state.login.recoveryPasswordError);
  const recoveryPasswordState = useSelector((state) => state.login.recoveryPassword);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirm = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const recoveryPassword = (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      dispatch(recoveryPasswordAction({
        token,
        password,
      }));
    } else {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <Container>
      <Card
        style={{
          width: '100%',
          position: "relative",
          top: "30vh",
          height: "42vh",
        }}
      >
        <CardBody>
          <CardTitle tag="h5">
          Recuperar contraseña
          </CardTitle>
          <Row>
            {(token == "null") && (
              <Col >
                <Alert color="info">Ingresa tu correo para recuperar tu contraseña</Alert>
                <Label>Te llegara un correo con una URL para recuperar tu contraseña</Label>
                <Input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
                <Button onClick={() => dispatch(sendEmailRecoveryPasswordAction(email))}>Re enviar</Button>
              </Col>
            )}
            {(token != "null") && (
              <>
                {(recoveryPasswordError === true) && (
                  <Col>
                    <Alert color="danger">Ocurrió un error al confirmar tu correo</Alert>
                    <Input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={() => dispatch(sendEmailRecoveryPasswordAction(email))}>Re enviar</Button>
                  </Col>
                )}
                {(recoveryPasswordError === false) && (
                  <>
                    {(recoveryPasswordState === true) && (
                      <Col>
                        <Alert color="success">Email confirmado correctamente</Alert>
                        <Button onClick={(e) => { e.preventDefault(); dispatch(push('/')) }}>Continuar</Button>
                      </Col>
                    )}
                    {(recoveryPasswordState === false) && (
                      <Col>
                        <Alert color="info">Ingresa tu nueva contraseña</Alert>
                        <Input type="password" placeholder="Contraseña" onChange={handlePassword} />
                        <br/>
                        <Input type="password" placeholder="Confirmar contraseña" onChange={handlePasswordConfirm} />
                        <Button onClick={recoveryPassword}>Confirmar</Button>
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

export default RecoveryPassword;
