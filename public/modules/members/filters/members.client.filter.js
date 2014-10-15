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
]).filter('thumbnail', [
  function() {
    return function(imgurUrl) {
      if (imgurUrl === undefined) {
        return null;
      } else {
        return (imgurUrl.slice(0, 27) + 'm' + imgurUrl.slice(27));
      }
    };
  }
]);
