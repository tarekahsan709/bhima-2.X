/* global expect, chai, agent */

const helpers = require('./helpers');

/*
 * The /journal API endpoint
 */
describe('(/journal) API endpoint', function () {

  const RECORD_UUID = 'a5a5f950-a4c9-47f0-9a9a-2bfc3123e534';
  const MISSING_RECORD_UUID = 'a5a5f950-a4c9-47f0-9a9a-2bfc3123e635';

  const NUM_ROW_ALL_RECORDS = 13;
  const DISTINCT_TRANSACTIONS = 6;
  const NUM_ROWS_FETCHING_TRANSACTION = 2;

  it('GET /journal : it returns a set of records ', function () {
    return agent.get('/journal')
      .then(function (res) {
        helpers.api.listed(res, NUM_ROW_ALL_RECORDS);
      })
      .catch(helpers.handler);
  });

  it('GET /journal - returns an object of aggregate information and journal rows with aggregates flag set', function () {
    return agent.get('/journal')
      .query({ aggregates : 1})
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        expect(res.body).to.be.a('object');
        expect(res.body).to.contain.all.keys(['journal', 'aggregate']);
        expect(res.body.aggregate).to.have.length(DISTINCT_TRANSACTIONS);
      })
      .catch(helpers.handler);
  });

  it('GET /journal/:record_uuid : it returns an object with the transaction and aggregate information', function () {
    return agent.get(`/journal/${RECORD_UUID}`)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.journal).to.have.length(NUM_ROWS_FETCHING_TRANSACTION);
      })
      .catch(helpers.handler);
  });

  it('GET /journal/:record_id : it returns an error message and 404 code if the transaction does not exist ', function () {
    return agent.get(`/journal/${MISSING_RECORD_UUID}`)
      .then(function (res) {
        helpers.api.errored(res, 404);
      })
      .catch(helpers.handler);
  });

  describe('Searching', SearchTests);
});

function SearchTests() {

  const description = 'unique';
  const account_id = 3628;

  it(`GET /journal?description=${description} should match one record`, function () {
    const NUM_MATCHES = 1;
    return agent.get('/journal')
      .query({ description })
      .then(function (res) {
        helpers.api.listed(res, NUM_MATCHES);
      })
      .catch(helpers.handler);
  });

  if('GET /journal?description : journal querry with filters returns correct aggregate information for subset', function () {
    const NUM_MATCHES = 1;
    return agent.get('/journal')
      .query({ description, aggregates : 1 })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        expect(res.body).to.be.a('object');
        expect(res.body).to.contain.all.keys(['journal', 'aggregate']);
        expect(res.body.aggregate).to.have.length(NUM_MATCHES);
      })
      .catch(helpers.handler);
  });

  it(`GET /journal filters should be additive`, function () {
    const NUM_MATCHES = 1;
    return agent.get('/journal')
      .query({ description, account_id })
      .then(function (res) {
        helpers.api.listed(res, NUM_MATCHES);
      })
      .catch(helpers.handler);
  });

  it(`GET /journal filters should find items by account`, function () {
    const NUM_MATCHES = 3;
    return agent.get('/journal')
      .query({ account_id })
      .then(function (res) {
        helpers.api.listed(res, NUM_MATCHES);
      })
      .catch(helpers.handler);
  });

}
