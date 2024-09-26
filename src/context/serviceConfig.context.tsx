/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { ServiceConfigType, ServiceTypes } from '../containers/scm/selectService/types';
import { FormInstance } from 'antd';

export type FormValidationState = "error" | "warning" | "success" | "validating";

export type ServiceConfigTypeContextValues = {
  selectedServiceConfig?: ServiceConfigType
  selectedService?: ServiceTypes
  form?: FormInstance
  formValidationState?: FormValidationState
};

export const ServiceConfigTypeContext = React.createContext<ServiceConfigTypeContextValues>(
  null as ServiceConfigTypeContextValues
);

export const ServiceConfigTypeProvider = ({
  children,
  value,
}: {
  children?: React.ReactNode;
  value?: ServiceConfigTypeContextValues;
}) => {

  return (
    <ServiceConfigTypeContext.Provider
      value={{ ...value, }}
    >
      {children}
    </ServiceConfigTypeContext.Provider>
  );
};


export const useServiceConfigTypeProvider = () => {
  try {
    return useContext(ServiceConfigTypeContext);
  } catch (error) {
    throw new Error('useServiceConfigTypeProvider must be used within ServiceConfigTypeProvider wrapper component')
  }
}