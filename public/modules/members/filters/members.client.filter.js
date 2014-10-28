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
    return function(memberId, size, year, isSquare) {
      size = size || 320;
      year = year || 2014;
      isSquare = isSquare || false;
      var regexp = function(str) {
        return new RegExp(str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
      };
      return '/modules/members/img/{2}/{1}{3}/{0}_{1}{3}_{2}.jpg'
        .replace('{0}', ('0000' + memberId).slice(-4))
        .replace(regexp('{1}'), size)
        .replace(regexp('{2}'), year)
        .replace(regexp('{3}'), isSquare? 's' : '');
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
        return 'HKT48 選秀生';
      } else {
        return '';
      }
    };
  }
]).filter('getGenerationDate', [
  function() {
    return function(generation) {
      if (generation == 4) {
        return 1165075200000;
      } else if (generation == 6) {
        return 1191600000000;
      } else if (generation == 16) {
        return 1283270400000;
      } else if (generation == 20) {
        return 1309449600000;
      } else if (generation == 25) {
        return 1346428800000;
      } else if (generation == 29) {
        return 1383235200000;
      } else if (generation == 30) {
        return 1384012800000;
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
]).filter('groupBy', ['$parse', 
  function($parse) {
    /**
     * groupBy
     *
     * Define when a group break occurs in a list of items
     *
     * @param {array}  the list of items
     * @param {String} then name of the field in the item from the list to group by
     * @returns {array} the list of items with an added field name named with "_new" appended to the group by field name
     *
     * @example 
     * <div ng-repeat="item in MyList  | groupBy:'groupfield'" >
     * <h2 ng-if="item.groupfield_CHANGED">{{item.groupfield}}</h2>
     *
     * Typically you'll want to include Angular's orderBy filter first
     */
    return function(list, groupBy) {

      var filtered = [];
      var prevItem = null;
      var groupChanged = false;
      // this is a new field which is added to each item where we append "CHANGED"
      // to indicate a field change in the list
      // was var newFiled = groupBy + 'CHANGED';
      var newFiled = 'groupByCHANGED';

      angular.forEach(list, function(item) {
        
        groupChanged = false;

        // if not the first item
        if (prevItem !== null) {

          // check if any of the group by field changed

          // force group_by into Array
          groupBy = angular.isArray(groupBy) ? groupBy : [groupBy];

          //check each group by parameter
          for (var i=0, len=groupBy.length; i<len; i++) {
            if ($parse(groupBy[i])(prevItem) !== $parse(groupBy[i])(item)) {
              groupChanged = true;
            }
          }
        } else {

          // otherwise we have the first item in the list which is new
          groupChanged = true;
        }

        // if the group changed, then add a new field to the item
        // to indicate this
        if (groupChanged) {
          item[newFiled] = true;
        } else {
          item[newFiled] = false;
        }

        filtered.push(item);
        prevItem = item;
      });

      return filtered;
    };
  }
]).filter('getAge', [
  function() {
    return function(birthday) {
      return Math.floor(((new Date()).getTime() - birthday) / (1000 * 60 * 60 * 24 * 365));
    };
  }
]).filter('getZodiacSign', [
  function() {
    return function(birthday) {
      var date = new Date(parseInt(birthday));
 
      var dateStr = +[date.getMonth() + 1, ('0' + date.getDate()).slice(-2)].join(''), signs = [
        [120, '摩羯座', 10, '♑'],
        [219, '寶瓶座', 11, '♒'],
        [320, '雙魚座', 12, '♓'],
        [420, '白羊座', 1, '♈'],
        [521, '金牛座', 2, '♉'],
        [621, '雙子座', 3, '♊'],
        [722, '巨蟹座', 4, '♋'],
        [822, '獅子座', 5, '♌'],
        [923, '室女座', 6, '♍'],
        [1023, '天秤座', 7, '♎'],
        [1122, '天蠍座', 8, '♏'],
        [1221, '人馬座', 9, '♐'],
        [1231, '摩羯座', 10, '♑']
      ];

      for (var index in signs) {
        var item = signs[index];
        if (dateStr <= item[0]) return item;
      }
    };
  }
]).filter('getBloodType', [
  function () {
    return function(bloodType) {
      if (bloodType == 1) {
        return 'A';
      } else if (bloodType == 2) {
        return 'B';
      } else if (bloodType == 3) {
        return 'AB';
      } else if (bloodType == 4) {
        return 'O';
      } else {
        return '不明';
      }
    };
  }
]).filter('getJapanPlace', [
  function () {
    return function(place) {
      if (place == 11) { return '埼玉縣'; }
      else if (place == 13) { return '東京都'; }
      else if (place == 23) { return '愛知縣'; }
      else if (place == 35) { return '山口縣'; }
      else if (place == 38) { return '愛媛縣'; }
      else if (place == 40) { return '福岡縣'; }
      else if (place == 41) { return '佐賀縣'; }
      else if (place == 42) { return '長崎縣'; }
      else if (place == 43) { return '熊本縣'; }
      else if (place == 44) { return '大分縣'; }
      else if (place == 45) { return '宮崎縣'; }
      else if (place == 46) { return '鹿兒島縣'; }
      else { return '不明'; }
    }
  }
]).filter('getJapanZone', [
  function () {
    return function(place) {
      var placeNum = parseInt(place);
      if ( 1 == placeNum ) { return '北海道地方'; }
      if ( 1 <= placeNum && placeNum < 8 ) { return '東北地方'; }
      if ( 8 <= placeNum && placeNum < 15 ) { return '關東地方'; }
      if ( 15 <= placeNum && placeNum < 24 ) { return '中部地方'; }
      if ( 24 <= placeNum && placeNum < 31 ) { return '近畿地方'; }
      if ( 31 <= placeNum && placeNum < 36 ) { return '中國地方'; }
      if ( 36 <= placeNum && placeNum < 40 ) { return '四國地方'; }
      if ( 40 <= placeNum && placeNum < 47 ) { return '九州地方'; }
      if ( 47 == placeNum ) { return '沖繩地方'; }
      return '海外';
    };
  }
]);
