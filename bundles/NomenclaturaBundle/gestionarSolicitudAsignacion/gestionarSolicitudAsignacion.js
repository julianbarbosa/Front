saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('gestionar-asignacion',{
		url: '/solicitudasignomen/gestionar/{IdSolicitud:int}',
		views:{
			main:{
				controller: 'GestionarAsignacionNomenclaturaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/gestionarSolicitudAsignacion/gestionarSolicitudAsignacion.tpl.html'
			}
		}
	});
}])
.controller('GestionarAsignacionNomenclaturaCtrl', 
	['$scope', '$stateParams', '$uibModal', '$filter','$state','ConsultarSolicitante', 'MostrarSolicitudAsigNomenclatura', '$resource', 'root', 'ActualizarSolicitudAsigNomenclatura','UtilForm', 'PluginNomenclatura',
	function($scope, $stateParams, $modal, $filter,$state,ClientFactory, MostrarSolicitudAsigNomenclatura, $resource, root,ActualizarSolicitudAsigNomenclatura, UtilForm, PluginNomenclatura
		){

		// (Lat:\s|Long:\s)([\+|-]?[0-9]{1,3}\.[0-9]+) 
		// Ver coordenadasWGS84Long: -76.5044Lat: 3.4661MAGNA-SIRGAS CaliEste:
		$scope.solicitud = {};
		$scope.solicitudEditada = {};
		$scope.validacion = {
			direcciones: []
		};
		$scope.cliente = {};
		$scope.modo = 'consulta';
		$scope.accionVentana = {};

		$scope.curadurias = ['','Curaduría 1', 'Curaduría 2', 'Curaduría 3', 'Planeación'];

		$scope.editarSolicitud = function(){
			$scope.solicitudEditada = angular.copy($scope.solicitud);
			if($scope.solicitudEditada.fechaLineaDemarcacion){
				$scope.solicitudEditada.fechaLineaDemarcacion = $filter('date')($scope.solicitudEditada.fechaLineaDemarcacion.timestamp*1000, 'yyyy-MM-dd');
			}else{
				$scope.solicitudEditada.fechaLineaDemarcacion = '';
			}
			
			$scope.modo = 'edicion';
		};
		$scope.cancelarSolicitud = function(){
			$scope.solicitudEditada = {};
			$scope.modo = 'consulta';
		};

		$scope.lanzarDialogoDireccion = function(){
			PluginNomenclatura.obtenerModalIngresoDireccion($scope, function(data){
				console.warn( data );
				if(data.cambio){
					$scope.validacion.direcciones.push({
						npn: data.npn,
						direccion: data.direccion,
						direccionVisual: data.direccionVisual,
						infoAdicional: data.infoAdicional,
						idpredio: data.predioId,
						idnomenclatura: data.nomenclaturaId
					});
				}
			});
		};

		$scope.lanzarDialogoDireccionEdicion = function(){
			PluginNomenclatura.obtenerModalIngresoDireccion($scope, function(data){
				if(data.cambio){
					$scope.solicitudEditada.direccion = data.direccion;
					$scope.solicitudEditada.direccionVisual = data.direccionVisual;
					$scope.solicitudEditada.infoAdicional = data.infoAdicional;
					$scope.solicitudEditada.npn = data.npn;
					$scope.solicitudEditada.idpredio = data.predioId;
					$scope.solicitudEditada.idnomenclatura = data.nomenclaturaId;
				}
			});
		};



		$scope.buscarCliente = function(idCliente){
			ClientFactory.query({
				id: idCliente
			}).$promise.then(
				function(response){
					if(response.success){
						$scope.cliente = response.data;
					}
				},
				function(error){
					$scope.cliente = {};
					$scope.messageErrorCliente = "Ha ocurrido un error, por favor vuelva a intentarlo.";
					console.error(error);
				}
			);
		};

		$scope.cargarSolicitud = function(){
			$scope.documentos = [];
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.listarArchivosGuardados($stateParams.IdSolicitud);
			MostrarSolicitudAsigNomenclatura.get({
				idsolicitud: $stateParams.IdSolicitud
			}).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
	                if(response.success){
		                if(response.data.solicitud.estado.codigo != 'pendiente'){
		                	alert("La solicitud está en estado "+response.data.solicitud.estado.nombre);
		                	$state.go('listar-solicitudes-asignacion', {tipoUsuario: 'funcionario'});
		                }else{
		                	$scope.setSolicitud(response.data);
		                	response.data.direccionesAsignadas = angular.fromJson(response.data.direccionesAsignadas);
		                	console.warn(response.data.direccionesAsignadas);
		                	for(var i in response.data.direccionesAsignadas){
		                		$scope.validacion.direcciones.push(response.data.direccionesAsignadas[i]);
		                	}
		                }
		            }else{
		            	alert(response.msg);
		            	$state.go('listar-solicitudes-asignacion', {tipoUsuario: 'funcionario'});
		            }
				}, function(error){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
				}
			);
		};

		$scope.setSolicitud = function(nuevaSolicitud){
					$scope.solicitud = nuevaSolicitud;
					$scope.cliente = $scope.solicitud.solicitud.solicitante;
		};

		//Guarda la solicitud al editarla
		$scope.guardarSolicitud = function(){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
			ActualizarSolicitudAsigNomenclatura.query(
					{
						npn: $scope.solicitudEditada.npn,
						curaduria: $scope.solicitudEditada.curaduria,
						cantidad: $scope.solicitudEditada.cantidad,
						radicadocuraduria: $scope.solicitudEditada.radicadoCuraduria,
						direccion: $scope.solicitudEditada.direccionVisual,
						numerolineademarcacion: $scope.solicitudEditada.numeroLineaDemarcacion,
						fechalineademarcacion: $scope.solicitudEditada.fechaLineaDemarcacion,
						tipolinea: $scope.solicitudEditada.tipoLinea,
						idsolicitud: $stateParams.IdSolicitud
					}
				).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
					if(response.success){
						$scope.setSolicitud(response.data);
						$scope.cancelarSolicitud();
					}else{
						alert('Ha ocurrido un error.'+response.msg);
					}
				},
				function(error){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
					$scope.messageErrorCliente = "Ooops, Ha ocurrido un error!!!, por favor vuelva a intentarlo.";
					switch(error.status){
						case 500:
							alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
						break;
						case 404:
							alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
						break;
					}
				}
			);
		};



		//Interpretando las coordenadas que se pegan del IDESC
		const regex = /(Long:\s|Lat:\s)([\+|-]?[0-9]{1,3}\.[0-9]+)/mg;

		$scope.interpretarCoordenadas = function(){
			var m;
			var obtenido = [];
			var str = $scope.validacion.coordenada;
			while ((m = regex.exec(str)) !== null) {
			    // This is necessary to avoid infinite loops with zero-width matches
			    if (m.index === regex.lastIndex) {
			        regex.lastIndex++;
			    }
			    
			    // The result can be accessed through the `m`-variable.
			    m.forEach(function(match, groupIndex) {
			        //console.log(`Found match, group ${groupIndex}: ${match}`);
					if(groupIndex==2 && typeof match != 'undefined'){
						obtenido.push(match);
					}
			    });
			}

			if(obtenido.length >= 2){
				$scope.validacion.x = obtenido[1];
				$scope.validacion.y = obtenido[0];
			}else{
				$scope.validacion.x = 0;
				$scope.validacion.y = 0;
			}
		};


		

		//Gestionando las nuevas direcciones
		$scope.eliminarDireccion = function(index){
			$scope.validacion.direcciones.splice(index, 1);
		};

		$scope.openModal = function (direccion, fnCallback) {
			$scope.accionVentana.value = '';
		    var modalInstance = $modal.open({
			    templateUrl: '../bundles/NomenclaturaBundle/gestionarSolicitudAsignacion/direccionForm.tpl.html',
			    controller: 'direccionController',
			    size: 'md',
			    resolve: {
			        Direccion: function(){
			        	return direccion;
			        },
			        AccionVentana: function(){
			        	return $scope.accionVentana;
			        }
			    }
		    }).closed.then(function(){
		    	if($scope.accionVentana.value == 'created'){
		    		console.warn('Callback ejecutado');
		    		fnCallback();
		    	}
		    });
		};

		$scope.previsualizar = function(){
			UtilForm.openWith(
				root+"asignomenclatura/previsualizar/"+$scope.solicitud.idSolicitud,
				'post',
				[
					{
						name: 'data',
						value: angular.toJson($scope.validacion)
					}
				]
			);
		};

		$scope.finalizarValidacion =function(){

			if(!$scope.validacion.x){
				alert("Las coordenadas son obligatorias.");
				return;
			}

			if($scope.validacion.direcciones.length != $scope.solicitud.cantidad ){
				if(!confirm("El número de asignaciones realizadas no coincide con el número solicitado."+
					"¿Aún así desea ejecutar la acción?"+" \n")){
					return;
				}
			}
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

			$resource(root+"asignomenclatura/finalizar", {}, {
	            query: {
	                method: 'POST', 
	                isArray: false, 
	                transformResponse: function(json, headerGetter){
	                	try{
	                		return angular.fromJson(json);
	                	}catch(e){
	                		return {
	                			success:false, 
	                			msg:"Respuesta inesperada del servidor: "+json,
	                			data:[]
	                		};
	                	}
	                }
	            }
	        }).query(
		        {
		        	data: angular.toJson($scope.validacion),
		        	idsolicitud: $scope.solicitud.idSolicitud
		        }
	        ).$promise.then(function(response){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
	        	if(response.success){
	        		alert(response.msg);
	        		window.open(response.data.urlConsulta);
	        		$state.go('listar-solicitudes-asignacion', {tipoUsuario: 'funcionario'});
	        	}else{
	        		alert(response.msg);
	        	}
	        	console.warn(response);
	        }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                if(error.data){
                	if(error.data.success){
                		alert('Petición exitosa pero con error del servidor ('+error.statusText+'). '+error.data.msg);
                	}else{
                		alert('Lo sentimos, ha ocurrido un error('+error.statusText+'). '+error.data.msg);
                	}
                }else{
                	alert('Lo sentimos, ha ocurrido un error ('+error.status+':'+error.statusText+'), intente de nuevo o consulte al administrador.');
                }
	        });
		};


		$scope.guardarValidacion =function(){
			if($scope.validacion.direcciones.length == 0){
				alert("El número de direcciones asignadas debe ser 1 o más."+$scope.validacion.direcciones.length);
				return;
			}
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

			$resource(root+"asignomenclatura/guardar_gestion/"+$scope.solicitud.idSolicitud, {}, {
	            query: {
	                method: 'POST', 
	                isArray: false, 
	                transformResponse: function(json, headerGetter){
	                	try{
	                		return angular.fromJson(json);
	                	}catch(e){
	                		return {
	                			success:false, 
	                			msg:"Respuesta inesperada del servidor: "+json,
	                			data:[]
	                		};
	                	}
	                }
	            }
	        }).query(
		        {
		        	data: angular.toJson($scope.validacion),
		        	idsolicitud: $scope.solicitud.idSolicitud
		        }
	        ).$promise.then(function(response){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
	        	if(response.success){
	        		alert(response.msg);
	        	}else{
	        		alert(response.msg);
	        	}
	        	console.warn(response);
	        }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                if(error.data){
                	if(error.data.success){
                		alert('Petición exitosa pero con error del servidor ('+error.statusText+'). '+error.data.msg);
                	}else{
                		alert('Lo sentimos, ha ocurrido un error('+error.statusText+'). '+error.data.msg);
                	}
                }else{
                	alert('Lo sentimos, ha ocurrido un error ('+error.status+':'+error.statusText+'), intente de nuevo o consulte al administrador.');
                }
	        });
		};
		$scope.cancelarValidacion =function(){
			console.warn('Cancelando...', $scope.validacion);
		};


		$scope.listarArchivosGuardados = function(idSolicitud){
			$scope.documentos = null;
			$resource(root+"solicitudxdocumento", {}, {
	            query: {
	                method: 'GET', 
	                isArray: true, 
	                transformResponse: function(json, headerGetter){
	                	try{
	                		return angular.fromJson(json);
	                	}catch(e){
	                		return {
	                			success:false, 
	                			msg:"Respuesta inesperada del servidor: "+json,
	                			data:[]
	                		};
	                	}
	                }
	            }
	        }).query({
	        	idsolicitud: idSolicitud
	        }).$promise.then(function(response){
	        	$scope.documentos = response;
	        	for(var i in $scope.documentos){
	        		$scope.documentos[i].url = root+'asignomenclatura/descargardoc?nombre='+$scope.documentos[i].archivo;
	        	}
	        }, function(error){
                if(error.data){
                	if(error.data.success){
                		alert('Petición exitosa pero con error del servidor ('+error.statusText+'). '+error.data.msg);
                	}else{
                		alert('Lo sentimos, ha ocurrido un error('+error.statusText+'). '+error.data.msg);
                	}
                }else{
                	alert('Lo sentimos, ha ocurrido un error ('+error.status+':'+error.statusText+'), intente de nuevo o consulte al administrador.');
                }
	        });
		};

		$scope.cargarSolicitud();
	}]
);
