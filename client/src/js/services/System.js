/* global EventSource */
angular.module('bhima.services')
.service('SystemService', SystemService);

SystemService.$inject = ['$http', 'util'];

/**
 * System Service
 */
function SystemService($http, util) {
  var service = this;
  var baseUrl = '/system';

  // exposed API
  service.information = information;
  service.events = events;
  service.stream = [];

  service.requestTime = requestTime;
  service.setTime = setTime;

  function information() {
    return $http.get(baseUrl.concat('/information'))
      .then(util.unwrapHttpResponse);
  }

  function events() {
    // forcibly clear the event queue
    service.stream.length = 0;

    return $http.get(baseUrl.concat('/events'))
      .then(util.unwrapHttpResponse);
  }

  function handleServerSentEvent(event) {
    console.log('Got Event:', event);
    service.stream.push(JSON.parse(event.data));
  }

  function handleErrorEvent(event) {
    if (event.readyState === EventSource.CLOSED) {
      console.log('Connection was closed.');
    }
  }

  function handleOpenEvent(event) {
    console.log('Connection was open.');
  }

  function requestTime() {
    return $http.get(baseUrl.concat('/time'))
      .then(util.unwrapHttpResponse);
  }

  function setTime(timeParams) {
    return $http.post(baseUrl.concat('/time'), timeParams)
      .then(util.unwrapHttpResponse);
  }

  /*
  // set up event stream
  var source = new EventSource(baseUrl.concat('/stream'));

  source.addEventListener('open', handleOpenEvent, false);
  source.addEventListener('message', handleServerSentEvent, false);
  source.addEventListener('error', handleErrorEvent, false);
  */

  return service;
}
