import { Typography as AntTypography } from 'antd';
import styled from 'styled-components';

export const TypographyText = styled(AntTypography.Text)<{
  theme: 'dark' | 'light';
}>`
  color: ${(props) => (props.theme === 'dark' ? 'black' : 'white')};
`;

export const TypographyTitle = styled(AntTypography.Title)<{
  theme: 'dark' | 'light';
}>`
  color: ${(props) => (props.theme === 'dark' ? 'black' : 'white')};
`;
