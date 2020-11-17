import styled from 'styled-components';

export const UnstyledButton = styled.button`
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  outline: none;

  &:active {
    transform: translateY(1px);
    filter: saturate(150%);
  }

  &::-moz-focus-inner {
    border: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.5),
      0 0 0 1.5px rgba(255, 105, 180, 0.5);
  }

  /* hide focus style if not from keyboard navigation */
  .js-focus-visible .btn:focus:not(.focus-visible) {
    box-shadow: none;
  }
`;

export const UnstyledATag = styled.a`
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  outline: none;

  &:active {
    transform: translateY(1px);
    filter: saturate(150%);
  }

  &::-moz-focus-inner {
    border: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.5),
      0 0 0 1.5px rgba(255, 105, 180, 0.5);
  }

  /* hide focus style if not from keyboard navigation */
  .js-focus-visible .btn:focus:not(.focus-visible) {
    box-shadow: none;
  }
`;

export const ContainerColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const CounterRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  box-shadow: inset 4px 4px 15px rgba(255, 255, 255, 0.1), inset -4px -4px 15px rgba(255, 255, 255, 0.1);
`;

export const CounterCard = styled(CounterRow)`
  box-shadow: none;
`;