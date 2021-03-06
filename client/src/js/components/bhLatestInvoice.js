angular.module('bhima.components')
.component('bhLatestInvoice', {
  controller   : LatestInvoice,
  controllerAs : '$ctrl',
  templateUrl  : 'partials/templates/bhLatestInvoice.tmpl.html',
  bindings     : {
    debtorUuid : '<',  // Required patient uuid
  },
});

LatestInvoice.$inject = [
  'PatientService', 'moment', 'NotifyService', 'SessionService',
];

/**
 * This component is responsible for displaying the Latest Invoice
 */
function LatestInvoice(Patient, moment, Notify, Session) {
  var vm = this;

  this.$onInit = function $onInit() {
    vm.enterprise = Session.enterprise;
    startup();
  };


  /** getting patient document */
  function startup() {
    if (!vm.debtorUuid) { return; }
    Patient.latest(vm.debtorUuid)
      .then(function (patientInvoice) {
        vm.patientInvoice = patientInvoice;
        vm.patientInvoice.durationDays = moment().diff(vm.patientInvoice.date, 'days');
      })
      .catch(Notify.handleError);

    Patient.balance(vm.debtorUuid)
      .then(function (balance) {
        vm.patientBalance = balance;
      })
      .catch(Notify.handleError);
  }
}
