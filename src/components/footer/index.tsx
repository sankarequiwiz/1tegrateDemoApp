import { Button, ButtonProps } from 'antd';
import React, { HTMLProps } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';

export type FooterProps = {
      onSubmit?: () => void;
      onCancel?: () => void;
      onOkProps?: ButtonProps
}

const footerRootStyle: React.CSSProperties = {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between'
}

const footerRightStyle: React.CSSProperties = {
      display: 'flex',
      gap: '.5rem'
}

export const Footer = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & FooterProps>(
      ({ style, onOkProps, onSubmit, onCancel, ...props }, ref) => {
            const mergedStyle = React.useMemo(() => {
                  const root = Object.assign(footerRootStyle, style);
                  return { root, right: footerRightStyle }
            }, [style])

            return (
                  <div style={mergedStyle.root} {...props} ref={ref}>
                        <div></div>
                        <div style={mergedStyle.right} >
                              <Button onClick={onCancel}>Previous</Button>
                              <Button onClick={onSubmit} icon={<ArrowRightOutlined />} children='Next' {...onOkProps} type='primary' />
                        </div>
                  </div>
            )
      })