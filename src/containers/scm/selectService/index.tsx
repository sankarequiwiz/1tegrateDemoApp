/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import API from '../../../services';
import {
  ButtonProps,
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
import { TileList } from './TileList';

type VoidFunction = () => void;
type ObjType = { [key: string]: any }

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
    selectedService: selected,
    accessKey: key,
    domain,
  } = React.useContext(AppContext);

  function compare(a: ObjType, b: ObjType) {
    const bandA = a.serviceProfile.name.toUpperCase();
    const bandB = b.serviceProfile.name.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  const getServices = async () => {
    setLoading(true);
    const headers = { key };
    try {
      const resp = await API.services.getServices(
        { type: domain, state: 'ACTIVE' },
        headers
      );
      if (resp && resp.data.data) {
        const data = resp.data.data;
        data?.sort(compare)
        setServices(data);
      }
    } catch (error) {
      console.log(error);
      setServices([])
    } finally {
      setLoading(false);
    }
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
          {loading ? <Skeleton /> : <TileList
            items={services}
            formContent={
              <FormArea
                ref={childRef as any}
                selected={services.find((item) => item?.id === selected) as any}
              />
            }
          />}
        </div>
      </div>
      <Footer hideBackButton onSubmit={handleNext} onOkProps={onOkProps} />
    </Space>
  );
});
