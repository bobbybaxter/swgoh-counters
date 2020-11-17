import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';

export const FormZetaReq = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  text-align: left;
`;

export const Wrapper = styled.div`
  border-bottom: 1px solid #343a40;
  border-top: 1px solid #343a40;
  padding-top: 1rem;
`;

export default function ZetaForm({
  characters, setTempSquad, tempSquad, ...props
}) {
  ZetaForm.propTypes = {
    characters: PropTypes.array.isRequired,
    setTempSquad: PropTypes.func.isRequired,
    tempSquad: PropTypes.array.isRequired,
  };

  const buildZetaSelectors = () => tempSquad
    .map((char, i) => {
      const zetaList = (characters.find(x => x.id === char.id) || {}).zetas;
      const handleZetaSelector = (e) => {
        e.preventDefault();
        const tempSquadCopy = [...tempSquad];
        tempSquadCopy[i].zetas = Array.from(e.target.selectedOptions, option => option.value);
        setTempSquad(tempSquadCopy);
      };

      return zetaList.length > 0
        ? <FormZetaReq key={`${i}_zetaReq`}>
          <Label for={`${i}_zetaReq`} size="sm" className="text-secondary col-6">{char.name}</Label>
          <Input
            className="col-6"
            id={`${i}_zetaReq`}
            type="select"
            size={zetaList.length.toString()}
            bsSize="sm"
            multiple
            onChange={handleZetaSelector}
          >
            {zetaList.map(zeta => <option key={zeta}>{zeta}</option>)}
          </Input>
        </FormZetaReq>
        : '';
    });

  return (
      <Wrapper>
        <h6 className="text-secondary pb-3">Required Zetas</h6>
        {buildZetaSelectors()}
      </Wrapper>
  );
}
