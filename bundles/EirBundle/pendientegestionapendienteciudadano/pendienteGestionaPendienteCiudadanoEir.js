saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('pendientegestionapendienteciudadano', {
			url: '/eir/pendientegestionapendienteciudadano/{idSolicitud}',
			views: {
				main: {
					controller: 'PendienteGestionaPendienteCiudadanoEirCtrl',
					templateUrl: '../bundles/EirBundle/pendientegestionapendienteciudadano/pendienteGestionaPendienteCiudadanoEir.tpl.html'
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
									}, 20000);
								});
							}
						}
					}
				}
			}])

		.controller('PendienteGestionaPendienteCiudadanoEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', 'UtilForm', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiuSolicitadas', 'PendienteGestionaPendienteCiudadanoEir',
					function ($scope, $window, $resource, $state, $stateParams, UtilForm, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiuSolicitadas, PendienteGestionaPendienteCiudadanoEir) {
						$scope.tplinformacionEir = "../bundles/EirBundle/informacionEir/informacionEir.tpl.html";
						$scope.inputFileCmp = {};
						$scope.archivos = [];

						$scope.selection = [];
						$scope.listarevisor = [];

						$scope.toggleSelection = function toggleSelection(valor) {
							var idx = $scope.selection.indexOf(valor);
							// Is currently selected
							if (idx > -1) {
								$scope.selection.splice(idx, 1);
							}

							// Is newly selected
							else {
								$scope.selection.push(valor);
							}
						};

						$scope.eliminarArchivo = function (index) {
							$scope.archivos.splice(index, 1);
						};

						$scope.reset = function () {
							$scope.archivos = [];
						};

						PendienteGestionaPendienteCiudadanoEir.ListarRevisor().then(
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

						$scope.agregar = function () {
							$('[data-toggle="tooltip"]').tooltip();
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

						$scope.paste = function (event) {
							var item = event.clipboardData.items[0];
							item.getAsString(function (data) {
								alert(data);
								var oldString = data;
								var str = oldString.replace(/<span style="font-family: Arial;">/, "");
								$scope.solicitud.descripcion = str;
							});
						};

						$scope.init = function (idSolicitud) {
							$scope.estado = 'pendientegestionapendinteciudadano';
							$scope.messageErrorCliente = '';
							$scope.solicitud = {idsolicitud: $stateParams.idSolicitud};

							PendienteGestionaPendienteCiudadanoEir.validaTiposolicitud($stateParams.idSolicitud).then(
									function (response) {
										$scope.errors = [];
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
									},
									function (error) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										console.warn('no se encontraròn datos + validaTiposolciitud', error);
										bootbox.alert(error.msg);
									}
							);

						}

						$scope.previsualizarPlantilla = function () {

							var allData = {
								idsolicitud: $stateParams.idSolicitud,
								descripcion: $scope.solicitud.descripcion,
								anexo: $scope.solicitud.anexo,
								asunto: $scope.solicitud.asunto,
								reviso: $scope.solicitud.idlistarevisor
							};

							UtilForm.openWith(
									root + "eir/pendientegestionapendienteciudadano/previsualizarplantilla",
									'post',
									[
										{
											name: 'idsolicitud',
											value: $stateParams.idSolicitud
										},
										{
											name: 'descripcion',
											value: $scope.solicitud.descripcion
										},
										{
											name: 'anexo',
											value: $scope.solicitud.anexo
										},
										{
											name: 'asunto',
											value: $scope.solicitud.asunto
										},
										{
											name: 'reviso',
											value: $scope.solicitud.idlistarevisor
										}
									]
									);


						}

						$scope.guardarSolicitud = function () {

							var allData = {
								idsolicitud: $stateParams.idSolicitud,
								descripcion: $scope.solicitud.descripcion,
								anexo: $scope.solicitud.anexo,
								asunto: $scope.solicitud.asunto,
								reviso: $scope.solicitud.idlistarevisor
							};

							console.warn(allData);
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							$scope.solicitudEnviada = angular.copy($scope.solicitud);
							$scope.solicitudEnviada.files = $scope.archivos;

							Upload.upload({
								url: root + 'eir/pendientegestionapendienteciudadano/cambiarpendienteapendienteciudadano',
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
												bootbox.alert(response.msg);
												bootbox.alert('Se ha cambio correctamente el estado de la solicitud: ' + response.data.idsolicitud + ', a pendiente informaciòn ciudadano.',
														function (result) {
															$scope.estado = 'confirmacion';
															$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
														});
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

						$scope.cancelarSolicitud = function () {
							//listar tareas.
							$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
						};

						$scope.start();

					}
				]



				);
