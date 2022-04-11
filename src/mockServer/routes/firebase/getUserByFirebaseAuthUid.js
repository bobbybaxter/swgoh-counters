import _ from 'lodash';
import update from './data/update';
import get from './data/get';

export default function getUserByFirebaseAuthUid( db ) {
  this.get( '/firebase/:id', async ( schema, request ) => {
    let allyCode;

    const user = await get( db, request.params.id );

    if ( _.isEmpty( user ) || !user ) {
      return user; // returns a null user so a new one can be created
    }

    const {
      discordId,
    } = user;
    ( { allyCode } = user );

    // patreon check
    const patreonUser = {
      patronStatus: 'Active Patron',
      tier: 'Aurodium',
    };

    // guild check
    if ( allyCode ) {
      // sanitize allycode
      if ( allyCode.includes( '-' )) {
        allyCode = allyCode.split( '-' ).join( '' );
        user.allyCode = allyCode;
      }
    }

    const updatedUser = {
      ...user,
      discordId: discordId || '',
      patronStatus: patreonUser ? patreonUser.patronStatus : '',
      tier: patreonUser ? patreonUser.tier : '',
    };

    if ( updatedUser !== user ) {
      await update( db, updatedUser );
    }

    const guildData = {
      isCurrentGuildInFirebase: false,
      isNowGuildTier: true,
    };

    return { guildData, firebaseUser: updatedUser };
  } );
}
