import React from 'react';
import { Tooltip } from 'prizma-ui';

const DynamicTooltip = React.memo(({
  targetId,
  tooltipText = 'Hello, I am a tooltip!',
  placement = 'right',
  children,
}) => {
  return (
    <Tooltip
      label={tooltipText}
      placement={placement}
    >
      {children ?? <span id={targetId} />}
    </Tooltip>
  );
});

export default DynamicTooltip;
