'use strict';

angular.module('members').filter('getMemberIdByFullName', [
  function() {
    /**
     * @param members A member object arrays.
     * @param fullName A member full name that want to find, format is 'firstname-lastname'.
     *
     * @return A member object.
     */
    return function(members, fullName) {
      var nameAry = fullName.split('-');
      var firstName = nameAry[0],
          lastName = nameAry[1];
      var i=0, len=members.length;
      for (; i<len; i++) {
        if (members[i].firstnameen === firstName &&
            members[i].lastnameen === lastName) {
          return members[i];
        }
      }
      return null;
    };
  }
]).filter('getMemberById', [
  function () {
    return function(members, memberId) {
      var i=0, len=members.length;
      for (; i<len; i++) {
        if (members[i].memberid == memberId) {
          return members[i];
        }
      }
      return null;
    };
  }
]).filter('thumbnail', [
  function() {
    return function(imgurUrl) {
      if (imgurUrl === undefined) {
        return null;
      } else {
        return (imgurUrl.slice(0, 26) + 'm' + imgurUrl.slice(26));
      }
    };
  }
]).filter('getImgSize120', [
  function() {
    return function(memberId) {
      return '/modules/members/img/120/{0}_120.jpg'.replace('{0}', ('0000' + memberId).slice(-4));
    };
  }
]).filter('getForceData', ['$filter',
  function($filter) {
    return function(relationships, members, sourceMemberId) {
      var data = {'nodes':[], 'links':[], 'details':[]};
      // Step 1: First add source member into nodes.
      var sourceMember = $filter('getMemberById')(members, sourceMemberId);
      sourceMember.imgsize120 = $filter('getImgSize120')(sourceMemberId);
      data.nodes.push(sourceMember);
      // Step 2: Add all target member into nodes and links queue.
      var i=0, len=relationships.length;
      for (; i<len; i++) {
        // Add target member into nodes.
        var targetMemberId = relationships[i].targetmemberid;
        var targetMember = $filter('getMemberById')(members, targetMemberId);
        targetMember.imgsize120 = $filter('getImgSize120')(relationships[i].targetmemberid);
        data.nodes.push(targetMember);
        
        // Add links.
        var link = {
          'source': 0,
          'target': i + 1,
          'memberid': relationships[i].memberid,
          'targetmemberid': relationships[i].targetmemberid,
          'relationshipdirection': relationships[i].relationshipdirection
        };
        data.links.push(link);
        
        // Add details.
        if (parseInt(relationships[i].group) >= data.details.length) {
          var detail = {
            'group': relationships[i].group,
            'keyword': relationships[i].keyword,
            'content': relationships[i].content,
            'introduction': relationships[i].introduction,
            //'introductionmember': $filter('getMemberById')(members, relationships[i].introductionmemberid),
            'introductiondate': relationships[i].introductiondate,          
            'imgurl': relationships[i].imgurl
          };
          data.details.push(detail);
        }
      }

      return data;
    };
  }
]);
