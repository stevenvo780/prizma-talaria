import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap';
import axios from 'axios';

const MessageConfig = () => {
  const [messageConfigs, setMessageConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' });

  const defaultMessages = [
    {
      messageKey: 'CLIENT_FILL_DATA',
      description: 'Mensaje que se envía al cliente pidiendo llenar datos',
      defaultText: 'Tienes una vuelta, de la empresa {companyName} con el numero de entrega {purchaseNumber}, por favor llena los datos en esta URL, {url}'
    }
  ];

  useEffect(() => {
    fetchMessageConfigs();
  }, []);

  const fetchMessageConfigs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/message-config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessageConfigs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching message configs:', error);
      setLoading(false);
    }
  };

  const saveMessageConfig = async (messageData) => {
    try {
      const token = localStorage.getItem('token');
      const isUpdate = messageData.id;
      
      const url = isUpdate ? `/api/message-config/${messageData.id}` : '/api/message-config';
      const method = isUpdate ? 'put' : 'post';
      
      await axios[method](url, messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showAlert('Configuración guardada exitosamente', 'success');
      fetchMessageConfigs();
      setModalOpen(false);
      setEditingMessage(null);
    } catch (error) {
      console.error('Error saving message config:', error);
      showAlert('Error al guardar la configuración', 'danger');
    }
  };

  const deleteMessageConfig = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/message-config/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showAlert('Configuración eliminada exitosamente', 'success');
      fetchMessageConfigs();
    } catch (error) {
      console.error('Error deleting message config:', error);
      showAlert('Error al eliminar la configuración', 'danger');
    }
  };

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color });
    setTimeout(() => setAlert({ show: false, message: '', color: 'success' }), 5000);
  };

  const openModal = (message = null) => {
    setEditingMessage(message || {
      messageKey: '',
      messageText: '',
      description: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMessageConfig(editingMessage);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title">Configuración de Mensajes</h5>
              <Button 
                color="primary" 
                size="sm" 
                onClick={() => openModal()}
                className="float-right"
              >
                Nuevo Mensaje
              </Button>
            </CardHeader>
            <CardBody>
              {alert.show && (
                <Alert color={alert.color}>
                  {alert.message}
                </Alert>
              )}

              <p className="text-muted">
                Configura los mensajes automáticos que se envían a los clientes. 
                Usa las siguientes variables: {'{companyName}'}, {'{purchaseNumber}'}, {'{deliveryNumber}'}, {'{url}'}
              </p>

              {defaultMessages.map((defaultMsg) => {
                const existingConfig = messageConfigs.find(config => config.messageKey === defaultMsg.messageKey);
                return (
                  <Card key={defaultMsg.messageKey} className="mb-3">
                    <CardBody>
                      <Row>
                        <Col md="8">
                          <h6>{defaultMsg.description}</h6>
                          <p className="text-muted">Clave: <code>{defaultMsg.messageKey}</code></p>
                          <div>
                            <Label>Mensaje actual:</Label>
                            <div style={{ 
                              backgroundColor: '#f8f9fa', 
                              padding: '10px', 
                              borderRadius: '4px',
                              border: '1px solid #dee2e6'
                            }}>
                              {existingConfig ? existingConfig.messageText : defaultMsg.defaultText}
                            </div>
                          </div>
                        </Col>
                        <Col md="4" className="text-right">
                          <div className="mb-2">
                            <span className={`badge ${existingConfig?.isActive ? 'badge-success' : 'badge-secondary'}`}>
                              {existingConfig?.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <Button 
                            color="primary" 
                            size="sm" 
                            onClick={() => openModal(existingConfig || {
                              messageKey: defaultMsg.messageKey,
                              messageText: defaultMsg.defaultText,
                              description: defaultMsg.description,
                              isActive: true
                            })}
                            className="mr-2"
                          >
                            {existingConfig ? 'Editar' : 'Configurar'}
                          </Button>
                          {existingConfig && (
                            <Button 
                              color="danger" 
                              size="sm" 
                              onClick={() => {
                                if (window.confirm('¿Estás seguro de eliminar esta configuración?')) {
                                  deleteMessageConfig(existingConfig.id);
                                }
                              }}
                            >
                              Eliminar
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                );
              })}

              {/* Mostrar configuraciones personalizadas */}
              {messageConfigs
                .filter(config => !defaultMessages.some(def => def.messageKey === config.messageKey))
                .map((config) => (
                  <Card key={config.id} className="mb-3">
                    <CardBody>
                      <Row>
                        <Col md="8">
                          <h6>{config.description || 'Mensaje personalizado'}</h6>
                          <p className="text-muted">Clave: <code>{config.messageKey}</code></p>
                          <div>
                            <Label>Mensaje:</Label>
                            <div style={{ 
                              backgroundColor: '#f8f9fa', 
                              padding: '10px', 
                              borderRadius: '4px',
                              border: '1px solid #dee2e6'
                            }}>
                              {config.messageText}
                            </div>
                          </div>
                        </Col>
                        <Col md="4" className="text-right">
                          <div className="mb-2">
                            <span className={`badge ${config.isActive ? 'badge-success' : 'badge-secondary'}`}>
                              {config.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <Button 
                            color="primary" 
                            size="sm" 
                            onClick={() => openModal(config)}
                            className="mr-2"
                          >
                            Editar
                          </Button>
                          <Button 
                            color="danger" 
                            size="sm" 
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de eliminar esta configuración?')) {
                                deleteMessageConfig(config.id);
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ))}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal para editar/crear mensajes */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={() => setModalOpen(false)}>
            {editingMessage?.id ? 'Editar Mensaje' : 'Nuevo Mensaje'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="messageKey">Clave del Mensaje</Label>
              <Input
                type="text"
                id="messageKey"
                value={editingMessage?.messageKey || ''}
                onChange={(e) => setEditingMessage({
                  ...editingMessage,
                  messageKey: e.target.value
                })}
                required
                disabled={!!editingMessage?.id}
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="description">Descripción</Label>
              <Input
                type="text"
                id="description"
                value={editingMessage?.description || ''}
                onChange={(e) => setEditingMessage({
                  ...editingMessage,
                  description: e.target.value
                })}
              />
            </FormGroup>

            <FormGroup>
              <Label for="messageText">Texto del Mensaje</Label>
              <Input
                type="textarea"
                id="messageText"
                rows="5"
                value={editingMessage?.messageText || ''}
                onChange={(e) => setEditingMessage({
                  ...editingMessage,
                  messageText: e.target.value
                })}
                required
              />
              <small className="text-muted">
                Variables disponibles: {'{companyName}'}, {'{purchaseNumber}'}, {'{deliveryNumber}'}, {'{url}'}
              </small>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={editingMessage?.isActive || false}
                  onChange={(e) => setEditingMessage({
                    ...editingMessage,
                    isActive: e.target.checked
                  })}
                />
                Mensaje activo
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {editingMessage?.id ? 'Actualizar' : 'Crear'}
            </Button>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </Container>
  );
};

export default MessageConfig;