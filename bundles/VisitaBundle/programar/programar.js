saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("programar-visita", {
            url: "/gestionar-visita/programar/:idVisita",
            views: {
                "main": {
                    controller: "ProgramarVisitaCtrl",
                    templateUrl: "../bundles/VisitaBundle/programar/programar.tpl.html"
                }
            }
        });
    }
])
.controller("ProgramarVisitaCtrl", ["$scope", "$http","root", "$stateParams", "Visita", "dsJqueryUtils", "Upload",  "$state", "LoadingOverlap",
    function ($scope, $http, root, $stateParams, Visita, dsJqueryUtils, Upload, $state, LoadingOverlap) {

        $scope.root = root;
        $scope.visita;
        $scope.programacion = {};
    
        //Búsqueda de la visita
        $scope.consultarVisita = function() {
            LoadingOverlap.show($scope);
            Visita.find({id: $stateParams.idVisita}).$promise.then(function (response) {                
                LoadingOverlap.hide($scope);
                if(response.estado.codigo !== 'pendienteprogramar') {
                    bootbox.alert("La visita esta en un estado en el que no se puede programar.");
                } else {
                    $scope.visita = response;
                }
            });        
        }
        $scope.consultarVisita();
        
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
            
            bootbox.confirm("Confirma que finalizó la programación?",
            function (result) {
                if (result) {
                    data = {
                        visita: $scope.visita,
                        programacion: $scope.programacion
                    };
                    LoadingOverlap.show($scope);
                    $http.post(root + 'gestionar_visita/programar',data).then(function (response) {
                        LoadingOverlap.hide($scope);
                        $scope.result = response.data;  
                        console.log(response);                     
                        if (response.data.success) {
                            callback(response.data);
                            $scope.programacion = {};
                        } else {
                            bootbox.alert(response.data.msg);
                        } 
                        $scope.isSuccess = true;
                    });
                } else {
                    dsJqueryUtils.goTop();
                }
            });
        };
        

        $scope.cancel = function () {
        };
    }
]);