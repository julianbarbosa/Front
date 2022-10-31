saul.config(["$stateProvider", function ($stateProvider) {
	$stateProvider.state('editar-certificacion', {
		url: '/nomenclatura/solicitar_certificacion/{tipoUsuario}/{IdSolicitud:int}',
		views: {
			main: {
				controller: 'SolicitarCertificacionNomenclaturaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/solicitarCertificacion/solicitarCertificacion.tpl.html'
			}
		}
	});
}])
	.config(["$stateProvider", function ($stateProvider) {
		$stateProvider.state('solicitar-certificacion', {
			url: '/nomenclatura/solicitar_certificacion/{tipoUsuario}',
			views: {
				main: {
					controller: 'SolicitarCertificacionNomenclaturaCtrl',
					templateUrl: '../bundles/NomenclaturaBundle/solicitarCertificacion/solicitarCertificacion.tpl.html'
				}
			}
		});
	}])
	.controller('SolicitarCertificacionNomenclaturaCtrl',
		['$scope', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'MostrarSolicitudCertifNomenclatura', 'ConsultarSolicitante', 'Comuna', 'root', 'rootSaul1', 'ConfirmarDatosCertifNomenclatura', "Upload", 'Nomenclaturax', 'PluginNomenclatura',
			function ($scope, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudCertifNomenclatura, ConsultarSolicitante, ComunaFactory, root, rootSaul1, ConfirmarDatosCertifNomenclatura, Upload, Nomenclaturax, PluginNomenclatura) {

				$scope.alerts = [];

				$scope.inputFiles = {
					escritura: {},
					recibo: {},
					reciboEstampillaMunicipio: {},
					reciboEstampillaDepartamento: {}
				};

				$scope.msgPredio = false;

				$scope.closeAlert = function (index) {
					$scope.alerts.splice(index, 1);
				};

				$scope.start = function () {
					$scope.init($stateParams.IdSolicitud);
				};

				//Inicializando la aplicación
				$scope.init = function (idSolicitud) {

					$scope.funcionario = $stateParams.tipoUsuario == 'ventanilla';
					$scope.mostrarFormSolicitud = !$scope.funcionario;
					$scope.estado = 'creacion';
					$scope.impreso = false;
					$scope.messageErrorCliente = '';
					$scope.cliente = {
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

					$scope.requiredComentario = !$scope.funcionario;
					if (typeof idSolicitud != 'undefined') {
						$scope.cargarSolicitud(idSolicitud);
						$scope.requiredEscritura = false;
						$scope.requiredRecibo = false;
						$scope.requiredReciboEstampillaMunicipio = false;
						$scope.requiredReciboEstampillaDepartamento = false;
					} else {
						$scope.requiredEscritura = $stateParams.tipoUsuario == 'ciudadano';
						$scope.requiredRecibo = $stateParams.tipoUsuario == 'ciudadano';
						// $scope.requiredReciboEstampillaMunicipio = $stateParams.tipoUsuario == 'ciudadano';
						$scope.requiredReciboEstampillaMunicipio = false;
						// $scope.requiredReciboEstampillaDepartamento = $stateParams.tipoUsuario == 'ciudadano';
						$scope.requiredReciboEstampillaDepartamento = false;
					}
				};

				$scope.cargarSolicitud = function (idSolicitud) {

					$(".overlap_espera").show();
					$(".overlap_espera_1").show();
					MostrarSolicitudCertifNomenclatura.get({
						idsolicitud: idSolicitud
					}).$promise.then(
						function (response) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");

							if (response.success) {
								if (!(response.data.solicitud.estado.codigo == 'pendiente' || response.data.solicitud.estado.codigo == 'preradicada')) {
									alert("La solicitud está en estado " + response.data.solicitud.estado.nombre);
									//$state.go('listar-solicitudes-certificacion', {tipoUsuario: $stateParams.tipoUsuario});
									$state.go('solicitar-certificacion', { tipoUsuario: $stateParams.tipoUsuario });
								} else {
									$scope.setSolicitud(response.data);
									$scope.setCliente($scope.solicitud.solicitud.solicitante);
									switch ($scope.solicitud.solicitud.estado.codigo) {
										case 'pendiente':
											$scope.estado = 'visualizacion';
											break;
										case 'preradicada':
											$scope.estado = 'confirmacion';
											break;
										case 'emitida':
										case 'pendiente':
											$scope.estado = 'visualizacion';
											break;
									}
								}
							} else {
								alert(response.msg);
								$state.go('solicitar-certificacion', { tipoUsuario: $stateParams.tipoUsuario });
							}
						}, function (error) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							alert('Ha ocurrido al intentar cargar la Solicitud.(' + error.status + ')');
						}
					);
				};

				$scope.imprimir = function () {
					$scope.impreso = true;
					window.open(root + 'certificado_nomenclatura/solicitudpdf/' + $scope.solicitud.idSolicitud);
				};

				$scope.guardarCambios = function () {
					$scope.impreso = false;
					$scope.actualizarSolicitud();
				};

				$scope.confirmar = function ($idSolicitud) {
					if (!$idSolicitud) {
						$idSolicitud = $scope.solicitud.idSolicitud;
					}
					//Abrimos el overlap de carga
					$(".overlap_espera").show();
					$(".overlap_espera_1").show();
					ConfirmarDatosCertifNomenclatura.query({
						idsolicitud: $idSolicitud
					}).$promise.then(
						function (response) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear", function () {
								if (response.success) {
									if ($scope.funcionario) {
										alert('Solicitud ' + $idSolicitud + ' confirmada correctamente.');
										$state.go('solicitar-certificacion', { tipoUsuario: $stateParams.tipoUsuario });
									} else {
										alert('Solicitud ' + $idSolicitud + ' creada y confirmada correctamente, puede consultar su estado en "Mis solicitudes" a donde será redireccionado.');
										window.location = rootSaul1 + 'solicitud';
									}
								} else {
									alert(response.msg);
								}
							});
						},
						function (errorHttp) {
							var msg = 'Error ' + errorHttp.status + ': ';
							switch (errorHttp.status) {
								case 500:
									msg += 'Error interno en el servidor. Intente nuevamente o consulte al administrador.';
									break;
								case 403:
									msg += 'No tiene permisos para acceder.';
									break;
								case 503:
									msg += 'Servicio no disponible temporalmente.';
									break;
								case 401:
									msg += 'No ha sido posible encontrar la ruta.';
									break;
								case 405:
									msg += 'Método GET o POST no permitido.';
									break;
								default:
									msg += errorHttp.statusText;
									break;
							}
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear", function () {
								alert(msg);
							});

						}
					);
				};

				$scope.anular = function () {
					alert('No ha sido implementada la anulación de una solicitud.');
				};

				$scope.limpiarCliente = function () {
					$scope.start();
				};


				$scope.guardarSolicitud = function () {
					//Abrimos el overlap de carga
					$(".overlap_espera").show();
					$(".overlap_espera_1").show();

					$scope.solicitud.idsolicitante = $scope.cliente.id;
					$scope.solicitudEnviada = angular.copy($scope.solicitud);

					$scope.solicitudEnviada.files = [
						$scope.inputFiles.recibo.file,
						$scope.inputFiles.escritura.file,
						$scope.inputFiles.reciboEstampillaMunicipio.file,
						$scope.inputFiles.reciboEstampillaDepartamento.file
					];

					if ($stateParams.tipoUsuario == 'ciudadano') {
						if (!$scope.inputFiles.recibo.file) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							alert('El recibo no está adjuntos.');
							return;
						}
						if (!$scope.inputFiles.escritura.file) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							alert('La escritura pública no está adjunta.');
							return;
						}
						// if (!$scope.inputFiles.reciboEstampillaMunicipio.file) {
						// 	$(".overlap_espera").fadeOut(500, "linear");
						// 	$(".overlap_espera_1").fadeOut(500, "linear");
						// 	alert('La escritura pública no está adjunta.');
						// 	return;
						// }
						// if (!$scope.inputFiles.reciboEstampillaDepartamento.file) {
						// 	$(".overlap_espera").fadeOut(500, "linear");
						// 	$(".overlap_espera_1").fadeOut(500, "linear");
						// 	alert('La escritura pública no está adjunta.');
						// 	return;
						// }
					}

					if (typeof $scope.solicitud.npn == 'undefined') {
						alert('El campo de predio existente está vacío.');
						return;
					}

					Upload.upload({
						url: root + 'certificado_nomenclatura/create',
						data: $scope.solicitudEnviada,
						transformResponse: function (json, headerGetter) { return angular.fromJson(json); }
					}).then(
						function (resp) {
							var response = resp.data;
							if (response.success) {
								$scope.inputFiles.recibo.reset();
								$scope.inputFiles.escritura.reset();

								$scope.estado = 'confirmacion';
								if ($scope.funcionario) {
									alert('Se ha generado la solicitud ' + response.data.idsolicitud + '.');
									$(".overlap_espera").fadeOut(500, "linear");
									$(".overlap_espera_1").fadeOut(500, "linear", function () {
										$state.go('editar-certificacion', { IdSolicitud: response.data.idsolicitud, tipoUsuario: $stateParams.tipoUsuario });
									});
								} else {
									//alert('Se ha generado la solicitud '+response.data.idsolicitud+', ');
									$scope.confirmar(response.data.idsolicitud);
								}
								//$scope.init(response.data.idsolicitud);
							} else {
								alert('Ha ocurrido un error. ' + response.msg);
							};
						}, function (error) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear", function () {
								$scope.messageErrorCliente = "Ooops, Ha ocurrido un error!!!, por favor vuelva a intentarlo.";
								switch (error.status) {
									case 500:
										alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
										break;
									case 404:
										alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
										break;
									default:
										alert('Ha ocurrido un error en el servicio. Consulte al administrador.');
										console.warn(error);
										break;

								}
							});
						}, function (evt) {
							$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						}
					);
					return;
				};

				$scope.actualizarSolicitud = function () {
					$(".overlap_espera").show();
					$(".overlap_espera_1").show();

					$scope.datosActualizacion = {
						npn: $scope.solicitud.npn,
						comentario: $scope.solicitud.comentario,
						npl: $scope.solicitud.npl,
						direccion: $scope.solicitud.direccion,
						direccionVisual: $scope.solicitud.direccionVisual,
						infoAdicional: $scope.solicitud.infoAdicional,
						idsolicitud: $scope.solicitud.idSolicitud,
						idpredio: $scope.solicitud.idpredio,
						idnomenclatura: $scope.solicitud.idnomenclatura
					};

					$scope.datosActualizacion.files = [];
					if ($scope.inputFiles.recibo.file) {
						$scope.datosActualizacion.files.push($scope.inputFiles.recibo.file);
					}
					if ($scope.inputFiles.escritura.file) {
						$scope.datosActualizacion.files.push($scope.inputFiles.escritura.file);
					}
					if ($scope.inputFiles.reciboEstampillaMunicipio.file) {
						$scope.datosActualizacion.files.push($scope.inputFiles.reciboEstampillaMunicipio.file);
					}
					if ($scope.inputFiles.reciboEstampillaDepartamento.file) {
						$scope.datosActualizacion.files.push($scope.inputFiles.reciboEstampillaDepartamento.file);
					}

					Upload.upload({
						url: root + 'certificado_nomenclatura/' + $scope.solicitud.idSolicitud + '/edit',
						data: $scope.datosActualizacion,
						transformResponse: function (json, headerGetter) { return angular.fromJson(json); }
					}).then(
						function (resp) {
							response = resp.data;
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							if (response.success) {
								//$scope.urlOrfeo = response.data.urlconsulta;
								$scope.inputFiles.recibo.reset();
								$scope.inputFiles.escritura.reset();
								$scope.inputFiles.reciboEstampillaMunicipio.reset();
								$scope.inputFiles.reciboEstampillaDepartamento.reset();
								$scope.setSolicitud(response.data);
							} else {
								alert('Ha ocurrido un error.' + response.msg);
							}
						},
						function (error) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							$scope.messageErrorCliente = "Ooops, Ha ocurrido un error!!!, por favor vuelva a intentarlo.";
							switch (error.status) {
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

				$scope.open1 = function () {
					$scope.popup1.opened = true;
				};

				$scope.buscarCliente = function () {

					$(".overlap_espera").show();
					$(".overlap_espera_1").show();

					ConsultarSolicitante.query({
						id: $scope.cliente.numidentificacion
					}).$promise.then(
						function (response) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							if (response.success) {
								$scope.setCliente(response.data);
							} else {
								//$scope.cliente = {};
								$scope.messageErrorCliente = response.msg;
								//if(response.data.length == 0){
								$scope.openModal('md', 'create');
								//}
							}
						},
						function (error) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							$scope.cliente = {};
							$scope.messageErrorCliente = "Ha ocurrido un error, por favor vuelva a intentarlo.";
							console.error(error);
						}
					);
				};

				$scope.setCliente = function ($cliente) {
					$scope.cliente = $cliente;
					$scope.cliente.telefono = parseInt($scope.cliente.telefono);
					$scope.messageErrorCliente = '';
					$scope.mostrarFormSolicitud = true;
				};

				$scope.setSolicitud = function (nuevaSolicitud) {
					$scope.solicitud = nuevaSolicitud;
					$scope.solicitud.comentario = nuevaSolicitud.solicitud.observacion;

					$scope.listarArchivosGuardados();
					$scope.cliente = $scope.solicitud.solicitud.solicitante;
				};

				$scope.actualizarCliente = function () {
					$scope.openModal('md', 'update');
				};


				$scope.openModal = function (size, action) {
					$scope.AccionVentana.type = action;
					var modalInstance = $modal.open({
						templateUrl: '../bundles/NomenclaturaBundle/solicitarAsignacion/clienteForm.tpl.html',
						controller: 'clienteController',
						size: size,
						resolve: {
							Cliente: function () {
								return $scope.cliente;
							},
							AccionVentana: function () {
								return $scope.AccionVentana;
							}
						}
					}).closed.then(function () {
						if ($scope.AccionVentana.value == 'created' || $scope.AccionVentana.value == 'updated') {
							$scope.buscarCliente();
						}
					});
				};

				$scope.obtenerModalIngresoDireccion = function () {
					//Lanzamos el plugin
					PluginNomenclatura.obtenerModalIngresoDireccion($scope, function (data) {
						//Si hay cambios
						if (data.cambio) {
							//Seteamos los datos obtenidos
							$scope.solicitud.npn = data.npn;
							$scope.solicitud.direccion = data.direccion;
							$scope.solicitud.infoAdicional = data.infoAdicional;
							$scope.solicitud.direccionVisual = data.direccionVisual;
							$scope.solicitud.idpredio = data.predioId ? data.predioId : null;
							$scope.solicitud.idnomenclatura = data.nomenclaturaId ? data.nomenclaturaId : null;

							//Buscamos la información del predio
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();
							$scope.msgPredio = false;
							Nomenclaturax
								.getInfoPorNpn($scope.solicitud.npn)
								.then(function (data) {
									$(".overlap_espera").fadeOut(500, "linear");
									$(".overlap_espera_1").fadeOut(500, "linear");

									$scope.solicitud.npl = data.predio.numero;
									if (data.predio.vereda) {
										$scope.solicitud.nombreBarrio = data.predio.vereda.nombre;
									} else if (data.predio.barrio) {
										$scope.solicitud.nombreBarrio = data.predio.barrio.nombre;
									} else {
										$scope.solicitud.nombreBarrio = null;
									}
								}, function (data) {
									$(".overlap_espera").fadeOut(500, "linear");
									$(".overlap_espera_1").fadeOut(500, "linear", function () {
										$scope.msgPredio = 'No se pudo extraer información del predio. \n' + data.msg;
									});
								}
								);
						}
					}, function (error) {
						alert(error);
					});
				};


				$scope.haveError = function (value, formCliente) {
					return formCliente[value] &&
						//formCliente[value].$touched && 
						(
							formCliente[value].$error.required == true ||
							formCliente[value].$error.email == true ||
							formCliente[value].$error.tel == true ||
							formCliente[value].$error.minlength == true ||
							formCliente[value].$error.maxlength == true ||
							formCliente[value].$error.min == true ||
							formCliente[value].$error.max == true ||
							formCliente[value].$error.pattern == true
						);
				};

				$scope.editarSolicitud = function () {
					$scope.estado = 'previsualizacion';
				};

				/**
				 * Lista los archivos de la solicitud
				 */
				$scope.listarArchivosGuardados = function () {
					$scope.solicitud.documentos = null;
					$resource(root + "solicitudxdocumento", {}, {
						query: {
							method: 'GET',
							isArray: true,
							transformResponse: function (json, headerGetter) {
								return angular.fromJson(json);
							}
						}
					}).query({
						idsolicitud: $scope.solicitud.idSolicitud
					}).$promise.then(function (response) {
						$scope.solicitud.documentos = response;
						for (var i in $scope.solicitud.documentos) {
							$scope.solicitud.documentos[i].url = root + 'asignomenclatura/descargardoc?nombre=' + $scope.solicitud.documentos[i].archivo;
						}
					}, function (error) {
						alert('Lo sentimos, no se ha podido realizar la acción, por favor consulte al administrador de la red.');
					});
				};

				$scope.start();
			}]
	);
