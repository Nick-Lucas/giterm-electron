import styled from 'styled-components'

export const Label = styled.div`
  flex: 1;

  font-size: 15px;
  color: ${({ colour }) => colour || 'inherit'};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: ${({ trimStart }) => (trimStart ? 'rtl' : 'inherit')};
  text-align: left;
`
