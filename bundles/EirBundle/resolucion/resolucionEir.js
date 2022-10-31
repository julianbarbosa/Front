saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('resolucioneir', {
			url: '/eir/resolucion/{idSolicitud}',
			views: {
				main: {
					controller: 'ResolucionEirCtrl',
					templateUrl: '../bundles/EirBundle/resolucion/resolucionEir.tpl.html'
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
									}, 1500);
								});
							}
						}
					}
				}
			}])

		.controller('ResolucionEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', 'UtilForm', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiuSolicitadas', 'ResolucionEir',
					function ($scope, $window, $resource, $state, $stateParams, UtilForm, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiuSolicitadas, ResolucionEir) {
						$scope.tplinformacionEir = "../bundles/EirBundle/informacionEir/informacionEir.tpl.html";
						$scope.inputFileCmp = {};
						$scope.archivos = [];

						$scope.eliminarArchivo = function (index) {
							$scope.archivos.splice(index, 1);
						};

						$scope.reset = function () {
							$scope.archivos = [];
						};

						$scope.agregar = function () {
							if ($scope.inputFileCmp.file !== null) {
								$scope.archivos.push($scope.inputFileCmp.file);
								$scope.inputFileCmp.reset();
								$('[data-toggle="tooltip"]').tooltip();
							}
							//console.warn($scope.inputFileCmp);
						};

						$scope.start = function () {
							$scope.init($stateParams.idSolicitud);
						};

						$scope.init = function (idSolicitud) {
							ResolucionEir.validaTiposolicitud($stateParams.idSolicitud).then(
									function (response) {
										$scope.errors = [];
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");

										$scope.estado = 'resolucion';
										$scope.messageErrorCliente = '';
										$scope.claseresolucion = [];
										$scope.solicitud = {idsolicitud: $stateParams.idSolicitud};
										$scope.tipoclaseresolucion = [];
										$scope.listarevisor = [];

										ResolucionEir.ListarClasesResolucion().then(
												function (response) {
													for (var i = response.data.length - 1; i >= 0; i--) {
														$scope.tipoclaseresolucion.push(response.data[i]);
													}

													$scope.errors = [];
													$(".overlap_espera").fadeOut(500, "linear");
													$(".overlap_espera_1").fadeOut(500, "linear");
												},
												function (error) {
													$(".overlap_espera").fadeOut(500, "linear");
													$(".overlap_espera_1").fadeOut(500, "linear");
													console.warn('no se encontraros tipos para la clases de la resolucion', error);
												}
										);

										ResolucionEir.ListarRevisor().then(
												function (response) {
													for (var i = response.data.length - 1; i >= 0; i--) {
														$scope.listarevisor.push(response.data[i]);
													}

													$scope.errors = [];
													$(".overlap_espera").fadeOut(500, "linear");
													$(".overlap_espera_1").fadeOut(500, "linear");
												},
												function (error) {
													$(".overlap_espera").fadeOut(500, "linear");
													$(".overlap_espera_1").fadeOut(500, "linear");
													console.warn('no se encontraros tipos para la lista de revisores', error);
												}
										);
									},
									function (error) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										//console.warn('no se encontraròn datos + validaTiposolciitud', error);
										bootbox.alert(error.msg);

										//listar tareas.
										$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
									}
							);


						}

						$scope.previsualizarPlantilla = function () {

							var allData = {
								idsolicitud: $stateParams.idSolicitud,
								descripcion: $scope.solicitud.descripcion,
								anexo: $scope.solicitud.anexo,
								fechadeingreso: $scope.solicitud.fechadeingreso,
								reviso: $scope.solicitud.idlistarevisor
							};

							UtilForm.openWith(
									root + "eir/resolucion/previsualizarplantilla",
									'post',
									[
										{
											name: 'idsolicitud',
											value: $stateParams.idSolicitud
										},
										{
											name: 'idclaseresolucion',
											value: $scope.solicitud.idclaseresolucion
										},
										{
											name: 'numeroresolucion',
											value: $scope.solicitud.numeroresolucion
										},										
										{
											name: 'descripcion',
											value: $scope.solicitud.descripcion
										},
										{
											name: 'fechadeingreso',
											value: $scope.solicitud.fechadeingreso
										},
										{
											name: 'reviso',
											value: $scope.solicitud.idlistarevisor
										}
									]
									);


							/*PendienteGestionaPendienteCiudadanoEir.previsualizarPlantilla({
							 data: allData,
							 transformResponse: function (json, headerGetter) {
							 return angular.fromJson(json);
							 }
							 }).then(
							 function (response) {
							 $scope.errors = [];
							 $(".overlap_espera").fadeOut(500, "linear");
							 $(".overlap_espera_1").fadeOut(500, "linear");
							 },
							 function (error) {
							 $(".overlap_espera").fadeOut(500, "linear");
							 $(".overlap_espera_1").fadeOut(500, "linear");
							 console.warn('no se encontraròn datos + validaTiposolciitud', error);
							 alert(error.msg);
							 }
							 );*/

						}


						$scope.guardarSolicitud = function () {

							var allData = {
								idsolicitud: $scope.solicitud.idsolicitud,
								idclaseresolucion: $scope.solicitud.idclaseresolucion,
								numeroresolucion: $scope.solicitud.numeroresolucion,
								descripcion: $scope.solicitud.descripcion,
								fechadeingreso: $scope.solicitud.fechadeingreso
							};
							console.warn(allData);
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							$scope.solicitudEnviada = angular.copy($scope.solicitud);
							$scope.solicitudEnviada.files = $scope.archivos;

							Upload.upload({
								url: root + 'eir/resolucion/crearResolucion',
								data: $scope.solicitudEnviada,
								transformResponse: function (json, headerGetter) {
									return angular.fromJson(json);
								}
							}).then(
									function (resp) {
										response = resp.data;
										$scope.solicitudEnviada.files.length = 0;

										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear", function () {
											console.warn('Response es ', response);
											if (response.success) {
												bootbox.alert('Se ha generado resolución a la solicitud: ' + response.data.idsolicitud + '.',
														function (result) {
															$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
														});
												$scope.estado = 'confirmacion';
											} else {
												bootbox.alert('Ha ocurrido un error. ' + response.msg);
											}
										});
									}, function (error) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									$scope.messageErrorCliente = "Ooops, Ha ocurrido un error!!!, por favor vuelva a intentarlo.";
									switch (error.status) {
										case 500:
											bootbox.alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
											break;
										case 404:
											bootbox.alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
											break;
									}
								});
								console.warn('OK: ', response.status + ': ' + response.dat);
							}, function (evt) {
								$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
							}
							);
							return;
						};


						$scope.cancelarSolicitud = function (i) {
							$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
						}

						$scope.listarTareas = function (i) {
							$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
						}

						$scope.start();
					}
				]



				);
