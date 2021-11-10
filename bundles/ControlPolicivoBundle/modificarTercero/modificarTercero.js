saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-modificartercero", {
            url: "/controlpolicivo/modificartercero/:id",
            views: {
                "main": {
                    controller: "ControlPolicivoModificarTerceroCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/modificarTercero/modificarTercero.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoModificarTerceroCtrl", ["root","$scope", "$http", "ComparendoPorId", "$filter", "$stateParams", "root", "AnularPedagogiasActivas", "LoadingOverlap", "Upload", "ComportamientoContrario",
    function (root, $scope, $http, Comparendo, $filter, $stateParams, root, AnularPedagogiasActivas, LoadingOverlap, Upload, ComportamientoContrario) {
		

        
        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};

            $scope.validator.alert.content = data.msg ;

            if(data.success===true) {
                $scope.validator.alert.type = 'alert-success';
                $scope.validator.alert.title = "Exito: ";
            } else {
                $scope.validator.alert.type = 'alert-danger';
                $scope.validator.alert.title = "Advertencia: ";
            }
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };

     	
        $scope.actualizarDatos = function ()
        {
            Comparendo.get({'id':$stateParams.id}).$promise.then(function (response) {                
                if(response.success==true) {                    
                    $scope.comparendo = response.data;                             
                } else {
                    bootbox.alert({
                        message: response.msg,
                        size: 'small'
                    });   
                    $scope.busqueda = {};                 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
    
                }                
            }); 
        };
		$scope.actualizarDatos();
		
		$scope.modificarTercero = function() {
			$http.post(root+'controlpolicivo/modificartercero',{'id':$scope.comparendo.id, 'nombre':$scope.comparendo.infractor.nombre, 'apellido':$scope.comparendo.infractor.apellido}).then(function (result) {                
               bootbox.alert({
                    message: result.data.msg,
                    size: 'small'
                });
                $scope.actualizarDatos();
            });
		}
		
        $scope.consultarPermisos = function () {
            $scope.permisos = [];            
            $http.get(root+'usuario/permisos',{}).then(function (result) {                
                console.log(result);
                angular.forEach(result.data.permisos, function(value, key) {
                    $scope.permisos[value] = true
                });
                $scope.userId = result.data.id+'';
            });

        };
        $scope.consultarPermisos();

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }
    }
]);
