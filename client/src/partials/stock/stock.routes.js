angular.module('bhima.routes')
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('stockLots', {
        url         : '/stock/lots',
        controller  : 'StockLotsController as StockLotsCtrl',
        templateUrl : 'partials/stock/lots/registry.html',
      })

      .state('stockMovements', {
        url         : '/stock/movements',
        controller  : 'StockMovementsController as StockCtrl',
        templateUrl : 'partials/stock/movements/registry.html',
      })

      .state('stockInventories', {
        url         : '/stock/inventories',
        controller  : 'StockInventoriesController as StockCtrl',
        templateUrl : 'partials/stock/inventories/registry.html',
      })

      .state('stockExit', {
        url         : '/stock/exit',
        controller  : 'StockExitController as StockCtrl',
        templateUrl : 'partials/stock/exit/exit.html',
      })
      ;

  }
  ]);
