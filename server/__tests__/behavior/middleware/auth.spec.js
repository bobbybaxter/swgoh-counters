const admin = require( 'firebase-admin' );
const auth = require( '../../../middleware/auth' );

jest.mock( 'firebase-admin' );

describe( 'middleware/auth', () => {
  let consoleError, consoleWarn, next, req, res;

  beforeAll( async () => {
    consoleError = jest.spyOn( console, 'error' ).mockImplementation(() => {} );
    consoleWarn = jest.spyOn( console, 'warn' ).mockImplementation(() => {} );

    req = {
      headers: {
        authorization: 'Bearer AUTH_TOKEN',
      },
    };

    res = {
      status: jest.fn().mockImplementation( status => {
        res.status = status;
        return res;
      } ),
      send: jest.fn().mockImplementation( send => {
        res.send = send;
        return res;
      } ),
    };

    next = jest.fn();
  } );

  afterAll(() => {
    consoleError.mockRestore();
    consoleWarn.mockRestore();
  } );

  describe( 'checkIfAuthenticated', () => {
    describe( 'when successful', () => {
      beforeEach( async () => {
        admin.auth = () => ( {
          verifyIdToken: jest.fn().mockReturnValue( { uid: 'UID' } ),
        } );

        await auth( req, res, next );
      } );

      it( 'should add the uid to the req.authId', async () => {
        await expect( req.authId ).toEqual( 'UID' );
      } );

      it( 'it should call next when finished', () => {
        expect( next ).toBeCalled();
      } );
    } );

    describe( 'when no auth token is provided', () => {
      beforeAll( async () => {
        admin.auth = () => ( {
          verifyIdToken: jest.fn().mockRejectedValue( new Error( 'REJECTED_TOKEN' )),
        } );

        req = {
          headers: '',
        };

        await auth( req, res, next );
      } );

      it( 'should return an error', async () => {
        await expect( admin.auth().verifyIdToken ).rejects.toThrow();
      } );

      it( 'should log a console error', async () => {
        expect( consoleError ).toBeCalledWith( 'authentication error :>> ', new Error( 'REJECTED_TOKEN' ));
      } );

      it( 'should return the correct response', () => {
        expect( res.status ).toEqual( 401 );
        expect( res.send ).toStrictEqual( { Error: 'You are not authorized to make this request' } );
      } );
    } );
  } );
} );
