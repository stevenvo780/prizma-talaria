import * as React from 'react';
import { Alert } from 'prizma-ui';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../../store/reducer';

const InfoAlert = () => {
  const notifications = useSelector((state) => state.ui.notifications);
  const dispatch = useDispatch();

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className='info-alert' aria-live="polite" aria-atomic="true">
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

// Map reactstrap color names to prizma-ui Alert tone values
const colorToTone = (color) => {
  const map = {
    danger: 'danger',
    success: 'success',
    warning: 'warning',
    info: 'info',
    primary: 'info',
    secondary: 'info',
  };
  return map[color] ?? 'info';
};

const AlertComponent = ({ id, color, message, onRemoveNotification }) => {
  const [visible, setVisible] = React.useState(true);

  const onDismiss = () => {
    setVisible(false);
    onRemoveNotification(id);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemoveNotification(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemoveNotification]);

  if (!visible) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Alert
        tone={colorToTone(color)}
        style={{
          display: 'inline-block',
          whiteSpace: 'pre-wrap',
          pointerEvents: 'auto',
          wordWrap: 'break-word',
          overflowY: 'auto',
          cursor: 'pointer',
        }}
        onClick={onDismiss}
      >
        {message}
      </Alert>
    </div>
  );
};

export default InfoAlert;
