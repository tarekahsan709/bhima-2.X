angular.module('bhima.controllers')
  .controller('TimeConfigurationController', TimeConfigurationController);

TimeConfigurationController.$inject = ['SystemService', 'moment', 'NotifyService'];

function TimeConfigurationController(System, moment, Notify) {
  var vm = this;

  vm.showCalendar = false;
  vm.toggleCalendar = toggleCalendar;
  vm.submit = submit;

  System.requestTime()
    .then(function (result) {
      vm.serverTime = moment(result.currentTime);
      vm.formatTime = vm.serverTime.format('LLLL');

      // bind the variables for fun and profit
      vm.userDate = new Date(result.currentTime);
      vm.userTime = result.currentTime;
    })
    .catch(Notify.handleError);

	function toggleCalendar() {
    vm.showCalendar = !vm.showCalendar;
	}

  function submit(Form) {
    if (Form.$invalid) {
      return Notify.danger('FORM.HAS_ERRORS');
    }

    // send back the time as moment composed object
    var date = moment(vm.userDate);

    var time = moment(vm.userTime).format('mm:ss:SS');
    var timeArray = time.split(':');

    // there must be an easier way.
    var timePartsObject = {
      minutes : timeArray[0],
      seconds: timeArray[1],
      milliseconds : timeArray[3]
    };

    date.set(timePartsObject);
    var httpDate = date.toDate();

    return System.setTime({ requestedDate : httpDate })
      .then(function () {
        Notify.success('TIME_CONFIG.SUCCESS');
      })
      .catch(Notify.handleError);
  }

}
