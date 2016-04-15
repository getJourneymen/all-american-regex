'use strict';

angular.module('sL.auth', ['ngStorage'])

.controller('AuthController', function ($rootScope, $scope,$window,$localStorage, $state, Auth) {
  $scope.user = {};
  $scope.message = '';

  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.sL', token);
        $rootScope.loggedIn = true;
        $state.go('searchBar');
      })
      .catch(function (error) {
        console.log('auth.js signin >>', error);
        $scope.message = error;
      });
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.sL', token);
        $state.go('searchBar');
      })
      .catch(function (error) {
        $scope.message = error;
        console.log('auth.js signup >>', error);
      });
  };

  $scope.logout = function() {

    Auth.logout()
      .then(function() {
        $window.localStorage.removeItem('com.sL');
        delete $localStorage.favs;
        console.log('local storage after logout:', $localStorage);
        $rootScope.loggedIn = false;
        $state.go('searchBar')
      })
      .catch(function(error) {
        $scope.message = error;
        console.log('auth.js logout >>', error)
      })
  }
});
