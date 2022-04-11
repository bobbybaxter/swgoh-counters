export default function createUser() {
  this.post( '/firebase', ( schema, request ) => {
    const { id, email } = JSON.parse( request.requestBody );
    return { id, email };
  } );
}
