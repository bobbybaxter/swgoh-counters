/* eslint-disable import/no-extraneous-dependencies */
const NodeEnvironment = require( 'jest-environment-node' ).default;

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // this.global.testHelpers = {
    // harness: require( './harness' ),
    // harness: {},
    // };
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment;
