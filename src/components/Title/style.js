import styled from 'styled-components/macro';

const Heading1 = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: ${props => (props.reverse === true ? 'lightblue' : 'black')};
`;

export default Heading1;
