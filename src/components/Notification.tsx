/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  ListProps,
  Popover,
  List as AntList,
  Typography,
  Space,
  Divider,
  Modal,
} from 'antd';
import React, { HTMLProps } from 'react';
import { socket } from '../config/socket';
import { WatchContext, WatchEvents } from '../context/WatchContext';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EventMessageIcon } from './Events';
import { useNavigate } from 'react-router-dom';

const { Item } = AntList;

type CodeBlockTypes = {
  selected?: { [key: string]: any };
};

export const CodeBlock = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & CodeBlockTypes
>(({ selected, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}
    >
      {
        <SyntaxHighlighter style={nord}>
          {JSON.stringify(selected?.payload, null, 2)}
        </SyntaxHighlighter>
      }
    </div>
  );
});

type WatchDogTypes = {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WatchDog = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & WatchDogTypes
>(({ setOpen, ...props }, ref) => {
  const [modal, setModal] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<WatchEvents>(undefined);
  const { events } = React.useContext(WatchContext);

  const handleOpenModal = (newSelected: WatchEvents) => {
    setSelected(newSelected);
    setModal(true);
  };

  const handleClose = () => {
    setSelected(undefined);
    setModal(false);
  };

  const onSelect = (newSelected: WatchEvents) => {
    handleOpenModal(newSelected);
  };

  const listProps: ListProps<unknown> = {
    dataSource: events,
    style: { height: 100 },
  };

  return (
    <div {...props} ref={ref}>
      <List
        setOpen={setOpen}
        onSelect={(arg) => onSelect(arg)}
        listProps={listProps}
      />
      <Modal
        footer={false}
        width={800}
        title={`Events for the ${selected?.name}`}
        open={modal}
        onCancel={handleClose}
      >
        {selected && <CodeBlock selected={selected as any} />}
      </Modal>
    </div>
  );
});

type LisTypes = {
  listProps?: ListProps<unknown>;
  onSelect?: (selected: WatchEvents) => void;
} & Pick<WatchDogTypes, 'setOpen'>;

export const List = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & LisTypes
>(({ listProps, onSelect, setOpen, ...props }, ref) => {
  const { clearEvents } = React.useContext(WatchContext);
  const navigate = useNavigate();

  const handleEventSelect = (selected: WatchEvents) => {
    onSelect && onSelect(selected);
  };

  return (
    <div {...props} ref={ref}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Text strong>{'Events'}</Typography.Text>
        <Space>
          <Button size="small" onClick={clearEvents}>
            Clear All Events
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              navigate('/events');
              setOpen(false);
            }}
          >
            View all
          </Button>
        </Space>
      </Space>
      <Divider style={{ margin: '10px 0' }} />
      <AntList
        {...listProps}
        style={{ minWidth: '400px' }}
        loading={false}
        renderItem={(item: WatchEvents) => {
          if (item.payload) {
            return (
              <Item onClick={() => handleEventSelect(item)}>
                <Item.Meta
                  avatar={<EventMessageIcon />}
                  title={<a>{item.name}</a>}
                  description={
                    <Typography.Paragraph ellipsis={true}>
                      {`${JSON.stringify(item?.payload)}`}
                    </Typography.Paragraph>
                  }
                />
              </Item>
            );
          }
        }}
      />
    </div>
  );
});

export const Notification = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const { setEvents, events } = React.useContext(WatchContext);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    socket.onConnect = () => {
      console.log('websocket connected!');
      socket.subscribe('/topic/events', (message) => {
        setEvents(JSON.parse(message?.body));
      });
    };

    socket.onWebSocketError = (error) => {
      console.error('Error with websocket', error);
    };

    socket.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    socket.activate();
  }, []);

  return (
    <div {...props} ref={ref}>
      <Popover
        onOpenChange={(newOpen) => !newOpen && setOpen(false)}
        open={open}
        forceRender
        id="notification-container"
        placement="bottomRight"
        content={<WatchDog setOpen={setOpen} />}
        trigger={['click']}
      >
        <Badge size="small" count={events.length} offset={[10, 10]}>
          <Button
            onClick={() => setOpen(true)}
            size="small"
            shape="circle"
            icon={<EventMessageIcon />}
          />
        </Badge>
      </Popover>
    </div>
  );
});
