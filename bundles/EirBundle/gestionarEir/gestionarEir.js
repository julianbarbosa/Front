saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('gestionareir', {
			url: '/eir/gestionar/{idSolicitud}',
			views: {
				main: {
					controller: 'GestionarEirCtrl',
					templateUrl: '../bundles/EirBundle/gestionarEir/gestionarEir.tpl.html'
				}
			}
		});

	}])

		.directive('charCount', ['$log', '$timeout', function ($log, $timeout) {
				return {
					restrict: 'A',
					compile: function compile()
					{
						return {
							post: function postLink(scope, iElement, iAttrs)
							{
								iElement.bind('keydown', function ()
								{
									scope.$apply(function ()
									{
										scope.numberOfCharacters = iElement.val().length;
									});
								});
								iElement.bind('paste', function ()
								{
									$timeout(function ()
									{
										scope.$apply(function ()
										{
											scope.numberOfCharacters = iElement.val().length;
										});
									}, 200);
								});
							}
						}
					}
				}
			}])

		.controller('GestionarEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiuSolicitadas', 'GestionEir',
					function ($scope, $window, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiuSolicitadas, GestionEir) {

						/****tabs**/
						$scope.tabs = [
							{title: 'Dynamic Title 1', content: 'Dynamic content 1'},
							{title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
						];


						$scope.alertMe = function () {
							setTimeout(function () {
								$window.alert('You\'ve selected the alert tab!');
							});
						};

						$scope.model = {
							name: 'Tabs'
						};
						/***/

						$scope.ciiu = function (idEir) {
							$scope.allTags = [];

							GestionEir.consultarActividadesCiiuSolicitadas(idEir)
									.then(function (response) {
										for (var i in response.data) {
											response.data[i].form = {};
											$scope.allTags.push(response.data[i]);
										}
									}, function (response) {

										alert(response.msg);
									});
						};

						$scope.data = $stateParams;


						$scope.start = function () {
							$scope.init($stateParams.idSolicitud);
						};

						//Inicializando la aplicación
						$scope.init = function (idSolicitud) {

							GestionEir.validaTiposolicitud($stateParams.idSolicitud).then(
									function (response) {
										$scope.errors = [];
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
									},
									function (error) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										//console.warn('no se encontraròn datos + validaTiposolciitud', error);
										alert(error.msg);
										//listar tareas.
										$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
									}
							);

							//$scope.initInputFile();
							$scope.estado = 'gestion';
							$scope.messageErrorCliente = '';
							$scope.solicitud = {
								documentos: []
							};
							$scope.AccionVentana = {};
							$scope.datosguardados = [];

							if ($scope.datosguardados == "") {

								GestionEir.mostrarVisitas(idSolicitud)
										.then(function (response) {
											$scope.datosguardados = response;
											$scope.estado = 'guardado';
										}, function (response) {
											alert(response.msg);
										});

								GestionEir.consultaRadicados(idSolicitud)
										.then(function (response) {
											$scope.radicados = response;
										}, function (response) {
											alert(response.msg);
										});

							} else {
								alert(response.msg);
							}


							if (typeof idSolicitud != 'undefined') {
								$scope.cargarSolicitud(idSolicitud);
							}
						};

						$scope.cargarSolicitud = function (idSolicitud) {

							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							GestionEir.mostrarSolicitud(idSolicitud)
									.then(
											function (response) {
												$(".overlap_espera").fadeOut(500, "linear");
												$(".overlap_espera_1").fadeOut(500, "linear");

												$scope.eir = response.data;
												$scope.solicitud = response.data.solicitud;
												$scope.ciiu(response.data.idEir);

												if (!(response.data.solicitud.estado.codigo == 'pendiente' || response.data.solicitud.estado.codigo == 'preradicada')) {
													alert("La solicitud está en estado " + response.data.solicitud.estado.nombre);
												} else {
													switch ($scope.solicitud.estado.codigo) {
														case 'pendientegestionpot':
															$scope.estado = 'visualizacion';
															break;
														case 'preradicada':
															$scope.estado = 'visualizacion';
															break;
														case 'pendiente':
															$scope.estado = 'gestion';
															break;
													}
												}
											},
											function (error) {
												$(".overlap_espera").fadeOut(500, "linear");
												$(".overlap_espera_1").fadeOut(500, "linear");
												alert(error.msg);
											}
									);
						};

						$scope.imprimir = function () {
							$scope.impreso = true;
							window.open(root + 'eir/impresionpdf/' + $scope.solicitud.idSolicitud);
						};

						$scope.guardarCambios = function () {
							$scope.impreso = false;
							$scope.actualizarSolicitud();
						};

						$scope.anular = function () {

						};

						$scope.limpiarCliente = function () {
							$scope.start();
						};

						$scope.cancelarSolicitud = function () {
							$scope.start();
						};

						$scope.guardarSolicitud = function () {
							var allData = {
								idsolicitud: $scope.solicitud.idsolicitud,
								ideir: $scope.eir.idEir,
								visitadagma: $scope.gestionEIR.visitadagma,
								observacionesvisitadagma: $scope.gestionEIR.observacionesvisitadagma,
								visitatecnica: $scope.gestionEIR.visitatecnica,
								observacionesvisitatecnica: $scope.gestionEIR.observacionesvisitatecnica,
								visitaseguridadyjusticia: $scope.gestionEIR.visitaseguridadyjusticia,
								observacionesvisitaseguridadyjusticia: $scope.gestionEIR.observacionesvisitaseguridadyjusticia,
								respuestaCiiu: []
							};

							for (var i in $scope.allTags) {
								allData.respuestaCiiu.push(
										{
											ideir: $scope.allTags[i].eir.idEir,
											idciiu: $scope.allTags[i].idciiu,
											respuesta: $scope.allTags[i].respuesta,
											observacionesrespuesta: $scope.allTags[i].observacionesrespuesta
										}
								);
							}
							;
							//console.warn(allData);
							GestionEir.guardarDatos(allData)
									.then(
											function (response) {
												$(".overlap_espera").fadeOut(500, "linear");
												$(".overlap_espera_1").fadeOut(500, "linear", function () {
													if (response.success) {

														bootbox.alert("Solicitud guardada correctamente.",
																function (result) {
																	$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
																	$(".overlap_espera").fadeOut(500, "linear");
																	$(".overlap_espera_1").fadeOut(500, "linear");
																	//console.log('This was logged in the callback: ' + result); 
																});

														GestionEir.mostrarVisitas(response.data.idsolicitud)
																.then(function (response) {
																	$scope.datosguardados = response;
																}, function (response) {
																	bootbox.alert(response.msg);
																});

														$scope.estado = 'guardado';
													}
												});
											},
											function (error) {
												$(".overlap_espera").fadeOut(500, "linear");
												$(".overlap_espera_1").fadeOut(500, "linear");
												bootbox.alert(error.msg);
											}
									);

						};

						$scope.gestionEIR = {};

						$scope.haveError = function (value, formCliente) {
							return 	formCliente[value] &&
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
								}

								$scope.mostrarDiv = function (i) {

									if ($scope.allTags[i].mostrarDiv) {
										$scope.allTags[i].mostrarDiv = false;
									} else {
										$scope.allTags[i].mostrarDiv = true;
									}
									//$scope.allTags[i].form = {};
									//$scope.allTags[i].form.respuestaciiu = false;

								}

								$scope.cerrarDiv = function (i) {
									$scope.allTags[i].mostrarDiv = false;
									$scope.allTags[i].respuesta = "";
									$scope.allTags[i].observacionesrespuesta = "";
									$scope.respuestaciiu = false;
									//console.warn($scope.allTags);
								}
								$scope.guardarDiv = function (i) {
									$scope.allTags[i].mostrarDiv = false;
									//$scope.allTags[i].form.respuestaciiu = true;
									console.warn($scope.allTags);
								}

								$scope.cancelarSolicitud = function (i) {
									alert('cancelar');
								}

								$scope.listarTareas = function (i) {
									$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
								}

								$scope.validForms = function () {
									var valid = true;
									for (var i in $scope.allTags) {
										valid &= $scope.allTags[i].form.$valid;
									}
									return valid;
								};

								$scope.cancelarSolicitud = function () {
									//listar tareas.
									$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
								};


								$scope.start();
							}]

								);
