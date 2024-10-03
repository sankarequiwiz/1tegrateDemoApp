import { Button, Flex, Modal, ModalProps, Result, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import services from "../../../../services";
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { useAppProvider } from "../../../../context/AppProvider";
import { ProviderIndicator } from "./providerIndicator";
import { CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";


type ConfirmationModalProps = {
} & ModalProps

const getSuccessUrl = () => {
   let successUrl = new URL(window.location.href),
      params = new URLSearchParams(successUrl.search);

   params.set('current', '1');
   successUrl.search = params.toString();

   return successUrl.href;
},
   getFailureUrl = () => {
      let failedUrl = new URL(window.location.href),
         params = new URLSearchParams(failedUrl.search);

      params.set('isIntegrationFailed', 'true');
      failedUrl.search = params.toString();

      return failedUrl.href
   },
   OK_BUTTON_STYLES: React.CSSProperties = { background: 'green' };

const mockResponse = { formUrl: "https://link-not-found" } // todo

export const RedirectAcceptanceModal = (props: ConfirmationModalProps) => {

   const {
      selectedService,
   } = useServiceConfigTypeProvider();

   const {
      setRedirectModalOpen,
      setAccessPointModalOpen,
      setIsIntegrationFailed,
      isIntegrationFailed,
      organization
   } = useAppProvider()

   const [loading, setLoading] = useState<boolean>(true);
   const [redirectDetails, setRedirectionDetails] = useState(mockResponse);
   const [isError, setIsError] = useState(false)

   const getRedirection = async () => {

      try {
         setLoading(true);
         const { data } = await services.services.buildInstallationFormUrl(selectedService?.id, {
            params: {
               successUrl: getSuccessUrl(),
               failureUrl: getFailureUrl()
            }
         })
         setRedirectionDetails(data)
      } catch (error) {
         console.log(error)
         setIsError(true);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getRedirection()
   }, [])

   const onTryAgain = () => {
      setRedirectModalOpen(false)
      setAccessPointModalOpen(true);
      setIsIntegrationFailed(false)
   }
   const onClose = () => {
      setRedirectModalOpen(false)
   }
   
   const providerName = selectedService?.serviceProfile?.name;

   return (
      <Modal
         {...props}
         footer={false}
         closeIcon={null}
      >
         {loading ? (
            <Skeleton />
         ) : (
            isError ? (
               <Result
                  title='Could not get provider details!'
                  subTitle='Something went wrong with your authentication details'
                  status={'500'}
                  extra={
                     <Button onClick={getRedirection} type="primary" >
                        Refresh
                     </Button>
                  }
               />
            ) : (
               !isIntegrationFailed ? (
                  <div>
                     <Button
                           type='text'
                           icon={<ArrowLeftOutlined />}
                           onClick={onTryAgain}
                        >Back</Button>
                     <Flex vertical gap={'middle'} align="center" justify="start">
                        <ProviderIndicator onlyLogo selectedService={selectedService} />
                        <Flex vertical gap={'small'} align="center">
                           <Typography.Title level={4} style={{ marginBottom: 0 }}>
                              Connect {providerName}
                           </Typography.Title>
                           <Typography.Text type='secondary' style={{ textAlign: 'center' }}>
                              By installing the {providerName} app, {organization} can get access to your account
                           </Typography.Text>
                        </Flex>
                        <Flex vertical gap={'small'} style={{ width: '100%' }}>
                           <Link to={redirectDetails?.formUrl}>
                              <Button
                                 type="primary"
                                 block
                                 style={OK_BUTTON_STYLES}
                              >
                                 Install App

                              </Button>
                           </Link>
                           <Button
                              block
                              onClick={onClose}
                              type='link'
                              icon={<CloseOutlined />}
                           >
                              Close
                           </Button>
                        </Flex>
                     </Flex>
                  </div>

               ) : (
                  <Result
                     title='Something went wrong!'
                     subTitle='Something went wrong with your authentication details'
                     status={'error'}
                     extra={
                        <Button onClick={onTryAgain} type="primary" >
                           Try again
                        </Button>
                     }
                  />
               )
            )
         )}
      </Modal>
   )
}