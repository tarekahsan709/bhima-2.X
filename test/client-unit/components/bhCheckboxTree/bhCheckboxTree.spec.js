/* eslint no-unused-expressions:off */
/* global inject, expect, chai */

describe('bhCheckboxTree', bhCheckboxTree);

function bhCheckboxTree() {
  beforeEach(module(
    'pascalprecht.translate',
    'ngStorage',
    'ui.bootstrap',
    'tmh.dynamicLocale',
    'bhima.services',
    'bhima.components',
    'bhima.constants',
    'templates',
  ));

  let $rootScope;
  let $compile;

  // find element function without jquery dependencies
  const find = (elm, selector) => elm[0].querySelector(selector);
  const findAll = (elm, selector) => elm[0].querySelectorAll(selector);

  const tree = [{
    id : 1,
    name : 'Ben',
  }, {
    id : 2,
    name : 'Amy',
  }, {
    id : 3,
    name : 'George',
  }];

  // inject dependencies
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  // make
  function makeComponent(data, onChange, ...args) {
    const template = `
      <bh-checkbox-tree
        data=data
        on-change=callback(data)
        ${args.join(' ')}
        >
      </bh-checkbox-tree>
    `;

    const $scope = $rootScope.$new();
    $scope.data = data;
    $scope.callback = chai.spy(onChange);
    const element = $compile(angular.element(template))($scope);
    $scope.$digest();
    return { element, $scope };
  }

  it('renders a checkbox tree of size four', () => {
    const { element } = makeComponent(tree, angular.noop, 'is-flat-tree="true"', 'label-key="name"');
    const checkboxes = findAll(element, '.checkbox');
    expect(checkboxes).to.have.length(4);
  });

  it.skip('renders a tree with three levels of depth', () => {
    const data = [
      { id : 1, label : '1st Level', parent : 0 },
      { id : 2, label : '2nd Level', parent : 1 },
      { id : 3, label : '3rd Level', parent : 2 },
    ];
    const { element } = makeComponent(data, angular.noop);
    console.log('element:', element);
    const checkboxes = findAll(element, '.checkbox');
    expect(checkboxes).to.have.length(4);

    const lowestLevel = find(element, 'ul > ul > li > .checkbox span');
    expect(lowestLevel).to.have.attribute('data-label', '3rd Level');
  });

}
