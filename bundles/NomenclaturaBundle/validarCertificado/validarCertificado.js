saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("validar-certificado-nomenclatura", {
            url: "/nomenclatura/validar-certificado/:code?",
            views: {
                "main": {
                    controller: "ValidarCertificadoCtrl",
                    templateUrl: "../bundles/NomenclaturaBundle/validarCertificado/validarCertificado.tpl.html"
                }
            }
        });
    }
]).controller("ValidarCertificadoCtrl", ["$scope", "$stateParams", "$timeout", "$state",'PluginNomenclatura','Nomenclaturax', 'root',
    function ($scope, $stateParams, $timeout, $state, PluginNomenclatura, Nomenclaturax, root) 
    {
    	$scope.mensajeRespuesta = null;

        $scope.consultarCertificadoPorCodigoInterno = function(){
            if($scope.codigoInterno == ''){
                $scope.codigoInternoError = true;
                return;
            }
            $scope.mensajeRespuesta = null;
            //Si son números es un 

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.codigoInternoData = {};
            $scope.codigoInternoError = false;
            Nomenclaturax
            .getDataConsultaCertificadoInterno($scope.codigoInterno)
            .then(function(data){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                $scope.codigoInternoData = data;
                //$scope.codigoInternoData.direccionesHtml = data.direcciones.replace(/[;]/g, '<br>');
                $scope.codigoInternoData.direccionesArray = data.direcciones.split(';');
                $scope.mensajeRespuesta = {
                	type: "info",
                	msg: "El documento con código "+$scope.codigoInterno+" ha sido encontrado y su información se presenta acontinuación."
                };
            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                $scope.mensajeRespuesta = {
                	type: "error",
                	msg: "El documento con código "+$scope.codigoInterno+" no existe."
                };
                alert(error.msg);
            });
        };
        
		if($stateParams.code != ""){
			$scope.codigoInterno = $stateParams.code;
			$scope.consultarCertificadoPorCodigoInterno();
		}
    }
]);
