saul.controller('clienteController',
	['$scope', '$uibModalInstance', 'Cliente', 'AccionVentana', 'CrearSolicitante', 'ActualizarSolicitante','ListarTiposDocIdentificacion',
	 function($scope, $modalInstance, Cliente, AccionVentana, CrearSolicitante, ActualizarSolicitante,ListarTiposDocIdentificacion){

	$scope.init = function(){
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();
		$scope.tiposIdentificacion = [];

		ListarTiposDocIdentificacion.query({}).$promise.then(
			function(response){
				for (var i = response.length - 1; i >= 0; i--) {
					$scope.tiposIdentificacion.push(response[i]);
				}

				$scope.cliente = angular.copy(Cliente);

				$scope.messageErrorCliente = '';
				$scope.errors = [];

				switch(AccionVentana.type){
					case 'create':
						$scope.servicio = CrearSolicitante;
						AccionVentana.value = 'created';
					break;
					case 'update':
						$scope.servicio = ActualizarSolicitante;
						AccionVentana.value = 'updated';
					break;
				}

				$scope.action = AccionVentana.type;
				$(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
			},
			function(error){}
		);
	};


 
	$scope.guardar = function (param){
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();
		$scope.servicio.query($scope.cliente).$promise.then(
			function(response){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear", function(){
					if(response.success){
						Cliente = $scope.cliente;
						$modalInstance.dismiss('cancel');
					}else{
						AccionVentana.value = 'error';
						$scope.messageErrorCliente = response.msg;
						$scope.errors = response.data;
					}	
                });
			},
			function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
				AccionVentana.value = 'error';
				$scope.messageErrorCliente = "Oops!! tenemos inconvenientes para almacenar, por favor intente nuevamente.";
			}
		);
	};

	$scope.haveError = function(value, formCliente){
		return 	formCliente[value] && formCliente[value].$touched && 
				(
					formCliente[value].$error.required==true || 
					formCliente[value].$error.email==true || 
					formCliente[value].$error.tel==true || 
					formCliente[value].$error.minlength==true || 
					formCliente[value].$error.maxlength==true || 
					formCliente[value].$error.min==true || 
					formCliente[value].$error.max==true || 
					formCliente[value].$error.pattern==true
				);
		//return (value in $scope.errors);
	}
 
    $scope.cancelar = function (){
    	AccionVentana.value = 'canceled';
    	$modalInstance.dismiss('cancel');
    };

    $scope.init();

}]);
