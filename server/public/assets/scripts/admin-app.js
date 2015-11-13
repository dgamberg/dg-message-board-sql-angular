var myApp = angular.module('myApp', []);

myApp.controller('MessageController', ['$scope', '$http', function($scope, $http){
    $scope.message = {};
    $scope.messagesArray = [];

    //POST
    $scope.addMessage = function(response){
        $http.post('/data', response).then(function(response){
            console.log(response);
            $scope.getMessages();
        });
    };

    //GET
    $scope.getMessages = function(){
        $http.get('/data').then(function(response){
            console.log(response.data)
            $scope.messagesArray = response.data;
        });
    };

    //DELETE MESSAGE
    $scope.deleteMessage = function(){
        console.log($scope.message.id);
        $http({
            method: 'PUT',
            url: '/data'
        }).then(function(){
            $scope.getMessages();
        });
    }

    //READ all messages
    $scope.getMessages();
}]);