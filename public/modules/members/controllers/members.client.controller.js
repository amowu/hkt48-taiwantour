'use strict';

// Members controller
angular.module('members').controller('MembersController', ['$scope', '$filter', '$http', '$stateParams', '$location', 'Authentication', 
  function($scope, $filter, $http, $stateParams, $location, Authentication) {
    $scope.authentication = Authentication;

    // Find a list of Members
    $scope.find = function() {
      $http.get('modules/members/members.json').success(function(data) {
        $scope.members = data;
      });
    };

    // Find existing Member
    $scope.findOne = function() {
      $http.get('modules/members/members.json').success(function(data) {
        // find member object by full name
        var member = $filter('getMemberIdByFullName')(data, $stateParams.memberFullName);
        // use member ID to get tabletop data
        Tabletop.init({
          key: '1MlbQ8V-O2Q3vGmquuzqUV4whqtlTpzkKF6VFNTgsYx4',
          query: 'memberid = ' + member.memberid,
          callback: function(data, tabletop) {
            console.log(tabletop.sheets('member').all());
            console.log(tabletop.sheets('keyword').all());
            console.log(tabletop.sheets('relationship').all());
            console.log(tabletop.sheets('image').all());
            $scope.$apply(function() {
              $scope.member = tabletop.sheets('member').all()[0];
              $scope.keywords = tabletop.sheets('keyword').all();
              $scope.relationships = tabletop.sheets('relationship').all();
              $scope.images = tabletop.sheets('image').all();

              // TODO: d3 test code
              $scope.width = 500;
              $scope.height = 500;
              $scope.nodes = [
                {"name":"Myriel","group":1},
                {"name":"Napoleon","group":1},
                {"name":"Mlle.Baptistine","group":1},
                {"name":"Mme.Magloire","group":1}
              ];
              $scope.links = [
                {"source":1,"target":0,"value":1},
                {"source":2,"target":0,"value":8},
                {"source":3,"target":0,"value":10}
              ];
              var force = d3.layout.force()
                .nodes($scope.nodes)
                .links($scope.links)
                .charge(-120)
                .linkDistance(30)
                .size([$scope.width, $scope.height])
                .on('tick', function() {
                  $scope.$apply();
                })
                .start();

            });
          }
        });
      });
    };
  }
]);
