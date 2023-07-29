saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-actualizardelrnmc", {
            url: "/controlpolicivo/actualizardelrnmc/",
            views: {
                "main": {
                    controller: "ControlPolicivoActualizarDelRnmcCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/actualizarDelRnmc/actualizarDelRnmc.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoActualizarDelRnmcCtrl", ["$scope", "ActualizarComparendosRNMCService", "LoadingOverlap", "ListarTiposDocIdentificacion","ActualizarCustodioRNMCService",
    function ($scope, ActualizarComparendosRNMCService, LoadingOverlap, ListarTiposDocIdentificacion, ActualizarCustodioRNMCService) {
        
        $scope.actualizacion = {};
        
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();
        ListarTiposDocIdentificacion.query().$promise.then(function(response){
            $scope.arrayTipoDocIdentificacion = response;
            $(".overlap_espera").fadeOut(500, "linear");
            $(".overlap_espera_1").fadeOut(500, "linear");
        } );
        
        var fnMostrarCortina = function(mostrar, callback, dataCallback){
			//Si se debe mostrar la cortina
			if(mostrar){
				//Iniciamos a mostrar la cortina
				LoadingOverlap.show($scope, callback, dataCallback);
			}else{
				LoadingOverlap.hide($scope, callback, dataCallback);
			}
		};
        
        $scope.alert = {type: '', msg: ''};
        
        $scope.actualizarDatosComparendo = function () { 
            fnMostrarCortina(true);
            tipoIdentificacion = $scope.actualizacion.tipoidentificacion.replace('.','');
            console.log(tipoIdentificacion);
            ActualizarComparendosRNMCService.get(tipoIdentificacion, $scope.actualizacion.numeroidentificacion).then(function (respuesta) {
                fnMostrarCortina(false, function(resp) {
                    $scope.alert = resp;                    
				}, respuesta);
                $scope.actualizacion = {};
            }, function(error){
				fnMostrarCortina(false, function(error){
					alert('Ha ocurrido un error. '+error.msg);
					setEntity({});
				}, error);
			});
        }; 

		$scope.actualizarDatosCustodio = function () { 
            fnMostrarCortina(true);
            ActualizarCustodioRNMCService.get($scope.actualizacion.expediente, $scope.actualizacion.numeroidentificacion).then(function (respuesta) {
                fnMostrarCortina(false, function(resp) {
                    $scope.alert = resp;                    
				}, respuesta);
                $scope.actualizacion = {};
            }, function(error){
				fnMostrarCortina(false, function(error){
					alert('Ha ocurrido un error. '+error.msg);
					setEntity({});
				}, error);
			});
        }; 		
    }
]);
