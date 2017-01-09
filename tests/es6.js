"use strict";
module.exports = {
  name: "ES6 Tests",
  tests: [
  {
    name: "simple class",
    implicit: true,
    input: function(){
          class svc {
              constructor(dep1){
                  this.dep1 = dep1;
              }
          }
          angular.module('MyMod').service('MySvc', svc);
    },
    expected: function(){
      class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.$inject = ['dep1'];
      angular.module('MyMod').service('MySvc', svc);
    }
  },
  {
    name: "exported class",
    implicit: true,
    noES5: true, // this works with the ES2015 preset, but the transformations
                 // make it difficult to test
    input: `
      export default class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      angular.module('MyMod').service('MySvc', svc);
    `,
    expected: `
      export default class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.$inject = ['dep1'];
      angular.module('MyMod').service('MySvc', svc);
    `
  },
  {
    name: "exported annotated function",
    explicit: true,
    input: `
      /* @ngInject */
      export default function svc(dep1){}
    `,
    expected: `
      svc.$inject = ["dep1"];
      /* @ngInject */
      export default function svc(dep1){}
    `
  },
  {
    name: "annotated class",
    explicit: true,
    input: function(){
      /* @ngInject */
      class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.foo = 'bar';
    },
    expected: function(){
      /* @ngInject */
      class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.$inject = ['dep1'];
      svc.foo = 'bar';
    }
  },
  {
    name: "exported annotated class",
    noES5: true,
    explicit: true,
    input: `
      /* @ngInject */
      export default class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.foo = 'bar';
    `,
    expected: `
      /* @ngInject */
      export default class svc {
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.$inject = ['dep1'];
      svc.foo = 'bar';
    `
  },
  {
    name: "annotated constructor",
    explicit: true,
    input: function(){
      class svc {
          /* @ngInject */
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.foo = 'bar';
    },
    expected: function(){
      class svc {
          /* @ngInject */
          constructor(dep1){
              this.dep1 = dep1;
          }
      }
      svc.$inject = ['dep1'];
      svc.foo = 'bar';
    }
  },
  {
    name: "constructor with prologue directive",
    explicit: true,
    input: function(){
      class svc {
          constructor(dep1){
              'ngInject';
              this.dep1 = dep1;
          }
      }
      svc.foo = 'bar';
    },
    expected: function(){
      class svc {
          constructor(dep1){
              'ngInject';
              this.dep1 = dep1;
          }
      }
      svc.$inject = ['dep1'];
      svc.foo = 'bar';
    }
  }, {
    name: "object method",
    explicit: true,
    input: function() {
      var foo = {
        bar(baz){
          'ngInject';
        }
      };
    },
    expected: function() {
      var foo = {
        bar: ['baz', function(baz) {
          'ngInject';
        }]
      }
    }
  }, {
    name: "implicit object method",
    explicit: false,
    input: function() {
      angular.component('myComponent', {
        controller(a){}
      });
    },
    expected: function() {
      angular.component('myComponent', {
        controller: ['a', function(a){}]
      });
    }
  }
 ]
};
