/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps, useRef } from 'react';
import API from '../../../services';
import {
  ButtonProps,
  Col,
  Popover,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import './style.scss';

import { AppContext } from '../../../context/AppProvider';
import { Footer } from '../../../components/footer';
import { ServiceTypes } from './types';

import Event from '../../../utils/Events/index';
import { EventTypes } from '../../../utils/Events/types';
import { FormArea } from './formArea';
import { ProviderCard } from './providerCard';

type VoidFunction = () => void;

export const SelectService = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const [services, setServices] = React.useState<Array<ServiceTypes>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const childRef = React.useRef<{
    onIntegrate: (callBack: VoidFunction) => void;
    loading: boolean;
  }>();

  const {
    setCurrentStep,
    current,
    setSelectedService: setSelected,
    selectedService: selected,
    accessKey: key,
    domain,
  } = React.useContext(AppContext);

  const getServices = async () => {
    setLoading(true);
    const headers = { key };
    try {
      const resp = await API.services.getServices(
        { type: domain, state: 'ACTIVE' },
        headers
      );
      if (resp && resp.data.data) {
        setServices(resp.data.data);
      }
    } catch (error) {
      console.log(error);
      setServices([])
    } finally {
      setLoading(false);
    }
  };

  const selectHandler = (selected) => {
    setSelected(selected);
  };

  const handleNext = () => {
    childRef.current.onIntegrate(() => {
      setCurrentStep(current + 1)
    });
  };

  React.useEffect(() => {
    getServices();
  }, [domain]);

  React.useEffect(() => {
    /* events */
    Event.customREventList.forEach((event: EventTypes) => {
      Event.on(event, getServices);
    })

    return () => {
      Event.customREventList.forEach((event: EventTypes) => {
        Event.off(event, getServices);
      })
    };
  }, []);

  const onOkProps: ButtonProps = {
    disabled: !selected,
    loading: childRef.current?.loading,
  };

  return (
    <Space
      direction="vertical"
      className="w-full select_service"
      style={{ height: '100%', justifyContent: 'space-between' }}
    >
      <div {...props} ref={ref} id="service_profile" style={{ flex: 1 }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Typography.Title level={5}>Available services</Typography.Title>
          {loading && <Skeleton />}
          {!loading && (
            <Row className="w-full" gutter={[20, 20]}>
              {Array.isArray(services) &&
                services.map((item, index) => {
                  return (
                    <Popover
                      key={index}
                      overlayStyle={{ width: 'calc(100% - 250px)', marginLeft: '250px' }}
                      content={
                        <FormArea
                          ref={childRef as any}
                          selected={services.find((item) => item?.id === selected) as any}
                        />
                      }
                      forceRender
                      trigger={['click']}
                      placement='bottom'
                      open={false}
                    >
                      <Col
                        className="w-full"
                        span={24}
                        md={12}
                        xl={10}
                        xxl={6}
                        key={index}
                      >
                        <ProviderCard
                          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                          bordered
                          rootClassName="card"
                          aria-selected={selected === item?.id}
                          onSelect={() => selectHandler(item?.id)}
                          item={item}
                        />
                      </Col>
                    </Popover >
                  );
                })}
            </Row>
          )}
          <FormArea
            ref={childRef as any}
            selected={services.find((item) => item?.id === selected) as any}
          />
        </div>
      </div>
      <Footer hideBackButton onSubmit={handleNext} onOkProps={onOkProps} />
    </Space>
  );
});
