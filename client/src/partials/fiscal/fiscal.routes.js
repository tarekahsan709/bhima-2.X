angular.module('bhima.routes')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('fiscal', {
        url         : '/fiscal',
        abstract    : true,
        controller  : 'FiscalController as FiscalCtrl',
        templateUrl : 'partials/fiscal/fiscal.html',
      })
      .state('fiscal.create', {
        url         : '/create',
        controller  : 'FiscalManagementController as FiscalManageCtrl',
        templateUrl : 'partials/fiscal/fiscal.manage.html',
      })
      .state('fiscal.list', {
        url         : '',
        templateUrl : 'partials/fiscal/fiscal.list.html',
      })
      .state('fiscal.update', {
        url         : '/:id/update',
        controller  : 'FiscalManagementController as FiscalManageCtrl',
        templateUrl : 'partials/fiscal/fiscal.manage.html',
        data        : { label: null },
        params      : {
          id : { squash: true, value: null },
        },
      })
      .state('fiscal.openingBalance', {
        url         : '/:id/opening_balance',
        controller  : 'FiscalOpeningBalanceController as FiscalOBCtrl',
        templateUrl : 'partials/fiscal/fiscal.openingBalance.html',
        params      : {
          id : { squash: true, value: null },
        },
      });
  }]);
