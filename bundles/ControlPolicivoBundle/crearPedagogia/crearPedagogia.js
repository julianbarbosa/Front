saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-crearpedagogia", {
            url: "/controlpolicivo/crearpedagogia/:id",
            views: {
                "main": {
                    controller: "ControlPolicivoCrearPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/crearPedagogia/crearPedagogia.tpl.html"
                }
            }
        }); 
    }
]).controller("ControlPolicivoCrearPedagogiaCtrl", ["$scope", "root", "$stateParams","Pedagogia","ComportamientoContrarioAll", "dsJqueryUtils", "Upload",
    function ($scope, root, $stateParams, Pedagogia, ComportamientoContrarioAll, dsJqueryUtils, Upload) {        
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();  
        $scope.ocultarModal = true;        
        $scope.modalOpen = false;         
        
        Pedagogia.query({id:$stateParams.id}).$promise.then(function (result) {
            $scope.pedagogia = {};
            $scope.pedagogia = result;            
            ComportamientoContrarioAll.query().$promise.then( function (result) {
                $scope.comportamientosContrarios = result;                  
                $scope.pedagogia.id = $stateParams.id;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        });
        
        
                
        $scope.onSelect = function ($item, $model, $label) {            
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };
        
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
        }
        ;

        
        $scope.save = function () 
        {            
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            if (true) {                         
                dsJqueryUtils.goTop();
                Pedagogia.save($scope.pedagogia).$promise.then(function(response) {
                    callback(response);
                    $scope.pedagogia = {};
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                });
            } 
        };
    }
]);
