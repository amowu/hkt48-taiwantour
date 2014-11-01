'use strict';

// Members controller
angular.module('members').controller('MembersController', ['$scope', '$filter', '$http', '$stateParams', '$location', 'cfpLoadingBar', '$document', '$state',
  function($scope, $filter, $http, $stateParams, $location, cfpLoadingBar, $document, $state) {

    $scope.toTheTop = function() {
      $document.scrollTopAnimated(0);
    }

    $scope.isLoading = false;
    $scope.isCollapsed = false;

    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    var loadingStart = function() {
      $scope.isLoading = true;
      cfpLoadingBar.start();
    };

    var loadingComplete = function() {
      $scope.isLoading = false;
      cfpLoadingBar.complete();
    };

    // Find a list of Members.
    $scope.find = function() {

      loadingStart();

      $scope.canReverse = function(orderProp) {
        return !!~['year','height'].indexOf(orderProp);
      };

      $http.get('modules/members/members.json').success(function(data) {
        $scope.orderProp = 'team';
        angular.forEach(data, function(member) {
          member.year = $filter('getAge')(member.birthday);
          member.catchphrase = member.catchphrase.replace('{0}', member.year);
          member.zodiacsign = $filter('getZodiacSign')(member.birthday)[1];
          member.zodiacsignsymbol = $filter('getZodiacSign')(member.birthday)[3];
          member.zodiacsignorder = $filter('getZodiacSign')(member.birthday)[2];
        });
        $scope.members = data;

        loadingComplete();
      });
    };

    // Find existing Member.
    $scope.findOne = function() {

      $scope.canShowMember = true;

      loadingStart();

      // Initialize.
      $scope.members = null; // All members data.
      $scope.member = null; // Current member's data.
      $scope.keywords = null; // Current member's keywords array.
      $scope.relationships = null; // Current member's relationships array.
      $scope.details = null; // Current member's relationship details array.
      $scope.d3Nodes = null; // Current member's relationship nodes array for d3.
      $scope.d3Links = null; // Current member's relationship links array for d3.
      $scope.currentGroup = 0; // Current selected member's relationship detail group number.
      $scope.svgWidth = 0; // d3 svg canvas width.
      $scope.svgHeight = 0; // d3 svg canvas height.
      $scope.onTargetMemberHover = null; // Current member's target relationship member mouseover event.
      $scope.onTargetMemberClick = null; // Current member's target relationship member mouseclick event.
      $scope.images = null; // Currnt member's images array.

      // Get all members data.
      //
      // Why need to get all members data?
      // Because URL route use member fullname not member id,
      // so I need to get all members data for find member object use.
      $http.get('modules/members/members.json').error(function(data, status, headers, config) {
        // Called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('HTTP get members.json error.');
        console.log(data);
      }).success(function(members) {
        $scope.members = members;
        // Find member object by fullname.
        var member = $filter('getMemberIdByFullName')(members, $stateParams.memberFullName);
        // Set page title to member fullname.
        $state.current.title = member.firstname + member.lastname;
        // Use tabletop to get member's data on google spreadsheet.
        Tabletop.init({
          key: '1MlbQ8V-O2Q3vGmquuzqUV4whqtlTpzkKF6VFNTgsYx4', // Key for google spreadsheet.
          query: 'memberid = ' + member.memberid, // Query by Member ID cloumn.
          callback: function(data, tabletop) {
            // Callback data will return four array:
            // 1. Current member array = tabletop.sheets('member')
            // 2. Current member's keywords array = tabletop.sheets('keyword')
            // 3. Current member's relationships array = tabletop.sheets('relationship')
            // 4. Current member's images array = tabletop.sheets('image')
            $scope.$apply(function() {
              $scope.member = tabletop.sheets('member').all()[0];
              $scope.keywords = tabletop.sheets('keyword').all();
              $scope.relationships = tabletop.sheets('relationship').all();
              $scope.images = $filter('shuffle')(tabletop.sheets('image').all());
              // Initialize member module.
              $scope.member.year = $filter('getAge')($scope.member.birthday);
              $scope.member.catchphrase = $scope.member.catchphrase.replace('{0}', $scope.member.year);
              $scope.member.zodiacsign = $filter('getZodiacSign')($scope.member.birthday)[1];
              $scope.member.zodiacsignsymbol = $filter('getZodiacSign')($scope.member.birthday)[3];
              $scope.member.img2014320 = $filter('getImgURL')($scope.member.memberid, 320, 2014);
              $scope.member.img2013320 = $filter('getImgURL')($scope.member.memberid, 320, 2013);
              $scope.member.img2012320 = $filter('getImgURL')($scope.member.memberid, 320, 2012);
              $scope.member.img2011320 = $filter('getImgURL')($scope.member.memberid, 320, 2011);
              $scope.member.img2014320s = $filter('getImgURL')($scope.member.memberid, 320, 2014, true);
              $scope.member.img2013120s = $filter('getImgURL')($scope.member.memberid, 120, 2013, true);
              $scope.member.img2012120s = $filter('getImgURL')($scope.member.memberid, 120, 2012, true);
              $scope.member.img2011120s = $filter('getImgURL')($scope.member.memberid, 120, 2011, true);
              $scope.member.tooltip = $filter('getHistoryTooltipTemplate')($scope.member.memberid, $scope.member.generation);
              // Initialize D3 module.
              var forceData = $filter('getForceData')($scope.relationships, members, $scope.member.memberid);
              $scope.d3Nodes = forceData.nodes;
              $scope.d3Links = forceData.links;
              $scope.details = forceData.details;
              $scope.currentGroup = 0;
              $scope.svgWidth = 585;
              $scope.svgHeight = 555;
              $scope.onTargetMemberHover = function($event) {
                var targetMemberId = angular.element($event.target).scope().node.memberid;
                var group = $filter('getGroupByTartgetMemberId')($scope.d3Links, targetMemberId);
                $scope.currentGroup = group;
              };
              $scope.onTargetMemberClick = function($event) {
                var member = angular.element($event.target).scope().node;
                var fullName = member.firstnameen + '-' + member.lastnameen;
                $location.path('members/' + fullName);
              };
              var force = d3.layout.force()
                .nodes($scope.d3Nodes)
                .links($scope.d3Links)
                .friction(0.9)
                .distance(100)
                .charge(-5000)
                .gravity(0.1)
                .theta(0.8)
                .alpha(0.1)
                .size([$scope.svgWidth, $scope.svgHeight])
                .on('tick', function() {
                  $scope.$apply();
                })
                .start();
            });

            loadingComplete();

            $scope.canShowMember = $scope.member.enabled;
            $scope.underConstructionText = '敬請期待♥';
          }
        });
      });
    };
  }
]);
