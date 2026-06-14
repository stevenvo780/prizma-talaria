import * as React from 'react';
import { Alert } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../../store/reducer';

const InfoAlert = () => {
  const notifications = useSelector((state) => state.ui.notifications);
  const dispatch = useDispatch();

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className='info-alert'>
      {notifications.map((notification, i) => (
        <AlertComponent
          key={i}
          id={notification.id}
          color={notification.color}
          message={notification.message}
          onRemoveNotification={handleRemoveNotification}
        />
      ))}
    </div>
  );
};

const AlertComponent = ({ id, color, message, onRemoveNotification, i }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const onDismiss = () => {
    setIsOpen(false);
    onRemoveNotification(id);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemoveNotification(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemoveNotification]);

  return (
    <div
      key={i}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Alert
        color={color}
        isOpen={isOpen}
        toggle={onDismiss}
        style={{
          display: 'inline-block',
          whiteSpace: 'pre-wrap',
          pointerEvents: 'auto',
          wordWrap: 'break-word',
          overflowY: 'auto', // Agrega la posibilidad de desplazamiento vertical si el texto excede el límite de altura
        }}
      >
        {message}
      </Alert>
    </div>
  );
};

export default InfoAlert;
