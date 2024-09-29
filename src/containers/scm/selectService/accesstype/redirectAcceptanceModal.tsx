import { Button, Flex, Modal, ModalProps, Result, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import services from "../../../../services";
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { useAppProvider } from "../../../../context/AppProvider";
import { ProviderIndicator } from "./providerIndicator";
import { CloseOutlined } from "@ant-design/icons";

type ConfirmationModalProps = {
} & ModalProps

const getSuccessUrl = () => {
   let successUrl = new URL(window.location.href),
      params = new URLSearchParams(successUrl.search);

   params.set('current', '1');
   successUrl.search = params.toString();

   return encodeURI(successUrl.href);
},
   getFailureUrl = () => {
      let failedUrl = new URL(window.location.href),
         params = new URLSearchParams(failedUrl.search);

      params.set('isIntegrationFailed', 'true');
      failedUrl.search = params.toString();

      return encodeURI(failedUrl.href);
   },
   OK_BUTTON_STYLES: React.CSSProperties = { background: 'green' };

const mockResponse = { formUrl: "https://api.example.com/install" }

export const RedirectAcceptanceModal = (props: ConfirmationModalProps) => {

   const {
      selectedService,
   } = useServiceConfigTypeProvider();

   const {
      setRedirectModalOpen,
      setAccessPointModalOpen,
      isIntegrationFailed,
   } = useAppProvider()

   const [loading, setLoading] = useState<boolean>(true);
   const [redirectDetails, setRedirectionDetails] = useState(mockResponse);

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
   }
   const onClose = () => {
      setRedirectModalOpen(false)
   }

   return (
      <Modal
         {...props}
         footer={false}
         closeIcon={null}
      >
         {loading ? (
            <Skeleton />
         ) : (
            !isIntegrationFailed ? (
               <Flex vertical gap={'middle'} align="center" justify="start">
                  <ProviderIndicator onlyLogo selectedService={selectedService} />
                  <Flex vertical gap={'small'} align="center">
                     <Typography.Title level={4} style={{ marginBottom: 0 }}>Here is the link to redirect</Typography.Title>
                     <Typography.Text type='secondary' style={{ textAlignLast: 'center' }}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus maiores rerum sed nostrum!
                     </Typography.Text>
                  </Flex>
                  <Flex vertical gap={'small'} style={{ width: '100%' }}>
                     <Link to={redirectDetails?.formUrl}>
                        <Button
                           type="primary"
                           block
                           style={OK_BUTTON_STYLES}
                        >
                           Install app
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
         )}
      </Modal>
   )
}