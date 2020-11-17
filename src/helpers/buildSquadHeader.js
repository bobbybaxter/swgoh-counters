import React from 'react';
import ToonImg from '../components/shared/ToonImg';
import getImage from './getImage';

export default function buildDescriptionCardTop(squad, size) {
  const {
    name,
    toon1Id,
    toon2Id,
    toon3Id,
    toon4Id,
    toon5Id,
    toon1Name,
    toon2Name,
    toon3Name,
    toon4Name,
    toon5Name,
  } = squad || {};

  const toon1Image = toon1Id ? getImage(toon1Id) : null;
  const toon2Image = toon1Id ? getImage(toon2Id) : null;
  const toon3Image = toon1Id ? getImage(toon3Id) : null;
  const toon4Image = toon1Id ? getImage(toon4Id) : null;
  const toon5Image = toon1Id ? getImage(toon5Id) : null;

  return (
    <>
      <h5>{name}</h5>
      <div className="mb-2">
        <ToonImg alt={toon1Name} title={toon1Name} src={toon1Image} />
        {(toon2Name) ? (<ToonImg alt={toon2Name} title={toon2Name} src={toon2Image} />) : ''}
        {(toon3Name) ? (<ToonImg alt={toon3Name} title={toon3Name} src={toon3Image} />) : ''}
        {(toon4Name && size === '5v5') ? (<ToonImg alt={toon4Name} title={toon4Name} src={toon4Image} />) : ''}
        {(toon5Name && size === '5v5') ? (<ToonImg alt={toon5Name} title={toon5Name} src={toon5Image} />) : ''}
      </div>
    </>
  );
}
