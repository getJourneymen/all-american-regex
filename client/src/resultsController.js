'use strict';

angular.module('sL.resultsController', [])

.controller('ResultsController', function($scope, $state, Data, News, SearchSwap, swap, API, CapData) {
  $scope.heading = 'Sentiment Score';
  $scope.data = Data.newsLinks;
  $scope.chartData = Data.d3Chart;
  // console.log('results controller Data:',Data.newsLinks)
  $scope.predicate = '';
  $scope.reverse = true;
  $scope.totals = {};
  console.log('What is swap?:', swap)
  // var swap = swap;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
  // $scope.changeListener = function(data) {
  //   pieChart.change(data)
  //   console.log('this should be item',data);
  // }

  var getSentimentTotals = function() {
    API.sentimentTotals().then(function(resp) {
        Data.totals = resp.data;
        // console.log('Data totals:', resp.data)
        Data.totals.forEach(function(val, ind) {
          if (!$scope.totals[val.query]) {
            $scope.totals[val.query] = {
              score: Number(val.sentiment),
              total: 1
            };
          } else {
            $scope.totals[val.query].score += Number(val.sentiment)
            $scope.totals[val.query].total += 1;
          }
        })

        Data.totals = [];

        for (var key in $scope.totals) {
          $scope.totals[key].score = $scope.totals[key].score / $scope.totals[key].total;
          $scope.totals[key].score = $scope.totals[key].score * 100;
          $scope.totals[key].score = $scope.totals[key].score.toFixed(0);
          Data.totals.push($scope.totals[key]);
          Data.totals[Data.totals.length - 1].name = key;
        }
        Data.totals.sort(function(a, b) {
          return a.score < b.score;
        })
        // console.log('scope totals! = ', Data.totals);
      })
      .catch(function(err) {
        console.log(err);
      })

  }

  var getImages = function() {
    SearchSwap.getItems(swap).then(function(resp){
      Data.newsLinks.data = resp;

      console.log('getImages resp:', resp)
      SearchSwap.getImages(Data.newsLinks.data);
      SearchSwap.getScores(Data.input)
      .then(function(resp){
          Data.d3Chart.push(Object.assign({}, resp));
        //alert(JSON.stringify(Data.newsLinks.data))
        //CapData.setData(Data.newsLinks.data);
        // $scope.chartData = Object.assign({Data.newsLinks.data});
      //  alert(JSON.stringify($scope.chartData))
        getSentimentTotals();
      })
    .catch(function(err) {
      console.log('getImages err === ', err);
    });
    })
  };

  $scope.getLinks = function() {};

  getImages();
});
