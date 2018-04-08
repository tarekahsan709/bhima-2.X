angular.module('bhima.controllers')
  .controller('ComplexJournalVoucherController', ComplexJournalVoucherController);

ComplexJournalVoucherController.$inject = [
  'VoucherService', 'CurrencyService', 'SessionService', 'FindEntityService',
  'FindReferenceService', 'NotifyService', 'VoucherToolkitService',
  'ReceiptModal', 'bhConstants', 'uiGridConstants', 'VoucherForm', '$timeout',
];

/**
 * @overview ComplexJournalVoucherController
 *
 * @description
 * This module implements complex journal vouchers. It allows users to quickly create transactions by
 * specifying two or more lines of transactions and all relative document references
 *
 * @constructor
 *
 * TODO - Implement caching mechanism for incomplete forms (via AppCache)
 * TODO/FIXME - this error notification system needs serious refactor.
 */
function ComplexJournalVoucherController(
  Vouchers, Currencies, Session, FindEntity, FindReference, Notify, Toolkit,
  Receipts, bhConstants, uiGridConstants, VoucherForm, $timeout
) {
  const vm = this;

  // bind constants
  vm.bhConstants = bhConstants;
  vm.enterprise = Session.enterprise;
  vm.itemIncrement = 1;
  vm.timestamp = new Date();

  // bind the complex voucher form
  vm.Voucher = new VoucherForm('ComplexVouchers');

  // fired to clear the grid
  vm.clear = function clear(form) {
    vm.Voucher.clear();
    form.$setPristine();
  };

  // fired on changes
  vm.onChanges = function onChanges() {
    vm.Voucher.onChanges();
    vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
  };

  // ui-grid options
  vm.gridOptions = {
    appScopeProvider  : vm,
    fastWatch         : true,
    flatEntityAccess  : true,
    enableSorting     : false,
    enableColumnMenus : false,
    showColumnFooter  : true,
    onRegisterApi,
  };

  function onRegisterApi(api) {
    vm.gridApi = api;
  }

  vm.openConventionPaymentModal = function openConventionPaymentModal() {
    Toolkit.openConventionPaymentModal()
      .then(processVoucherToolRows);
  };

  vm.openGenericIncomeModal = function openGenericIncomeModal() {
    Toolkit.openGenericIncomeModal()
      .then(processVoucherToolRows);
  };


  vm.openGenericExpenseModal = function openGenericExpenseModal() {
    Toolkit.openGenericExpenseModal()
      .then(processVoucherToolRows);
  };

  vm.openCashTransferModal = function openCashTransferModal() {
    Toolkit.openCashTransferModal()
      .then(processVoucherToolRows);
  };

  vm.openSupportPatientModal = function openSupportPatientModal() {
    Toolkit.openSupportPatientModal()
      .then(processVoucherToolRows);
  };

  vm.openPaymentEmployees = function openPaymentEmployees() {
    Toolkit.openPaymentEmployees()
      .then(processVoucherToolRows);
  };

  /**
   * @function processVoucherToolRows
   *
   * @description this function handle the result of the tool modal
   */
  function processVoucherToolRows(result) {
    if (!result) { return; }

    vm.paiementRows = result.rows;
    vm.Voucher.replaceFormRows(result.rows);

    // force updating details
    updateView(result);
  }

  /**
   * @method updateView
   *
   * @description
   * this function force to update details of the voucher
   * and remove unnecessary rows
   *
   * @param {object} result
   */
  function updateView(result) {
    $timeout(() => {
      // transaction type
      vm.Voucher.details.type_id = result.type_id || vm.Voucher.details.type_id;

      // description
      vm.Voucher.description(result.description || vm.Voucher.details.description);

      // currency
      vm.Voucher.details.currency_id = result.currency_id || vm.Voucher.details.currency_id;

      removeNullRows();
    }, 0);
  }

  /**
   * @function removeNullRows
   *
   * @description remove null rows
   */
  function removeNullRows() {
    const gridData = JSON.parse(JSON.stringify(vm.gridOptions.data));
    gridData.forEach((item) => {
      if (!item.account_id) {
        vm.Voucher.store.remove(item.uuid);
      }
    });
  }

  /** ======================== end voucher tools ======================= */

  // bind the startup method as a reset method
  vm.submit = submit;
  vm.currencySymbol = currencySymbol;
  vm.openEntityModal = openEntityModal;
  vm.openReferenceModal = openReferenceModal;

  // load the available currencies
  Currencies.read()
    .then((currencies) => {
      currencies.forEach((currency) => {
        currency.label = Currencies.format(currency.id);
      });
      vm.currencies = currencies;
    })
    .catch(Notify.handleError);

  /** Entity modal */
  function openEntityModal(row) {
    FindEntity.openModal()
      .then((entity) => {
        row.entity = entity;
      });
  }

  /** Reference modal */
  function openReferenceModal(row) {
    FindReference.openModal(row.entity)
      .then((doc) => {
        row.configure({ document : doc });
      });
  }

  /** Get the selected currency symbol */
  function currencySymbol(currencyId) {
    if (!currencyId) { return ''; }
    return Currencies.symbol(currencyId);
  }

  /** run the module on startup and refresh */
  function startup() {
    vm.gridOptions.data = vm.Voucher.store.data;
  }

  /* ============================= Transaction Type ============================= */

  Vouchers.transactionType()
    .then((list) => {
      vm.types = list;
    })
    .catch(Notify.handleError);

  /* ============================= Grid ====================================== */

  // grid default options
  vm.gridOptions.columnDefs = [{
    field                : 'isValid',
    displayName          : '...',
    cellTemplate         : 'modules/vouchers/templates/status.grid.tmpl.html',
    aggregationType      : uiGridConstants.aggregationTypes.count,
    aggregationHideLabel : true,
    footerCellClass      : 'text-center',
    width                : 40,
  }, {
    field            : 'account',
    displayName      : 'FORM.LABELS.ACCOUNT',
    headerCellFilter : 'translate',
    cellTemplate     : 'modules/vouchers/templates/account.grid.tmpl.html',
    width            : '35%',
  }, {
    field                : 'debit',
    displayName          : 'FORM.LABELS.DEBIT',
    headerCellFilter     : 'translate',
    cellTemplate         : 'modules/vouchers/templates/debit.grid.tmpl.html',
    aggregationType      : uiGridConstants.aggregationTypes.sum,
    aggregationHideLabel : true,
    footerCellFilter     : 'currency:grid.appScope.Voucher.details.currency_id',
    footerCellClass      : 'text-right',
  }, {
    field                : 'credit',
    displayName          : 'FORM.LABELS.CREDIT',
    headerCellFilter     : 'translate',
    cellTemplate         : 'modules/vouchers/templates/credit.grid.tmpl.html',
    aggregationType      : uiGridConstants.aggregationTypes.sum,
    aggregationHideLabel : true,
    footerCellFilter     : 'currency:grid.appScope.Voucher.details.currency_id',
    footerCellClass      : 'text-right',
  }, {
    field            : 'entity',
    displayName      : 'FORM.LABELS.DEBTOR_CREDITOR',
    headerCellFilter : 'translate',
    cellTemplate     : 'modules/vouchers/templates/entity.grid.tmpl.html',
  }, {
    field            : 'reference',
    displayName      : 'FORM.LABELS.REFERENCE',
    headerCellFilter : 'translate',
    cellTemplate     : 'modules/vouchers/templates/reference.grid.tmpl.html',
  }, {
    field        : 'action',
    displayName  : '...',
    width        : 25,
    cellTemplate : 'modules/vouchers/templates/remove.grid.tmpl.html',
  }];

  /* ============================= End Grid ================================== */

  /** submit data */
  function submit(form) {
    // stop submission if the form is invalid
    if (form.$invalid) {
      return Notify.danger('VOUCHERS.COMPLEX.INVALID_VALUES');
    }

    const valid = vm.Voucher.validate();

    if (!valid) {
      return Notify.danger(vm.Voucher._error);
    }

    const voucher = vm.Voucher.details;
    voucher.items = vm.Voucher.store.data;

    /**
    *FIXE ME
    * With the use of Journal Vouchers for the payment of the salaries of the agents, it was question 
    * of knowing the identifier of the payment to facilitate the update of the payment table finally to determine 
    * if the payment is partial or total, and in case of partial payment it would be impossible to determine the indetifier of the payment, 
    * reason for which we had used the property document_uuid to preserve the identifier of the table
    */
    if(voucher.type_id === 7) {
      voucher.paiementRows = vm.paiementRows;
    }

    return Vouchers.create(voucher)
      .then((result) => {
        Receipts.voucher(result.uuid, true);
        vm.Voucher.clear();
        form.$setPristine();
      })
      .catch(Notify.handleError);
  }

  startup();
}
