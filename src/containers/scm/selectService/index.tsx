/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps, useEffect, useState } from 'react';
import API from '../../../services';
import {
  ButtonProps,
  Skeleton,
  Space,
  Alert,
  Typography,
} from 'antd';
import './style.scss';

import { AppContext } from '../../../context/AppProvider';
import { Footer } from '../../../components/footer';
import { ServiceTypes } from './types';

import Event from '../../../utils/Events/index';
import { EventTypes } from '../../../utils/Events/types';
import { TileList } from './TileList';

type VoidFunction = () => void;

const warningMsg =
  'Warning: API Key not configured yet. Please configure the API Key to proceed.';
export const SelectService = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const [services, setServices] = React.useState<Array<ServiceTypes>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [servicesError, setServicesError] = React.useState<any>("");

  const childRef = React.useRef<{
    onIntegrate: (callBack: VoidFunction) => void;
    loading: boolean;
  }>();

  const {
    selectedService: selected,
    accessKey: key,
    domain,
    setIntegration
  } = React.useContext(AppContext);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function compare(a: any, b: any) {
    const bandA = a?.serviceProfile?.name.toUpperCase();
    const bandB = b?.serviceProfile?.name.toUpperCase();

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
        setServicesError("")
      }
    } catch (error) {
      console.log(error, "error is printing here");
      setServices([])
      setServicesError(error)
    } finally {
      setLoading(false);
    }
  };

  const onSelectTile = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  }

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

  useEffect(() => {
    setIntegration(null)
  }, [])

  const onOkProps: ButtonProps = {
    disabled: !selected,
    loading: childRef.current?.loading,
    style: { display: 'none' }
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
          {loading ? (
            <Skeleton />
          ) : key ? (
            <div>
              {services.length ? (
                <div>
                  <Typography.Title level={5}>Available services</Typography.Title>
                  <TileList
                    items={services}
                    selectedIndex={selectedIndex}
                    onSelectTile={onSelectTile}
                    selectedService={services.find((item) => item?.id === selected)}
                  />
                </div>
              ) : (
                servicesError?.response?.data?.map((item => item?.statusCode))?.length ? (
                  <div>
                    <Alert
                      message={<Typography.Title
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                        level={4}>
                        {(servicesError?.response?.data ?? [])?.map((item => item.errorMessage))}
                      </Typography.Title>}
                      type="warning"
                      className="custom-alert custom-warning"
                      showIcon
                    />
                  </div>
                ) : (<Alert
                  message={<Typography.Title level={4}>Subscription or Services not Enabled</Typography.Title>}
                  description={<div>
                    <p>It appears that you currently do not have an active subscription or any services enabled on your account. To start using services, please visit the
                      Customer Portal
                      and navigate to the
                      Services
                      tab under "Setup Integrations". </p>
                    <br />
                    <p>
                      If you don't have a subscription yet, you can request one by reaching out to <a href="mailto:sales@unizo.in"> Unizo representative </a> . They will assist you in setting up the appropriate subscription plan tailored to your needs.</p>
                  </div>
                  }
                  type="warning"
                  className="custom-alert custom-warning"
                  showIcon
                />)
              )}
            </ div>
          ) : <Alert type="error" message={warningMsg} banner />
          }
        </div>
      </div>
      <Footer hideBackButton onOkProps={onOkProps} />
    </Space>
  );
});
