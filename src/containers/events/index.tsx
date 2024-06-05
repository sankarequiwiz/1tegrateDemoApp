/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import './style.scss';
import { useLayout } from '../../hooks/useLayout';
import { EventList } from './eventList';
import { EventContent } from './eventContent';
import { WatchContext } from '../../context/WatchContext';
import { Col, Row } from 'antd';

type EventContextType = {
  selected?: { [key: string]: any };
};
export const EventContext = React.createContext<EventContextType>(null);

export const Events = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const { style } = useLayout();
  const { events } = React.useContext(WatchContext);

  const [selected, setSelected] = React.useState<{
    item: { [key: string]: unknown };
    index: number;
  }>(undefined);

  const onSelect = (item: { [key: string]: any }, index: number) => {
    setSelected({ item, index });
  };

  React.useEffect(() => {
    if (events.length) setSelected({ index: 0, item: events[0] });
  }, []);

  return (
    <EventContext.Provider value={{ selected }}>
      <Row
        {...(props as any)}
        style={{ ...style, width: '100%' }}
        className="event-list"
        ref={ref}
      >
        <Col span={5} className="event-selector">
          <EventList onSelect={onSelect} dataSource={events as any} />
        </Col>
        <Col span={18}>
          <EventContent className="event-content" />
        </Col>
      </Row>
    </EventContext.Provider>
  );
});
