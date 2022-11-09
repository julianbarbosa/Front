saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("sig-busqueda", {
            url: "/sig/busqueda",
            views: {
                "main": {
                    controller: "SIGConsultarRespuestaCtrl",
                    templateUrl: "../bundles/SIGBundle/busqueda/busqueda.tpl.html"
                }
            }
        });
    }
]).controller("BusquedaCtrl", ["$scope", "SIG", "$timeout", "$state", 
    function ($scope, SIG, $timeout, $state) {        

        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        
        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };       
   
        $scope.save = function () { 
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
        
            SIG.query({data:$scope.data}).$promise.then(function (response) {
                $scope.result = angular.fromJson(response);
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");                                
            });
        };
        
        $scope.cancel = function () {
        };
    }
]);
