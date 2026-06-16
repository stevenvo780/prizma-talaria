import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Label,
  Field,
  Checkbox,
  Textarea,
  Modal,
  Alert,
  Badge,
  Spinner,
} from 'prizma-ui';
import axios from 'axios';

const MessageConfig = () => {
  const [messageConfigs, setMessageConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', tone: 'success' });

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

  const showAlert = (message, tone) => {
    setAlert({ show: true, message, tone });
    setTimeout(() => setAlert({ show: false, message: '', tone: 'success' }), 5000);
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
    return <Spinner label="Cargando..." />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <Card>
            <CardHeader
              title={<h1 className="title" style={{ fontSize: '1.25rem' }}>Configuración de Mensajes</h1>}
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openModal()}
                >
                  Nuevo Mensaje
                </Button>
              }
            />
            <CardBody>
              {alert.show && (
                <Alert tone={alert.tone}>
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
                      <div className="row">
                        <div className="col-md-8">
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
                        </div>
                        <div className="col-md-4 text-right">
                          <div className="mb-2">
                            <Badge tone={existingConfig?.isActive ? 'success' : 'neutral'}>
                              {existingConfig?.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <Button
                            variant="primary"
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
                              variant="danger"
                              size="sm"
                              onClick={() => setConfirmDeleteId(existingConfig.id)}
                            >
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </div>
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
                      <div className="row">
                        <div className="col-md-8">
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
                        </div>
                        <div className="col-md-4 text-right">
                          <div className="mb-2">
                            <Badge tone={config.isActive ? 'success' : 'neutral'}>
                              {config.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openModal(config)}
                            className="mr-2"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setConfirmDeleteId(config.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal para editar/crear mensajes */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMessage?.id ? 'Editar Mensaje' : 'Nuevo Mensaje'}
        footer={
          <>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              {editingMessage?.id ? 'Actualizar' : 'Crear'}
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Field label="Clave del Mensaje" htmlFor="messageKey">
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
          </Field>

          <Field label="Descripción" htmlFor="description">
            <Input
              type="text"
              id="description"
              value={editingMessage?.description || ''}
              onChange={(e) => setEditingMessage({
                ...editingMessage,
                description: e.target.value
              })}
            />
          </Field>

          <Field
            label="Texto del Mensaje"
            htmlFor="messageText"
            help="Variables disponibles: {companyName}, {purchaseNumber}, {deliveryNumber}, {url}"
          >
            <Textarea
              id="messageText"
              rows={5}
              value={editingMessage?.messageText || ''}
              onChange={(e) => setEditingMessage({
                ...editingMessage,
                messageText: e.target.value
              })}
              required
            />
          </Field>

          <Checkbox
            label="Mensaje activo"
            checked={editingMessage?.isActive || false}
            onChange={(e) => setEditingMessage({
              ...editingMessage,
              isActive: e.target.checked
            })}
          />
        </form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirmar eliminación"
        footer={
          <>
            <Button
              variant="danger"
              onClick={() => {
                deleteMessageConfig(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Eliminar
            </Button>
            <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
              Cancelar
            </Button>
          </>
        }
      >
        <p>¿Estás seguro de eliminar esta configuración?</p>
      </Modal>
    </div>
  );
};

export default MessageConfig;
