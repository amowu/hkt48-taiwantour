'use strict';

// Members controller
angular.module('members').controller('MembersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Members',
  function($scope, $stateParams, $location, Authentication, Members ) {
    $scope.authentication = Authentication;

    // Find a list of Members
    $scope.find = function() {
      $scope.members = Members.query();
    };

    // Find existing Member
    $scope.findOne = function() {
      $scope.member = Members.get({
        memberId: $stateParams.memberId
      });
    };
  }
]);
