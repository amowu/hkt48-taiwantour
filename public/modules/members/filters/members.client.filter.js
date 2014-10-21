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
    return function(imgurUrl, size) {
      if (imgurUrl === undefined) {
        return null;
      } else {
        return (imgurUrl.slice(0, 26) + size + imgurUrl.slice(26));
      }
    };
  }
]).filter('getImgSize', [
  function() {
    return function(memberId, size) {
      return '/modules/members/img/{1}/{0}_{1}.jpg'.replace('{0}', ('0000' + memberId).slice(-4)).replace(new RegExp('{1}'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), size);
    };
  }
]).filter('getForceData', ['$filter',
  function($filter) {
    return function(relationships, members, sourceMemberId) {
      var data = {'nodes':[], 'links':[], 'details':[]};
      // Step 1: First add source member into nodes.
      var sourceMember = $filter('getMemberById')(members, sourceMemberId);
      sourceMember.imgsize120 = $filter('getImgSize')(sourceMemberId, 120);
      data.nodes.push(sourceMember);
      // Step 2: Add all target member into nodes and links queue.
      var i=0, len=relationships.length;
      for (; i<len; i++) {
        // Add target member into nodes.
        var targetMemberId = relationships[i].targetmemberid;
        var targetMember = $filter('getMemberById')(members, targetMemberId);
        targetMember.imgsize120 = $filter('getImgSize')(relationships[i].targetmemberid, 120);
        data.nodes.push(targetMember);

        // Add links.
        var link = {
          'source': 0,
          'target': i + 1,
          'memberid': relationships[i].memberid,
          'targetmemberid': relationships[i].targetmemberid,
          'relationshipdirection': relationships[i].relationshipdirection,
          'group': relationships[i].group
        };
        data.links.push(link);

        // Add details.
        var introductionMember = $filter('getMemberById')(members, relationships[i].introductionmemberid);
        if (parseInt(relationships[i].group) >= data.details.length) {
          var detail = {
            'group': relationships[i].group,
            'keyword': relationships[i].keyword,
            'content': relationships[i].content,
            'introduction': relationships[i].introduction,
            'introductionmembername': introductionMember.firstname + ' ' + introductionMember.lastname,
            'introductiondate': relationships[i].introductiondate,
            'imgurl': relationships[i].imgurl
          };
          data.details.push(detail);
        }
      }

      return data;
    };
  }
]).filter('getGroupByTartgetMemberId', [
  function() {
    return function(links, targetMemberId) {
      var i=0, len=links.length;
      for (; i<len; i++) {
        if (links[i].targetmemberid == targetMemberId) {
          return links[i].group;
        }
      }
      return 0;
    };
  }
]);
