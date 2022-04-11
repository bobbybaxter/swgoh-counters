export default function videoLinkRoute() {
  this.post( '/videoLink', () => 'called addVideoLink }' );

  this.delete( '/videoLink/:id', () => 'called deleteVideoLink' );

  this.patch( '/videoLink/:id', () => 'called updateVideoLink' );
}
