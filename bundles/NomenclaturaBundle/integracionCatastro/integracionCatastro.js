saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('integracion-catastro',{
		url: '/nomenclatura/catastro/integracion',
		views:{
			main:{
				controller: 'IntegracionCatastroCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/integracionCatastro/integracionCatastro.tpl.html'
			}
		}
	});
}])
.controller('IntegracionCatastroCtrl', 
	['$scope','$uibModal', 'IntegradorCatastro', 'LoadingOverlap',
	function($scope, $modal, IntegradorCatastro, LoadingOverlap){
		/**
		 * Contiene los registros 
		 */
		$scope.data = [];
		$scope.estados = [];
		$scope.campos = [];
		$scope.consulta = {
			limit: '10',
			page: 1,
			total: 0,
			filtro: {
				campo: "",
				operador: "",
				parametro: ""
			}
		};

		$scope.idsSeleccionados = [];
		$scope.estadoSeleccionado = null;
		$scope.checkedAll = false;
		$scope.dt = null;
		$scope.dateOptions = {
			dateDisabled: false,
			formatYear: 'yy',
			minDate: new Date(2018, 1, 1),
			maxDate: new Date(),
			startingDay: 1
		};

		$scope.today = function() {
			$scope.dt = new Date();
		};

		$scope.clear = function() {
			$scope.dt = null;
		};
		$scope.open = function() {
			$scope.opened = true;
		};

		$scope.$watch('dt', function(newValue, oldValue){
			console.warn(newValue);
			console.warn(oldValue);
			if(newValue){
				var month = '' + (newValue.getMonth() + 1),
				    day = '' + newValue.getDate(),
				    year = newValue.getFullYear();

				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				$scope.consulta.filtro.parametro =[year, month, day].join('-');
			}
		}, true);

		$scope.seleccionar = function(id){
			var index = $scope.idsSeleccionados.indexOf(id);
			if( index > -1 ){
				$scope.idsSeleccionados.splice(index, 1);
			}else{
				$scope.idsSeleccionados.push(id);
			}
		}

		$scope.seleccionarTodos = function(checked){
			$scope.idsSeleccionados = [];
			if(checked){
				for(var i in $scope.data){
					$scope.idsSeleccionados.push($scope.data[i].id);
				}
			}
		}

		/**
		 * Consulta la lista de estados
		 */
		$scope.listarEstados = function(){
			LoadingOverlap.show($scope, function(dataCallback){
				IntegradorCatastro.listarEstados().then(function(result){
					$scope.estados = result.data;
					LoadingOverlap.hide($scope, function(){
						$scope.buscar();
					});
				});
			});
		};

		$scope.filtrar = function(){
			$scope.consulta.page = 1;
			$scope.buscar();
		}

		$scope.cambiarLimit = function($keyCode){
			if($keyCode == 13){
				$scope.buscar();
			}
		}

		$scope.buscar = function(){
			$scope.checkedAll = false;
			$scope.seleccionarTodos(false);

			LoadingOverlap.show($scope, function(dataCallback){
				IntegradorCatastro.buscar($scope.consulta.limit, $scope.consulta.page, $scope.consulta.filtro.campo, $scope.consulta.filtro.operador, $scope.consulta.filtro.parametro)
				.then(function(result){
					$scope.data = result.data;
					for(var i in $scope.data){
						$scope.data[i].fecha = new Date($scope.data[i].fecha);
					}
					$scope.consulta.total = result.totalItems;
					LoadingOverlap.hide($scope);
				}, function(){
					alert('Ha ocurrido un error buscando los registros. Intente nuevamente.');
					LoadingOverlap.hide($scope);
				});
			});
		}

		$scope.actualizarTodos = function(idEstado){
			LoadingOverlap.show($scope, function(dataCallback){
		    	IntegradorCatastro.actualizarTodos($scope.estadoSeleccionado ).then(function(response){
		    		console.warn(response);
		    		if(response.success){
		    			LoadingOverlap.hide($scope, function(){
		    				alert('Actualización exitosa.');
		    				$scope.buscar();
		    			});
		    		}else{
		    			LoadingOverlap.hide($scope, function(){
		    				alert('Ocurrieron errores en la actualización.');
		    			});
		    		}
		    	}, function(){
					alert('Ha ocurrido un error actualizando registros. Intente nuevamente.');
					LoadingOverlap.hide($scope);
		    	});
			});
			
		}

		$scope.actualizarSeleccionados = function(idEstado){
			LoadingOverlap.show($scope, function(dataCallback){
		    	IntegradorCatastro.actualizarSeleccionados($scope.estadoSeleccionado, $scope.idsSeleccionados).then(function(response){
		    		console.warn(response);
		    		if(response.success){
		    			LoadingOverlap.hide($scope, function(){
		    				alert('Actualización exitosa.');
		    				$scope.buscar();
		    			});
		    		}else{
		    			LoadingOverlap.hide($scope, function(){
		    				alert('Ocurrieron errores en la actualización.');
		    			});
		    		}
		    	}, function(){
					alert('Ha ocurrido un error actualizando registros. Intente nuevamente.');
					LoadingOverlap.hide($scope);
		    	});
			});
		}

		$scope.abrirModalCambiarEstado = function(row){

			var Opciones = {
				estados: $scope.estados,
				registro: row
			};

		    var modalInstance = $modal.open({
			    templateUrl: '../bundles/NomenclaturaBundle/integracionCatastro/integracionCambiarEstado.tpl.html',
			    controller: 'integracionCambiarEstadoController',
			    size: 'md',
			    resolve: {
			        Opciones: function(){
			        	return Opciones;
			        }
			    }
		    }).result.then(function( rta ){
				LoadingOverlap.show($scope, function(dataCallback){
			    	IntegradorCatastro.actualizar(rta.id, rta.idEstado).then(function(response){
			    		console.warn(response);
			    		if(response.success){
			    			LoadingOverlap.hide($scope, function(){
			    				alert('Actualización exitosa.');
			    				$scope.buscar();
			    			});
			    		}else{
			    			LoadingOverlap.hide($scope, function(){
			    				alert('No se ha podido realizar la actualización.');
			    			});
			    		}
			    	}, function(){
						alert('Ha ocurrido un error actualizando registros. Intente nuevamente.');
						LoadingOverlap.hide($scope);
			    	});
				});
		    });
		}

		$scope.listarEstados();
		
	}]
);
