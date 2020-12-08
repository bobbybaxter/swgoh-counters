import React from 'react';
import styled from 'styled-components/macro';
import { ContainerRow } from 'src/styles/style';
import { colors } from 'src/styles/colors';

const Wrapper = styled(ContainerRow)`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const ColorBubble = styled.span`
  display: inline-block;
  height: 20px;
  width: 20px;
  background-color: ${props => (props.hard ? colors.hardCounter : colors.softCounter)};
  border-radius: 100px;
  margin-right: 10px;
`;

const StyledH6 = styled.h6`
  margin-bottom: 0;
  margin-right: ${props => (props.hard ? '1.5rem' : '0')};
`;

export default function ColorIndicator() {
  return (
    <Wrapper>
      <ColorBubble hard />
      <StyledH6 hard >Hard Counter</StyledH6>

      <ColorBubble />
      <StyledH6>Soft Counter</StyledH6>
    </Wrapper>
  );
}
