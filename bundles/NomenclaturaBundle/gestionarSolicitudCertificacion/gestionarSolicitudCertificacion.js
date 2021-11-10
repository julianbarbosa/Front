saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('gestionar-certificacion-nomenclatura',{
		url: '/solicitud_certifnomen/gestionar/{IdSolicitud:int}',
		views:{
			main:{
				controller: 'GestionarCertificacionNomenclaturaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/gestionarSolicitudCertificacion/gestionarSolicitudCertificacion.tpl.html'
			}
		}
	});
}])
.controller('GestionarCertificacionNomenclaturaCtrl', 
	['$scope', '$stateParams', '$uibModal', '$filter','$state','$q','ConsultarSolicitante', 'MostrarSolicitudCertifNomenclatura', '$resource', 'root', 'ActualizarSolicitudCertifNomenclatura', 'urlPlugInNomenclatura','UtilForm','CausasNegacionNomenclatura', 'Nomenclaturax', 'PluginNomenclatura', 'root', 'LoadingOverlap',
	function($scope, $stateParams, $modal, $filter,$state,$q,ClientFactory, MostrarSolicitudCertifNomenclatura, $resource, root,ActualizarSolicitudCertifNomenclatura, urlPlugInNomenclatura, UtilForm, CausasNegacionNomenclatura, Nomenclaturax, PluginNomenclatura, root, LoadingOverlap
		){


		function getDefaultComment(){
			return 'Para efectos de trámites y/o revisión, se informa que la antigua dirección del predio era '+$scope.solicitud.direccion+($scope.solicitud.informacionAdicional?' '+$scope.solicitud.informacionAdicional:'')+'.';
		};


		$scope.causalNegacionSeleccionada = {};

		// (Lat:\s|Long:\s)([\+|-]?[0-9]{1,3}\.[0-9]+) 
		// Ver coordenadasWGS84Long: -76.5044Lat: 3.4661MAGNA-SIRGAS CaliEste:
		$scope.solicitud = {};
		$scope.solicitudEditada = {};
		$scope.validacion = {
			direcciones: [],
			causaNegacion: ''
		};
		$scope.cliente = {};
		$scope.modo = 'consulta';
		$scope.accionVentana = {};

		/**
		 * Datos temporales de la GUI
		 * @type {Object}
		 */
		$scope.dataGui = {
			existenCambios: false,
			verTodasNomenclaturas: false //Indica si se deben visualizar todas nomenclaturas del predio de gestión o sólo las certificadas
		};

		$scope.finalizada = false;

		/**
		 * Es el modelo del id que se ha seleccionado como principal.
		 * @type {Object}
		 */
		$scope.principal = {
			id: -1
		};

		/**
		 * Filtro de nomenclaturas del predio de gestión. Muestra las nomenclaturas certificadas o todas
		 * dependiendo de la variable $scope.dataGui.verTodasNomenclatura. Si la variable está en TRUE las
		 * muestra todas, de lo contrario sólo muestra las certificadas.
		 * @param  {Object} nomenclatura Nomenclatura pasada por el NgRepeat
		 * @return {boolean}             True en caso de que la nomenclatura debe mostrarse, false en caso contrario.
		 */
		$scope.filterNomenclaturas = function( nomenclatura ){
			if( $scope.dataGui.verTodasNomenclatura ){
				return true;
			}
			return nomenclatura.estado.codigo == 'certificada';
		}

		/**
		 * [toogleVerTodas description]
		 * @return {[type]} [description]
		 */
		$scope.toogleVerTodas = function(){
			$scope.dataGui.verTodasNomenclatura = !$scope.dataGui.verTodasNomenclatura;
		}

		$scope.goToMisTareas = function(){
			$state.go('solicitud-listar-tareas');
		};

		$scope.editarSolicitud = function(){
			$scope.solicitudEditada = angular.copy($scope.solicitud);
			$scope.modo = 'edicion';
		};
		$scope.cancelarSolicitud = function(){
			$scope.solicitudEditada = {};
			$scope.modo = 'consulta';
		};

		/**
		 * Abre el plugin de nomenclatura cuando se va a adicionar una nomenclatura
		 * @return void
		 */
		$scope.lanzarDialogoDireccion = function(){

        	PluginNomenclatura.obtenerModalIngresoDireccion($scope, function(data){
        		if(data.cambio){
        			$scope.dataGui.existenCambios = true;
					pushDireccion(data);
	            }
        	}, function(error){
        		alert(error);
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
        	}, function(error){
        		alert(error);
        	});
		};

		//Lanzamos el modal de edición de nomenclatura
		$scope.lanzarEdicionNomenclatura = function(idNomenclatura){
	    	//Obtenemos el índice en el arreglo
	    	var $index = $scope.indexOfNomenclatureWithId(idNomenclatura);
			console.warn( $scope.nomenclaturasConsultado[$index] );
			var opciones = {
        		accion: 'editar',
        		cargar: true,
        		nomenclatura: $scope.nomenclaturasConsultado[$index],
        		respuesta: '-'
        	};
		    var modalInstance = $modal.open({
			    templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturaIndividual/nomenclaturaForm.tpl.html',
			    controller: 'nomenclaturaFormController',
			    size: 'md',
			    resolve: {
			        Opciones: function(){
			        	return opciones;
			        }
			    }
		    }).closed.then(function(){
		    	if(opciones.respuesta.type == 'success'){
		    		$scope.setNpnGestion($scope.validacion.npnGestion);
		    	}
		    });
		}

		var pushDireccion  = function(direccionNueva, mostrarAlertas){
			mostrarAlertas = (typeof mostrarAlertas == 'undefined')?true:mostrarAlertas;
			for(var i in $scope.validacion.direcciones){
				if(isEquivalent($scope.validacion.direcciones[i], direccionNueva)){
					if(mostrarAlertas){
						$scope.alerts.push({ type: 'danger', msg: 'No es posible adicionar la dirección '+direccionNueva.direccion+(direccionNueva.infoAdicional?' '+direccionNueva.infoAdicional:'')+' porque ya se encuentra en la lista.' });
					}
					return;
				}
			}
			$scope.dataGui.existenCambios = true;
			$scope.validacion.direcciones.push(direccionNueva);
			if(mostrarAlertas){
				$scope.alerts.push({ type: 'success', msg: 'Dirección '+direccionNueva.direccion+(direccionNueva.infoAdicional?' '+direccionNueva.infoAdicional:'')+' adicionada correctamente.' });
			}
		}  

		$scope.alerts = [];

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		var isEquivalent = function(a, b) {
			var aProps = ['direccion', 'infoAdicional', 'npn']; 

			for (var i = 0; i < aProps.length; i++) {
				var propName = aProps[i];

				if (a[propName] !== b[propName]) {
					return false;
				}
			}

			return true;
		}

		$scope.toEditandoPredioGestion = function(val){
			$scope.editandoPredioGestion = val;
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

		$scope.consultarHistorico = function(nomenclatura){
            nomenclatura.loading = true;
            Nomenclaturax.
            getHistorico(nomenclatura.idnomenclatura).
            then(function(data){
                nomenclatura.loading = false;
                nomenclatura.historico = data;
            }, function(codigo, msg){
                nomenclatura.loading = false;
                alert('Error: '+msg);
            });
        };

		$scope.cargarSolicitud = function(){
			$scope.documentos = [];
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.listarArchivosGuardados($stateParams.IdSolicitud);
			MostrarSolicitudCertifNomenclatura.get({
				idsolicitud: $stateParams.IdSolicitud
			}).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear", function(){
		                if(response.success){
		                	if(response.data == null){
		                		$state.go('gestionar-peticion-nomenclatura', {idsolicitud: $stateParams.IdSolicitud});
		                	}else{
				                if(response.data.solicitud.estado.codigo != 'pendiente'){
				                	alert("La solicitud está en estado "+response.data.solicitud.estado.nombre);
				                	$state.go('solicitud-listar-tareas');
				                }else{
									$scope.setSolicitud(response.data);
									response.data.direccionesAsignadas = angular.fromJson(response.data.direccionesAsignadas);
									for(var i in response.data.direccionesAsignadas){
										pushDireccion(response.data.direccionesAsignadas[i], false);
										//$scope.validacion.direcciones.push(response.data.direccionesAsignadas[i]);
									}
				                }
		                	}
			            }else{
			            	alert(response.msg);
			            	$state.go('solicitud-listar-tareas');
			            }
	                });
				}, function(error){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear", function(){
	                	console.warn(error);
	                	alert('Ha ocurrido un error, por favor vuelva a intentarlo.');
	                });
				}
			);
		};

		$scope.cambiarNpnGestion = function(npnGestion){
			$scope.setNpnGestion(npnGestion);
			$scope.dataGui.existenCambios = true;
		};

		$scope.setNpnGestion = function(npnGestion){

			$scope.cargandoPredioGestion = true;
			$scope.toEditandoPredioGestion(false);//TODO <?????
			$scope.validacion.npnGestion = npnGestion;
			Nomenclaturax.
			getInfoPorNpn( npnGestion ).
			then(function(data){
				$scope.predioConsultado = data.predio;
				$scope.nomenclaturasConsultado = data.nomenclaturas;
				$scope.actualizarPrincipalId();
				$scope.permisoVerHistoricoConsultado = data.verHistorico;
				$scope.cargandoPredioGestion = false;
			}, function(data){
				$scope.predioConsultado = null;
				$scope.msgPredioConsultado = 'Predio no encontrado.';
				$scope.cargandoPredioGestion = false;
				alert(data.msg);
			});
		};

		$scope.setSolicitud = function(nuevaSolicitud){
					$scope.solicitud = nuevaSolicitud;
					$scope.validacion.anular = nuevaSolicitud.anular;
					$scope.validacion.comentario = nuevaSolicitud.comentario?nuevaSolicitud.comentario:getDefaultComment();
					$scope.cliente = $scope.solicitud.solicitud.solicitante;
					$scope.setNpnGestion(nuevaSolicitud.npnGestion);
					console.warn('Seteamos la validación', $scope.validacion);
		};

		//Guarda la solicitud al editarla
		$scope.guardarSolicitud = function(){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
			ActualizarSolicitudCertifNomenclatura.query(
					{
						npn: $scope.solicitudEditada.npn,
						direccion: $scope.solicitudEditada.direccion,
						idsolicitud: $stateParams.IdSolicitud,
						comentario: $scope.solicitudEditada.comentario,
						npl: $scope.solicitudEditada.npl,
						idpredio: $scope.solicitudEditada.idpredio,
						idnomenclatura: $scope.solicitudEditada.idnomenclatura
					}
				).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
					if(response.success){
						$scope.setSolicitud(response.data);
						$scope.cancelarSolicitud();
						console.warn($scope.solicitud);
						console.warn($scope.solicitudEditada);
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

		//Gestionando las nuevas direcciones
		$scope.eliminarDireccion = function(index){
			$scope.dataGui.existenCambios = true;
			$scope.validacion.direcciones.splice(index, 1);
		};

		$scope.previsualizar = function(){
			UtilForm.openWith(
				//root+"certificado_nomenclatura/previsualizar/"+$scope.solicitud.idSolicitud,
				root+"certificado_nomenclatura/previsualizar/"+$scope.solicitud.idSolicitud,
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

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            for(var i in $scope.validacion.direcciones){
            	delete $scope.validacion.direcciones[i].historico;
            	delete $scope.validacion.direcciones[i].loading;
            }

			$resource(root+"certificado_nomenclatura/finalizar", {}, {
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
	        		$scope.finalizada = response.data;
	        		//$state.go('solicitud-listar-tareas');
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

		$scope.limpiarObservaciones = function(){
			if($scope.validacion.comentario != ''){
				$scope.validacion.comentario = '';
				$scope.dataGui.existenCambios = true;
			}
		};

		$scope.guardarValidacion =function(){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            for(var i in $scope.validacion.direcciones){
            	delete $scope.validacion.direcciones[i].historico;
            	delete $scope.validacion.direcciones[i].loading;
            }

			$resource(root+"certificado_nomenclatura/guardar_gestion/"+$scope.solicitud.idSolicitud, {}, {
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
		        	idsolicitud: $scope.solicitud.idSolicitud,
					anular: $scope.validacion.anular,
					comentario: $scope.validacion.comentario,
					direcciones: $scope.validacion.direcciones,
					npnGestion: $scope.validacion.npnGestion
		        }
	        ).$promise.then(function(response){
	        	$scope.dataGui.existenCambios = false;
	        	console.warn('Existen cambios:', $scope.dataGui.existenCambios);
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
	        		$scope.documentos[i].url = root+'certificado_nomenclatura/descargardoc?nombre='+$scope.documentos[i].archivo;
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

		var cargarPredioGestion = function () 
        {
        	$scope.setNpnGestion( $scope.validacion.npnGestion );
        };
    
	    CausasNegacionNomenclatura.query().$promise.then(function(result) {
	    	$scope.causasNegacion = result;
	    });

	    /**
	     * Devuelve el índice en el arreglo $scope.nomenclaturasConsultado al que corresponde
	     * el idNomenclatura que se pasó como parámetro.
	     * @param  {idNomenclatura Id de la nomenclatura de la que se desea obtener el índice.} idNomenclatura Id de la nomenclatura de la que se desea obtener el índice.
	     * @return {integer} Índice de la nomenclatura en el arreglo $scope.nomenclaturasConsultado. Devuelve -1 si no está.
	     */
	    $scope.indexOfNomenclatureWithId = function(idNomenclatura){
	    	for(var i in $scope.nomenclaturasConsultado ){
	    		if( $scope.nomenclaturasConsultado[i].idnomenclatura == idNomenclatura ){
	    			return i;
	    		}
	    	}
	    	return -1;
	    }


	    /**
	     * Pasa una nomenclatura certificada al listado de nomenclaturas que irán en el certificado.
	     * Sólo se pueden pasar aquellas que estén certificadas.
	     * @param  {integer} idNomenclatura Id de la nomenclatura de la que se desea obtener el índice.
	     * @return {void}
	     */
		$scope.trasladar2Certificadas = function(idNomenclatura){
	    	//Obtenemos el índice en el arreglo
	    	var $index = $scope.indexOfNomenclatureWithId(idNomenclatura);
			if( $scope.nomenclaturasConsultado[$index].estado.codigo=='certificada' ){
				pushDireccion({
					idpredio: $scope.predioConsultado.idpredio,
					idnomenclatura: $scope.nomenclaturasConsultado[$index].idnomenclatura,
					npn: $scope.predioConsultado.codigounico,
					direccion:  $scope.nomenclaturasConsultado[$index].direccion,
					infoAdicional:  $scope.nomenclaturasConsultado[$index].informacionadicional,
					direccionVisual: $scope.nomenclaturasConsultado[$index].direccionVisual,
					principal: $scope.nomenclaturasConsultado[$index].principal
				});
			}else{
				alert('Sólo pueden aparecer en el certificado nomenclaturas certificadas.');
			}
		}

	    /**
	     * Cuando se desee certificar una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
	     * @param  {integer} i Índice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
	     * @return {void}
	     */
	    $scope.certificarNomenclatura = function(idNomenclatura){
	    	//Obtenemos el índice en el arreglo
	    	var i = $scope.indexOfNomenclatureWithId(idNomenclatura);
	    	//Abrimos el overlap
	    	LoadingOverlap.show( $scope, function(){
	    		//Enviamos a certificar
		    	Nomenclaturax.certificar( $scope.nomenclaturasConsultado[i].idnomenclatura )
		    	.then( function(data){
		    		//Cerramos el Overlap
		    		LoadingOverlap.hide( $scope, function(data){
		    			$scope.nomenclaturasConsultado[i] = data;
			    		alert( 'Se ha certificado correctamente.' );
			    		cargarPredioGestion();
		    		}, data);
		    	}, function(error){
		    		//Cerramos el Overlap
		    		LoadingOverlap.hide( $scope, function(){
		    			alert( error.msg );
		    		});
		    	});

	    	});
	    };

	    /**
	     * Cuando se desee inactivar una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
	     * @param  {integer} i ïndice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
	     * @return void
	     */
	    $scope.inactivarNomenclatura = function(idNomenclatura){
	    	//Obtenemos el índice en el arreglo
	    	var i = $scope.indexOfNomenclatureWithId(idNomenclatura);
	    	if( $scope.nomenclaturasConsultado[i].principal ){
	    		alert('No se puede inactivar una nomenclatura principal.');
	    		return;
	    	}
	    	//Abrimos el overlap
	    	LoadingOverlap.show( $scope, function(){
	    		//Enviamos a certificar
		    	Nomenclaturax.inactivar( $scope.nomenclaturasConsultado[i].idnomenclatura )
		    	.then( function(data){
		    		//Cerramos el Overlap
		    		LoadingOverlap.hide( $scope, function(data){
		    			$scope.nomenclaturasConsultado.splice(i, 1);
			    		alert( 'Se ha inactivado correctamente.' );
			    		//cargarPredioGestion();
		    		}, data);
		    	}, function(error){
		    		//Cerramos el Overlap
		    		LoadingOverlap.hide( $scope, function(){
		    			alert( error.msg );
		    		});
		    	});

	    	});
	    };

	    /**
	     * Cuando se desee anular una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
	     * @param  {integer} i ïndice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
	     * @return void
	     */
	    $scope.anularNomenclatura = function(idNomenclatura){
	    	//Obtenemos el índice en el arreglo
	    	var i = $scope.indexOfNomenclatureWithId(idNomenclatura);
	    	if( $scope.nomenclaturasConsultado[i].principal ){
	    		alert('No se puede anular una nomenclatura principal.');
	    		return;
	    	}
	    	//Abrimos el overlap
	    	LoadingOverlap.show( $scope, function(){
	    		//Enviamos a certificar
		    	Nomenclaturax.anular( $scope.nomenclaturasConsultado[i].idnomenclatura )
		    	.then( function(data){
		    		//Cerramos el Overlap
		    		LoadingOverlap.hide( $scope, function(data){
		    			$scope.nomenclaturasConsultado.splice(i, 1);
			    		alert( 'Se ha anulado correctamente.' );
			    		//cargarPredioGestion();
		    		}, data);
		    	}, function(error){
		    		//Cerramos el Overlap
		    		LoadingOverlap.hide( $scope, function(){
		    			alert( error.msg );
		    		});
		    	});
	    	});
	    };

		/**
		 * Cambia a Principal una nomenclatura
		 * @param  integer idNomenclatura Id de la nomenclatura que se desea como principal. Debe pertenecer al 
		 * campo idnomenclatura del arreglo $scope.nomenclaturasConsultado
		 * @return void 
		 */
		$scope.actualizarPrincipal = function(idNomenclatura){
			
			var i = $scope.indexOfNomenclatureWithId(idNomenclatura);
			//SI ya es la principal no hago nada
			if( $scope.nomenclaturasConsultado[i].principal ){
				return;
			}
			//Si no está certificada no la cambio
			if( $scope.nomenclaturasConsultado[i].estado.codigo != 'certificada'){
				$scope.actualizarPrincipalId();
				return;
			}
			//Preguntamos si desea hacerlo
			if( confirm('¿Realmente desea cambiar la nomenclatura principal?') ){
				//Abrimos la cortina
				LoadingOverlap.show($scope, function(){
					Nomenclaturax
					.guardarPrincipal(idNomenclatura)//Función para setar como principal una nomenclatura
					.then( function(){
						//Si nos responden correctamente
						//Cerramos la cortina
						LoadingOverlap.hide($scope, function(){
							//Lanzamos el mensaje de que se realizó
							alert('Cambio realizado.');
							//Cambiamos a principal la nomenclatura que acabamos de setear como principal
							for(var i in $scope.nomenclaturasConsultado){
								$scope.nomenclaturasConsultado[i].principal = (idNomenclatura==$scope.nomenclaturasConsultado[i].idnomenclatura);
							}
							//Actualizamos el principalId
							$scope.actualizarPrincipalId();
						});
					}, function(error){
						//Cerramos la cortina
						LoadingOverlap.hide($scope, function(error){
							//Lanzamos un mensaje de error
							alert(error.msg);
							//Dejamos el principalId como estaba
							$scope.actualizarPrincipalId();
						}, error);
					});
				});
			}else{
				//Dejamos el principalId como estaba
				$scope.actualizarPrincipalId();
			}
		};

		/**
		 * Coloca como principal.id el Id de la nomenclatura que esté marcada como principal
		 * @return {void}
		 */
		$scope.actualizarPrincipalId = function(){
			var n = null;
			for(var i in $scope.nomenclaturasConsultado){
				n = $scope.nomenclaturasConsultado[i];
				if( n.principal ){
					$scope.principal.id = n.idnomenclatura;
					break;
				}
			}
		}

	    /**
	     * Cuando se desee anular una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
	     * @param  {integer} i ïndice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
	     * @return {void}
	     */
	    $scope.crearNomenclatura = function(){
			var opciones = {
        		accion: 'crear',
        		cargar: false,
        		nomenclatura: {},
        		respuesta: '-'
        	};
		    var modalInstance = $modal.open({
			    templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturaIndividual/nomenclaturaForm.tpl.html',
			    controller: 'nomenclaturaFormController',
			    size: 'md',
			    resolve: {
			        Opciones: function(){
			        	return opciones;
			        }
			    }
		    }).closed.then(function(){
		    	if(opciones.respuesta.type == 'success'){
		    		cargarPredioGestion();
		    	}
		    });
	    };

		$scope.cambioAnular = function(){
			if($scope.validacion.anular){
				$scope.validacion.comentario = '';
				$scope.validacion.causaNegacion = '';
			}else{
				$scope.validacion.comentario = getDefaultComment();
			}
			$scope.dataGui.existenCambios = true;
		}

		$scope.cambioCausaNegacion = function(){
			if( $scope.validacion.anular ){
				$scope.validacion.comentario = $scope.validacion.causaNegacion;
			}
			$scope.dataGui.existenCambios = true;
		}


		$scope.cargarSolicitud();
	}]
);
