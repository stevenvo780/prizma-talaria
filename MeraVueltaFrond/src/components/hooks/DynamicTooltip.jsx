import React, { useState, useCallback } from 'react';
import { Tooltip } from 'reactstrap';

const DynamicTooltip = React.memo(({
  targetId,
  tooltipText = 'Hello, I am a tooltip!',
  placement = 'right'
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = useCallback(() => {
    setTooltipOpen(prevState => !prevState);
  }, []);

  return (
    <Tooltip
      placement={placement}
      isOpen={tooltipOpen}
      target={targetId}
      toggle={toggle}
      boundariesElement="scrollParent"
    >
      {tooltipText}
    </Tooltip>
  );
});

export default DynamicTooltip;
