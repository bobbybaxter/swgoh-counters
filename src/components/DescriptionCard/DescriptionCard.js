import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getImage from '../../helpers/getImage';
// import { Button } from 'reactstrap';

// TODO: add proptypes
// TODO: add videos
// TODO: add subs
// TODO: add createdOn and createdBy
// TODO: add CRUD functionality
export default function DescriptionCard(props) {
  DescriptionCard.propTypes = {
    counter: PropTypes.object,
    view: PropTypes.string,
  };

  const [leftSquad, setLeftSquad] = useState();
  const [rightSquad, setRightSquad] = useState();

  const submissionForm = 'https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true';
  const discordLink = 'https://discord.gg/eCnE48h';
  const {
    counter,
    view,
  } = props;

  useEffect(() => {
    const {
      opponentSquadId,
      counterSquadId,
    } = counter || '';

    async function getSquad() {
      const squads = JSON.parse(sessionStorage.getItem('squads')) || [];
      const matchedLeftSquad = squads.find(x => x.id === (view === 'normal' ? opponentSquadId : counterSquadId));
      const matchedRightSquad = squads.find(x => x.id === (view === 'normal' ? counterSquadId : opponentSquadId));
      await setLeftSquad(matchedLeftSquad);
      await setRightSquad(matchedRightSquad);
    }

    getSquad();
  }, [counter, view]);

  const oppSubs = '';

  const createCounterDescription = description => ({ __html: description });
  const createCounterStrategy = counterStrategy => ({ __html: counterStrategy });

  const buildOpponentDescription = (squad) => {
    if (squad) {
      const { description, counterStrategy } = squad;
      return (
        <>
        {(description) ? (<p className="text-left"><strong className="text-secondary">Details: </strong>{description}</p>) : ''}
        {(counterStrategy)
          ? (<p className="text-left"><strong className="text-secondary">General Strategy: </strong><span dangerouslySetInnerHTML={createCounterStrategy(counterStrategy)}></span></p>)
          : (<p className="text-secondary"><small>You can help me add common substitutions, a general counter strategy, or details about this team by <a href={submissionForm}>submiting an issue.</a></small></p>)}
        {(counterStrategy) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to discuss counters a little further.</small></p>)}
        </>
      );
    }
    return '';
  };

  const buildCounterDescription = (squad) => {
    if (counter && squad) {
      const { name } = squad;
      const counterDescription = counter.description;
      return (
        <>
      {(counterDescription)
        ? (<p className="text-left"><strong className="text-secondary ">Specific Strategy: </strong><span dangerouslySetInnerHTML={createCounterDescription(counterDescription)}></span></p>)
        : (<p className="text-secondary"><small>Do you know the specific strategy for {name}?  If so, please <a href={submissionForm}>submit an issue.</a></small></p>)}
      {(counterDescription) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></p>)}
        </>
      );
    }
    return '';
  };

  const buildDescriptionCardTop = (squad) => {
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
        <div className="detailsToonRow mb-2">
          <img alt={toon1Name} className="toonImg grayImg" title={toon1Name} src={toon1Image} />
          {(toon2Name) ? (<img alt={toon2Name} className="toonImg grayImg" title={toon2Name} src={toon2Image} />) : ''}
          {(toon3Name) ? (<img alt={toon3Name} className="toonImg grayImg" title={toon3Name} src={toon3Image} />) : ''}
          {(toon4Name) ? (<img alt={toon4Name} className="toonImg grayImg" title={toon4Name} src={toon4Image} />) : ''}
          {(toon5Name) ? (<img alt={toon5Name} className="toonImg grayImg" title={toon5Name} src={toon5Image} />) : ''}
        </div>
        {(oppSubs) ? (<p><small><strong className="text-secondary">Subs: </strong>{oppSubs}</small></p>) : ''}
      </>
    );
  };

  return (
    <>
    <div className="detailsDivLeft col-6 border-dark border-right">
      <h6 className="text-secondary">{view === 'normal' ? 'Opponent Team' : 'Counter Team'}</h6>
      {leftSquad ? buildDescriptionCardTop(leftSquad) : ''}
      { view === 'normal' ? buildOpponentDescription(leftSquad) : buildCounterDescription(leftSquad) }
    </div>

    <div className="detailsDivRight col-6">
      <h6 className="text-secondary">{view === 'normal' ? 'Counter Team' : 'Opponent Team'}</h6>
      {rightSquad ? buildDescriptionCardTop(rightSquad) : ''}
      { view === 'normal' ? buildCounterDescription(rightSquad) : buildOpponentDescription(rightSquad) }
    </div>
    </>
  );
}
