saul.controller('direccionController', 
['$scope', '$uibModalInstance', 'Direccion', 'AccionVentana',
function($scope, $modalInstance, Direccion, AccionVentana){
	
	$scope.direccion = Direccion;

	$scope.messageErrorCliente = '';
	$scope.errors = [];
 
	$scope.guardar = function (){
		AccionVentana.value = 'created';
		$modalInstance.dismiss('cancel');
	};
 
    $scope.cancelar = function (){
    	AccionVentana.value = 'canceled';
    	$modalInstance.dismiss('cancel');
    };

    
    $scope.obtenerModalIngresoDireccion = function() {
        $.ajax({
            url: "https://planeacion.cali.gov.co/saul_dev/dapm.php/nomenclatura",
            //url: "http://localhost/saul/dapm.php/nomenclatura",
            data: {
                fieldNamecallbackFunction: "cerrarModal",
                fieldNameNPNrequerido: !1,
                activarBusqueda: !0,
                fieldNameDiv: "modalIngresoDireccion",
                fieldNameNumeroUnico: "NPN",
                fieldNameDireccion: "BusquedaDireccion",
                fieldNameDireccionVisual: "FormDireccionesDireccion",
                fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
            },
            success: function(a) {
                $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
            }
        })
    };

    
}]);
