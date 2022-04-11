export default function swgohRoute() {
  this.get( '/swgoh/leaders/:season', ( schema, request ) => `called getLeadersBySeason for season ${ request.params.season }` );

  this.get( '/swgoh/squads/:season', ( schema, request ) => `called getSquadsBySeason for season ${ request.params.season }` );

  this.get( '/swgoh/counters/:season', ( schema, request ) => `called getCountersBySeason for season ${ request.params.season }` );

  this.get( '/swgoh/counters/SeasonData/:season', ( schema, request ) => `called getSeasonData for season ${ request.params.season }` );
}
