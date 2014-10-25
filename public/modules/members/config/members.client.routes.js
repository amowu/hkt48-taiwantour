'use strict';

//Setting up route
angular.module('members').config(['$stateProvider',
	function($stateProvider) {
		// Members state routing
		$stateProvider.
		state('listMembers', {
			url: '/members',
			templateUrl: 'modules/members/views/list-members.client.view.html'
		}).
		state('viewMember', {
			url: '/members/:memberFullName',
			templateUrl: 'modules/members/views/view-member.client.view.html'
		});
	}
]);
