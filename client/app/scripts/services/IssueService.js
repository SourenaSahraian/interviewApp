angular.module('AngularApp').service('IssueService', function ($http, $log) {

  var IssueService = {

    load_data: function () {
      // $http returns a 'promise'
      return $http.get("http://localhost:3000/api/issues").then(function (response) {
          return response.data;
        }
        , function (error) {
          $log.error(error);
        }
      );
    },

    save_data: function (newIssue) {


      var dto = {};
      dto.name = newIssue.subject;
      dto.desc = newIssue.content;

      return $http.post('http://localhost:3000/api/create', dto, {
        headers: {'Content-Type': 'application/json'},
      }).then(function (successResponse) {
       return successResponse.data;
      }) , function (error) {
        $log.error(error);
      }

    }

  };




  return IssueService;
});
