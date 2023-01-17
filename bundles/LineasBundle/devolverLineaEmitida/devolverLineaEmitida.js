saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("devolver-linea-emitida", {
            url: "/lineas/devolveremitida/",
            views: {
                "main": {
                    controller: "DevolverLineaEmitidaCtrl",
                    templateUrl: "../bundles/LineasBundle/devolverLineaEmitida/devolverLineaEmitida.tpl.html"
                }
            }
        });
    }
]).controller("DevolverLineaEmitidaCtrl", ["$scope", "root", "$http", "Solicitud",
    function ($scope, root, $http, Solicitud) {
        $scope.item = {};
        
        function callback(data) {
            console.log(data);
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");           
        };
        
        $scope.consultar = function() {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            Solicitud.query({id:$scope.solicitud.idsolicitud}).$promise.then(function(data){
                $scope.solicitud = data.data;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        };
        
        $scope.devolver = function () {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $http.get(root+"lineas/devolveremitida/"+$scope.solicitud.idsolicitud).then(function(result) {
                callback(result.data);
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        }
        
        

    }
]);
