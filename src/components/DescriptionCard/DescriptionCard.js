import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import buildSquadHeader from '../../helpers/buildSquadHeader';
// import { Button } from 'reactstrap';

// TODO: add videos
// TODO: add subs
// TODO: add createdOn and createdBy
// TODO: add CRUD functionality
export default function DescriptionCard(props) {
  DescriptionCard.propTypes = {
    counter: PropTypes.object,
    size: PropTypes.string,
    view: PropTypes.string,
  };

  const [leftSquad, setLeftSquad] = useState();
  const [rightSquad, setRightSquad] = useState();

  const submissionForm = 'https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true';
  const discordLink = 'https://discord.gg/eCnE48h';
  const {
    counter,
    size,
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
        ? (<p className="text-left"><strong className="text-secondary ">Counter Strategy: </strong><span dangerouslySetInnerHTML={createCounterDescription(counterDescription)}></span></p>)
        : (<p className="text-secondary"><small>Do you know the specific strategy for {name}?  If so, please <a href={submissionForm}>submit an issue.</a></small></p>)}
      {(counterDescription) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></p>)}
        </>
      );
    }
    return '';
  };

  return (
    <>
    <div className="detailsDivLeft col-6 border-dark border-right">
      <h6 className="text-secondary">{view === 'normal' ? 'Opponent Team' : 'Counter Team'}</h6>
      {leftSquad ? buildSquadHeader(leftSquad, size) : ''}
      {(oppSubs) ? (<p><small><strong className="text-secondary">Subs: </strong>{oppSubs}</small></p>) : ''}
      { view === 'normal' ? buildOpponentDescription(leftSquad) : buildCounterDescription(leftSquad) }
    </div>

    <div className="detailsDivRight col-6">
      <h6 className="text-secondary">{view === 'normal' ? 'Counter Team' : 'Opponent Team'}</h6>
      {rightSquad ? buildSquadHeader(rightSquad, size) : ''}
      {(oppSubs) ? (<p><small><strong className="text-secondary">Subs: </strong>{oppSubs}</small></p>) : ''}
      { view === 'normal' ? buildCounterDescription(rightSquad) : buildOpponentDescription(rightSquad) }
    </div>
    </>
  );
}
