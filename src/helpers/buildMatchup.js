/* eslint-disable import/no-dynamic-require */
import buildSquad from './buildSquad';

export default function buildMatchup(matchupToBuild, teamSize, allTeams, allCharacters) {
  const matchup = matchupToBuild;
  const filteredTeam = allTeams.filter(team => team.id === matchup.counterTeam)[0];

  if (filteredTeam && teamSize === 5) {
    matchup.oppLeaderName = filteredTeam.leaderName;
    matchup.oppToon2Name = filteredTeam.toon2Name;
    matchup.oppToon3Name = filteredTeam.toon3Name;
    matchup.oppToon4Name = filteredTeam.toon4Name;
    matchup.oppToon5Name = filteredTeam.toon5Name;
    matchup.counterTeamName = filteredTeam.name;
    matchup.subs = filteredTeam.subs;
    return buildSquad(matchup, 5, allCharacters);
  } if (filteredTeam && teamSize === 3) {
    matchup.oppLeaderName = filteredTeam.leaderName;
    matchup.oppToon2Name = filteredTeam.toon2Name;
    matchup.oppToon3Name = filteredTeam.toon3Name;
    matchup.counterTeamName = filteredTeam.name;
    matchup.subs = filteredTeam.subs;
    return buildSquad(matchup, 3, allCharacters);
  }
  return [];
}
