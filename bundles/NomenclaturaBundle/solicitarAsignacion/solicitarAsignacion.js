saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('editar-asignacion',{
		url: '/nomenclatura/solicitar_asignacion/{tipoUsuario}/{IdSolicitud:int}',
		views:{
			main:{
				controller: 'SolicitarAsignacionNomenclaturaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/solicitarAsignacion/solicitarAsignacion.tpl.html'
			}
		}
	});
}])
.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('solicitar-asignacion',{
		url: '/nomenclatura/solicitar_asignacion/{tipoUsuario}',
		views:{
			main:{
				controller: 'SolicitarAsignacionNomenclaturaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/solicitarAsignacion/solicitarAsignacion.tpl.html'
			}
		}
	});
}])
.controller('SolicitarAsignacionNomenclaturaCtrl', 
	['$scope', '$resource','$state', '$stateParams','$filter','$uibModal', 'MostrarSolicitudAsigNomenclatura', 'ConsultarSolicitante', 'CrearSolicitudAsigNomenclatura', 'Comuna','root', 'rootSaul1', 'urlPlugInNomenclatura','ActualizarSolicitudAsigNomenclatura','ConfirmarDatosAsigNomenclatura',"Upload",
	function($scope, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudAsigNomenclatura, ConsultarSolicitante, CrearSolicitudAsigNomenclatura,ComunaFactory, root, rootSaul1, urlPlugInNomenclatura, ActualizarSolicitudAsigNomenclatura, ConfirmarDatosAsigNomenclatura, Upload){

		$scope.alerts = [];
        $scope.inputFiles = {
        	licencia: {},
        	planos: {}
        };

		$scope.start = function(){
			$scope.init($stateParams.IdSolicitud);
		};

		//Inicializando la aplicación
		$scope.init = function(idSolicitud){

	        //files
	        $scope.inputFiles.licencia = {};
	        $scope.inputFiles.planos = {};

			$scope.funcionario = $stateParams.tipoUsuario == 'funcionario';
			$scope.mostrarFormSolicitud = !$scope.funcionario;
			$scope.estado = 'creacion';
			$scope.impreso = false;
			$scope.messageErrorCliente = '';
			$scope.cliente = {
				curaduria: 1
			};
			$scope.solicitud = {
				documentos: []
			};
			$scope.AccionVentana = {};


			$scope.comunas = [];
			$scope.barrios = [];
			$scope.predioEncontrado = false;
			$scope.numeroPredial = '';

			$scope.barrio = '';
			$scope.comuna = '';

			if(typeof idSolicitud != 'undefined'){
				$scope.cargarSolicitud(idSolicitud);
				$scope.requiredLicencia = false;
				$scope.requiredPlanos = false;
			}else{
				$scope.requiredLicencia = !$scope.funcionario;
				$scope.requiredPlanos = !$scope.funcionario;
			}
		};

		$scope.cargarSolicitud = function(idSolicitud){
					
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
			MostrarSolicitudAsigNomenclatura.get({
				idsolicitud: idSolicitud
			}).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");

	                if(response.success){
		                if( !(response.data.solicitud.estado.codigo == 'pendiente' || response.data.solicitud.estado.codigo == 'preradicada') ){
		                	alert("La solicitud está en estado "+response.data.solicitud.estado.nombre);
		                	if($scope.funcionario){
		                		$state.go('listar-solicitudes-asignacion', {tipoUsuario: $stateParams.tipoUsuario});
		                	}else{
		                		window.location = rootSaul1 + 'solicitud';
		                	}
		                }else{
		                	$scope.setSolicitud(response.data);
		                	$scope.setCliente($scope.solicitud.solicitud.solicitante);
		                	switch($scope.solicitud.solicitud.estado.codigo){
		                		case 'pendiente':
		                			$scope.estado = 'visualizacion';
		                		break;
		                		case 'preradicada':
		                			$scope.estado = 'confirmacion';
		                		break;
		                		case 'emitida':
		                			$scope.estado = 'visualizacion';
		                		break;
		                	}
		                }
		            }else{
		            	alert(response.msg);
	                	if($scope.funcionario){
	                		$state.go('listar-solicitudes-asignacion', {tipoUsuario: $stateParams.tipoUsuario});
	                	}else{
	                		window.location = rootSaul1 + 'solicitud';
	                	}
		            }
				}, function(error){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
	                alert('Ha ocurrido al intentar cargar la Solicitud.('+error.status+')');
				}
			);
		};

		$scope.imprimir = function(){
			$scope.impreso = true;
			window.open(root+'asignomenclatura/solicitudpdf/'+$scope.solicitud.idSolicitud);
		};

		$scope.guardarCambios = function(){
			$scope.impreso = false;
			$scope.actualizarSolicitud();
		};

		$scope.confirmar = function($idSolicitud){
			if(!$idSolicitud){
				$idSolicitud = $scope.solicitud.idSolicitud;
			}
			//Abrimos el overlap de carga
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
			ConfirmarDatosAsigNomenclatura.query({
				idsolicitud: $idSolicitud
			}).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear", function(){
						if(response.success){
							
							//$scope.init($scope.solicitud.idSolicitud);
							
		                	if($scope.funcionario){
		                		alert('Solicitud '+$idSolicitud+' confirmada correctamente.');
		                		$state.go('solicitar-asignacion', {tipoUsuario: $stateParams.tipoUsuario});
		                	}else{
		                		alert('Solicitud '+$idSolicitud+' creada y confirmada correctamente, puede consultar su estado en "Mis solicitudes" a donde será redireccionado.');
		                		window.location = rootSaul1 + 'solicitud';
		                	}
						}else{
							alert(response.msg);
						}
	                });
				}
			);
		};

		$scope.anular = function(){
			alert('No ha sido implementada la anulación de una solicitud.');
		};

		$scope.limpiarCliente = function(){
			$scope.start();
		};

		$scope.cancelarSolicitud = function(){
			$scope.start();
		};


		$scope.guardarSolicitud = function(){
			//Abrimos el overlap de carga
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

			$scope.solicitud.idsolicitante = $scope.cliente.id;
			$scope.solicitudEnviada = angular.copy($scope.solicitud);
			$scope.solicitudEnviada.fechalineademarcacion = $filter('date')($scope.solicitud.fechalineademarcacion, 'yyyy-MM-dd HH:mm:ss');
			
			$scope.solicitudEnviada.files = [$scope.inputFiles.planos.file, $scope.inputFiles.licencia.file];

			if(typeof $scope.solicitud.npn == 'undefined'){
				alert('El campo de dirección existente está vacío.');
				return;
			}

			if(!$scope.funcionario){
				if(!$scope.inputFiles.planos.file){
					$(".overlap_espera").fadeOut(500, "linear");
					$(".overlap_espera_1").fadeOut(500, "linear");
					alert('Los planos no están adjuntos.');
					return;
				}
				if(!$scope.inputFiles.licencia.file){
					$(".overlap_espera").fadeOut(500, "linear");
					$(".overlap_espera_1").fadeOut(500, "linear");
					alert('La licencia no está adjunta.');
					return;
				}
			}

			Upload.upload({
                    url: root +'asignomenclatura/create',
                    data: $scope.solicitudEnviada,
                    transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                }).then(
	                function (resp) {
	                	response = resp.data;

		                $(".overlap_espera").fadeOut(500, "linear");
		                $(".overlap_espera_1").fadeOut(500, "linear", function(){
							if(response.success){
			                	$scope.inputFiles.licencia.reset();
			                	$scope.inputFiles.planos.reset();
								$scope.estado = 'confirmacion';
								if($scope.funcionario){
									alert('Se ha generado la solicitud '+response.data.idsolicitud+'.');
									$state.go('editar-asignacion', {tipoUsuario: $stateParams.tipoUsuario, IdSolicitud: response.data.idsolicitud});
								}else{
									$scope.confirmar(response.data.idsolicitud);
								}
								//$scope.init(response.data.idsolicitud);
							}else{
								alert('Ha ocurrido un error. '+response.msg);
							}
		                });
	                }, function (error) {
		                $(".overlap_espera").fadeOut(500, "linear");
		                $(".overlap_espera_1").fadeOut(500, "linear", function(){
							$scope.messageErrorCliente = "Ooops, Ha ocurrido un error!!!, por favor vuelva a intentarlo.";
							switch(error.status){
								case 500:
									alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
								break;
								case 404:
									alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
								break;
							}
		                });
	                }, function (evt) {
	                    $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	                }
	              );
            return;
		};

		$scope.actualizarSolicitud = function(){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            $scope.datosActualizacion = {
				npn: $scope.solicitud.npn,
				curaduria: $scope.solicitud.curaduria,
				cantidad: $scope.solicitud.cantidad,
				radicadocuraduria: $scope.solicitud.radicadocuraduria,
				direccion: $scope.solicitud.direccion,
				tipolinea: $scope.solicitud.tipolinea,
				numerolineademarcacion: $scope.solicitud.numerolineademarcacion,
				idsolicitud: $scope.solicitud.idSolicitud,
				idpredio: $scope.solicitud.idpredio,
				idnomenclatura: $scope.solicitud.idnomenclatura
			};

			if($scope.solicitud.fechalineademarcacion){
				$scope.datosActualizacion.fechalineademarcacion = $filter('date')($scope.solicitud.fechalineademarcacion, 'yyyy-MM-dd HH:mm:ss');
			}

			$scope.datosActualizacion.files = [];
			if($scope.inputFiles.licencia.file){
				$scope.datosActualizacion.files.push($scope.inputFiles.licencia.file);
			}
			if($scope.inputFiles.planos.file){
				$scope.datosActualizacion.files.push($scope.inputFiles.planos.file);
			}

			Upload.upload({
                    url: root +'asignomenclatura/'+$scope.solicitud.idSolicitud+'/edit',
                    data: $scope.datosActualizacion,
                    transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                }).then(
	                function(resp){

	                	response = resp.data;
		                $(".overlap_espera").fadeOut(500, "linear");
		                $(".overlap_espera_1").fadeOut(500, "linear");
						if(response.success){
							//$scope.urlOrfeo = response.data.urlconsulta;
		                	$scope.inputFiles.licencia.reset();
		                	$scope.inputFiles.planos.reset();

							//$scope.files.length = 0;
							$scope.setSolicitud(response.data);
							
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
					}, function (evt) {
	                    $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	                }
	              );
            return;
		};


		//Datepicker para fecha de demarcación
		$scope.popup1 = {
			opened: false
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			minDate: new Date(1940, 1, 1),
			startingDay: 1
		};

		$scope.open1 = function() {
			$scope.popup1.opened = true;
		};

		$scope.buscarCliente = function(){

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

			ConsultarSolicitante.query({
				id: $scope.cliente.numidentificacion
			}).$promise.then(
				function(response){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
					if(response.success){
						$scope.setCliente(response.data);
					}else{
						//$scope.cliente = {};
						$scope.messageErrorCliente = response.msg;
						//if(response.data.length == 0){
							$scope.openModal('md', 'create');
						//}
					}
				},
				function(error){
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
					$scope.cliente = {};
					$scope.messageErrorCliente = "Ha ocurrido un error, por favor vuelva a intentarlo.";
					console.error(error);
				}
			);
		};

		$scope.setCliente = function($cliente){
			$scope.cliente = $cliente;
			$scope.cliente.telefono = parseInt($scope.cliente.telefono);
			$scope.messageErrorCliente = '';
			$scope.mostrarFormSolicitud = true;
		};

		$scope.setSolicitud = function(nuevaSolicitud){
			$scope.solicitud = nuevaSolicitud;

			$scope.listarArchivosGuardados();

			$scope.solicitud.radicadocuraduria = nuevaSolicitud.radicadoCuraduria;
			$scope.solicitud.numerolineademarcacion = nuevaSolicitud.numeroLineaDemarcacion;
			$scope.solicitud.tipolinea = nuevaSolicitud.tipoLinea;

			if(nuevaSolicitud.fechaLineaDemarcacion){
				$scope.solicitud.fechalineademarcacion = new Date(nuevaSolicitud.fechaLineaDemarcacion.timestamp*1000);
			}

			$scope.solicitud.curaduria = (nuevaSolicitud.curaduria);
			$scope.cliente = $scope.solicitud.solicitud.solicitante;
		};

		$scope.actualizarCliente = function(){
			$scope.openModal('md', 'update');
		};


		$scope.openModal = function (size, action) {
			$scope.AccionVentana.type = action;
		    var modalInstance = $modal.open({
			    templateUrl: '../bundles/NomenclaturaBundle/solicitarAsignacion/clienteForm.tpl.html',
			    controller: 'clienteController',
			    size: size,
			    resolve: {
			        Cliente: function(){
			        	return $scope.cliente;
			        },
			        AccionVentana: function(){
			        	return $scope.AccionVentana;
			        }
			    }
		    }).closed.then(function(){
		    	if($scope.AccionVentana.value == 'created' || $scope.AccionVentana.value == 'updated'){
		    		$scope.buscarCliente();
		    	}
		    });
		};


        $scope.obtenerModalIngresoDireccion = function() {

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: 'cerrarModal',
                    fieldNameNPNrequerido: !1,
                    activarBusqueda: !0,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "npn",
                    fieldNameDireccion: "direccion",
                    fieldNameDireccionVisual: "direccionVisual",
                    fieldNameDireccionAdicional: "infoAdicional",
                    fieldNameIdPredio: "predioId",
                    fieldNameIdNomenclatura: "nomenclaturaId"
                },
                success: function(a) {
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear", function(){
	                	$("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
	                });
                },
                error: function(jqXHR, textStatus, errorThrown){
                	$(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear");
                	switch(textStatus){
                		case 'timeout':
                			alert("Se ha agotado el tiempo de respuesta del servidor. Intente nuevamente. (Error "+jqXHR.status+")");
                		break;
                		case 'error':
                			alert("Se ha generado un error en el servidor. Intente nuevamente o consulte al administrador. (Error "+jqXHR.status+")");
                		break;
                		case 'abort':
                			alert("El servidor ha abortado la conexión. Intente nuevamente. (Error "+jqXHR.status+")");
                		break;
                		case 'parsererror':
                			alert("La respuesta del servidor no ha sido correcta. Consulte al administrador. (Error "+jqXHR.status+")");
                		break;
                		default:
                			alert("Lo sentimos, ha ocurrido un error. Intente nuevamente. (Error "+jqXHR.status+")");
                		break;
                	}
                }
            });
        };
        
        cerrarModal = function(){
        	$('#modalIngresoDireccion').modal('toggle');

        	if(
        		!(document.getElementById('npn').value == '' 
        		&& document.getElementById('direccion').value == '' 
        		&& document.getElementById('predioId').value == '' 
        		&& document.getElementById('nomenclaturaId').value == '')
        		){
        		$scope.$apply(function(){
					$scope.solicitud.npn = document.getElementById('npn').value;
					$scope.solicitud.direccion = document.getElementById('direccionVisual').value;
					$scope.solicitud.idpredio = document.getElementById('predioId').value != '' ? document.getElementById('predioId').value:null;
					$scope.solicitud.idnomenclatura = document.getElementById('nomenclaturaId').value != '' ? document.getElementById('nomenclaturaId').value:null;
					//$scope.solicitud.di = document.getElementById('direccionVisual').value != '' ? document.getElementById('direccionVisual').value:null;
        		});

				document.getElementById('npn').value = '';
				document.getElementById('direccion').value = '';
				document.getElementById('infoAdicional').value = '';
				document.getElementById('predioId').value = '';
				document.getElementById('nomenclaturaId').value = '';

        	}

        };


		$scope.haveError = function(value, formCliente){
			return 	formCliente[value] && //formCliente[value].$touched && 
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
		};

		$scope.editarSolicitud = function (){
			$scope.estado = 'previsualizacion';
		};

		/**
		 * Lista los archivos de la solicitud
		 */
		$scope.listarArchivosGuardados = function(){
			$scope.solicitud.documentos = null;
			$resource(root+"solicitudxdocumento", {}, {
	            query: {
	                method: 'GET', 
	                isArray: true, 
	                transformResponse: function(json, headerGetter){
	                    return angular.fromJson(json);
	                }
	            }
	        }).query({
	        	idsolicitud: $scope.solicitud.idSolicitud
	        }).$promise.then(function(response){
	        	$scope.solicitud.documentos = response;
	        	for(var i in $scope.solicitud.documentos){
	        		$scope.solicitud.documentos[i].url = root+'asignomenclatura/descargardoc?nombre='+$scope.solicitud.documentos[i].archivo;
	        	}
	        }, function(error){
				alert('Lo sentimos, no se ha podido realizar la acción, por favor consulte al administrador de la red.');
	        });
		};

		$scope.start();
	}]
);
