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
]).filter('getImgURL', [
  function() {
    return function(memberId, size, year) {
      size = size || 320;
      year = year || 2014;
      var regexp = function(str) {
        return new RegExp(str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
      };
      return '/modules/members/img/{2}/{1}/{0}_{1}_{2}.jpg'
        .replace('{0}', ('0000' + memberId).slice(-4))
        .replace(regexp('{1}'), size)
        .replace(regexp('{2}'), year);
    };
  }
]).filter('getGeneration', [
  function() {
    return function(generation) {
      if (generation == 4) {
        return 'AKB48 三期生';
      } else if (generation == 6) {
        return 'AKB48 五期生';
      } else if (generation == 16) {
        return 'SKE48 四期生';
      } else if (generation == 20) {
        return 'HKT48 一期生';
      } else if (generation == 25) {
        return 'HKT48 二期生';
      } else if (generation == 29) {
        return 'HKT48 三期生';
      } else if (generation == 30) {
        return '選秀生';
      } else {
        return '';
      }
    };
  }
]).filter('getTeam', [
  function() {
    return function(team) {
      if (team == 23) {
        return 'AKB48 Team A';
      } else if (team == 24) {
        return 'AKB48 Team K';
      } else if (team == 25) {
        return 'AKB48 Team B';
      } else if (team == 27) {
        return 'SKE48 Team S';
      } else if (team == 29) {
        return 'SKE48 Team E';
      } else if (team == 30) {
        return 'NMB48 Team N';
      } else if (team == 33) {
        return 'Team H';
      } else if (team == 34) {
        return 'Team KIV';
      } else if (team == 35) {
        return '研究生';
      } else {
        return '';
      }
    };
  }
]).filter('getJob', [
  function() {
    return function(job) {
      if (job == 1) {
        return 'HKT48 劇場支配人兼務';
      } else if (job == 2) {
        return 'Team H 隊長';
      } else if (job == 3) {
        return 'Team KIV 隊長';
      } else if (job == 4) {
        return 'Team H 副隊長';
      } else if (job == 5) {
        return 'Team KIV 副隊長';
      } else {
        return '';
      }
    };
  }
]).filter('getForceData', ['$filter',
  function($filter) {
    return function(relationships, members, sourceMemberId) {
      var data = {'nodes':[], 'links':[], 'details':[]};
      // Step 1: First add source member into nodes.
      var sourceMember = $filter('getMemberById')(members, sourceMemberId);
      sourceMember.img2014120 = $filter('getImgURL')(sourceMemberId, 120, 2014);
      data.nodes.push(sourceMember);
      // Step 2: Add all target member into nodes and links queue.
      var i=0, len=relationships.length;
      for (; i<len; i++) {
        // Add target member into nodes.
        var targetMemberId = relationships[i].targetmemberid;
        var targetMember = $filter('getMemberById')(members, targetMemberId);
        targetMember.img2014120 = $filter('getImgURL')(relationships[i].targetmemberid, 120, 2014);
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
            'introductionsource': introductionMember.firstname + ' ' + introductionMember.lastname + ' ' + relationships[i].introductiondate,
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
