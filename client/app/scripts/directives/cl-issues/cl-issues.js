angular.module('AngularApp')
  .directive('clIssues', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'scripts/directives/cl-issues/cl-issues.html',
      controller: 'clIssuesCtrl'
    };
  })
  .controller('clIssuesCtrl', clIssuesCtrl);


const API_BASE_URL = "http://localhost:3000/api/";


function clIssuesCtrl($scope, $http, $log, IssueService) {
  $scope.openIssues = {
    name: null,
    description: null

  };

  retrive_data();

  function retrive_data() {
    IssueService.load_data().then(function (response) {
      $scope.openIssues = response;
    })

  }

  $scope.addNewIssue = function (newIssue) {

//TODO should ideally be part of the service code

    IssueService.save_data(newIssue).then(function(){
      retrive_data();
    });
    
  };

  $scope.handelEdit = function (data, item) {

    //find the id of the changed element - on the UI
    //TODO null guard  - better validation here

    var dto = {};
    dto.name = data.title;
    dto.desc = data.description;

    var res = $http.put(API_BASE_URL + 'issues/' + item._id, dto, {
      headers: {'Content-Type': 'application/json'},
    });
    res.success(function (data, status, headers, config) {
      $scope.message = data;
      //data is inserted -
      retrive_data();
    });
    res.error(function (data, status, headers, config) {
      alert("failure message: " + JSON.stringify({data: data}));
    });

  };

  $scope.deleteRecord = function (item) {
    $http.delete(API_BASE_URL + 'issues/' + item._id)
      .success(function (data) {
        retrive_data();
      })
      .error(function (err) {
        $log.error(err);
      })

  }

};

