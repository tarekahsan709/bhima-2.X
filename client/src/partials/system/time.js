angular.module('bhima.controllers')
  .controller('TimeConfigurationController', TimeConfigurationController);

TimeConfigurationController.$inject = ['SystemService', 'moment'];

function TimeConfigurationController(System, moment) {
  var vm = this;

  System.requestTime()
    .then(function (result) {
      vm.serverTime = moment(result.currentTime);
      vm.formatTime = vm.serverTime.format('LLLL');
    });
}
