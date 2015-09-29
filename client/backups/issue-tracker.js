(function (angular) {
    var mod = angular.module('AngularApp', []);
    mod.controller('mainCtrl', function ($scope, $http, $log) {
        $scope.openIssues = null;

        retrive_data()


        function retrive_data() {

           // $http.jsonp('http://localhost:3000/api/issues?callback=JSON_CALLBACK')
            $http.get('http://localhost:3000/api/issues')
                .success(function (data) {
                    $scope.openIssues = data;
                    console.log('get called made' + data)

                })
                .error(function (err) {
                    $log.error(err);
                })

        };

        $scope.addNewIssue = function (newIssue) {

            // make an api call to save data


          //console.log('------')
            //console.log(newIssue)
            var dto = {};
            dto.name = newIssue.subject;
            dto.desc = newIssue.content;


            var res = $http.post('http://localhost:3000/api/create', dto, {
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




          //  setTimeout( retrive_data, 1000)


        };

    });
})(angular);