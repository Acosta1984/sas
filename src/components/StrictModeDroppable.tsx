import { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

interface StrictModeDroppableProps {
  droppableId: string;
  type?: string;
  mode?: string;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  ignoreContainerClipping?: boolean;
  renderClone?: any;
  getContainerForClone?: () => HTMLElement;
  children: (provided: any, snapshot: { isDraggingOver: boolean }) => React.ReactNode;
}

export const StrictModeDroppable = ({ 
  children,
  droppableId,
  type = 'DEFAULT',
  mode = 'standard',
  isDropDisabled = false,
  isCombineEnabled = false,
  direction = 'vertical',
  ignoreContainerClipping = false,
  renderClone,
  getContainerForClone,
}: StrictModeDroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }
  
  return (
    <Droppable
      droppableId={droppableId}
      type={type}
      mode={mode}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      direction={direction}
      ignoreContainerClipping={ignoreContainerClipping}
      renderClone={renderClone}
      getContainerForClone={getContainerForClone}
    >
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
};

StrictModeDroppable.displayName = 'StrictModeDroppable';