'use strict';

angular.module('sL', [
  'sL.resultsController',
  'sL.aboutController',
  'sL.historyController',
  'sL.searchBar',
  'sL.services',
  'sL.auth',
  'ui.bootstrap',
  'ui.router',
  'ngAnimate',
  'sL.statechange',
  'ngResource',
  'sL.apiFactory',
  'sL.favsController'
])
//set user login status
.run(function($rootScope, $window) {
  $rootScope.loggedIn = !! $window.localStorage.getItem('com.sL');
})
// spinner for page loading status
.run(function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.stateIsLoading = false;
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.stateIsLoading = true;
  });
  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.stateIsLoading = false;
  });
  $rootScope.$on('$routeChangeError', function() {
    //catch error
  });
})


.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/searchBar');

  $stateProvider
    .state('searchBar', {
      url: '/searchBar',
      templateUrl: 'views/searchBar.html',
      controller: 'SearchBar'
    })
    .state('searchBar.results', {
      url: '/results',
      templateUrl: 'views/searchBar.results.html',
      controller: 'ResultsController',
      resolve: {
        // SearchSwap: 'SearchSwap',
        // News: 'News',
        // Data: 'Data',
        //
        // Auth: 'Auth',
        swap: function(SearchSwap, News, Data, Auth, API) {
          console.log('called resolve state');
          return API.getTopTen(Data.input);
        }
      }
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'views/signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signup.html',
      controller: 'AuthController'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      controller: 'AboutController'
    })
    .state('history', {
      url: '/history',
      templateUrl: 'views/searchHistory.html',
      controller: 'favoriteController',
      resolve:{
        favorites: function(Favs){
          return Favs.getFav();
        }
      }
    });

});
