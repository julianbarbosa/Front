saul.controller('integracionCambiarEstadoController',
	['$scope', '$uibModalInstance','Opciones',
	 function($scope, $modalInstance, Opciones){

	$scope.opciones = Opciones;

	$scope.guardar = function (){
		/*IntegradorCatastro.actualizar($scope.opciones.registro.id, $scope.opciones.registro.id_estado).then(function(response){

		});*/
		$modalInstance.close({
			id: $scope.opciones.registro.id,
			idEstado: $scope.opciones.registro.id_estado
		});
	};
 
    $scope.cancelar = function (){
    	$modalInstance.dismiss('cancel');
    };

	}
]);
