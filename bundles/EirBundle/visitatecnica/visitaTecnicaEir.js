saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('visitatecnicaeir', {
			url: '/eir/visitatecnica/{idSolicitud}',
			views: {
				main: {
					controller: 'VisitaTecnicaEirCtrl',
					templateUrl: '../bundles/EirBundle/visitatecnica/visitaTecnicaEir.tpl.html'
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

		.controller('VisitaTecnicaEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiuSolicitadas', 'VisitaTecnicaEir',
					function ($scope, $window, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiuSolicitadas, VisitaTecnicaEir) {
						$scope.tplinformacionEir = "../bundles/EirBundle/informacionEir/informacionEir.tpl.html";
						$scope.inputFileCmp = {};
						$scope.archivos = [];

						$scope.selection = [];

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
							$scope.estado = 'visitatecnica';
							$scope.messageErrorCliente = '';
							$scope.solicitud = {idsolicitud: $stateParams.idSolicitud};
							$scope.listadeinfracciones = [];
							$scope.infracciones = [];

							VisitaTecnicaEir.validaTiposolicitud($stateParams.idSolicitud).then(
									function (response) {
										$scope.errors = [];
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
									},
									function (error) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										console.warn('no se encontraròn datos + validaTiposolciitud', error);
										bootbox.alert(error.msg,
												function (result) {
													$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
												});
									}
							);

							VisitaTecnicaEir.listarInfracciones().then(
									function (response) {
										for (var i = response.data.length - 1; i >= 0; i--) {
											$scope.infracciones.push(response.data[i]);
										}
										$scope.errors = [];
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
									},
									function (error) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										bootbox.alert(error.msg,
												function (result) {
													$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
												});
										console.warn('no se encontraros las infracciones para la visitatecnica', error);
									}
							);
						}

						$scope.guardarSolicitud = function () {

							var allData = {
								idsolicitud: $scope.solicitud.idsolicitud,
								idclasevisitatecnica: $scope.solicitud.idclasevisitatecnica,
								descripcion: $scope.solicitud.descripcion,
								fechadeingreso: $scope.solicitud.fechadeingreso
							};
							console.warn(allData);
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							$scope.solicitudEnviada = angular.copy($scope.solicitud);
							$scope.solicitudEnviada.files = $scope.archivos;

							$scope.solicitudEnviada.infracciones = $scope.selection;

							Upload.upload({
								url: root + 'eir/visitatecnica/crearVisitaTecnica',
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
												bootbox.alert('Se ha guardado correctamente la solicitud: ' + response.data.idsolicitud,
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

						$scope.listarTareas = function () {
							$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
						};


						$scope.cancelarSolicitud = function () {
							$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
						};

						$scope.start();
					}
				]



				);
