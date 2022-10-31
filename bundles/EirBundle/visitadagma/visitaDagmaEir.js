saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('visitadagmaeir', {
			url: '/eir/visitadagma/{idSolicitud}',
			views: {
				main: {
					controller: 'VisitaDagmaEirCtrl',
					templateUrl: '../bundles/EirBundle/visitadagma/visitaDagmaEir.tpl.html'
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

		.controller('VisitaDagmaEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiuSolicitadas', 'VisitaDagmaEir',
					function ($scope, $window, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiuSolicitadas, VisitaDagmaEir) {
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

						$scope.init = function (idSolicitud) {
							$scope.estado = 'visitadagma';
							$scope.messageErrorCliente = '';
							$scope.solicitud = {idsolicitud: $stateParams.idSolicitud};

							VisitaDagmaEir.validaTiposolicitud($stateParams.idSolicitud).then(
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

						}


						$scope.guardarSolicitud = function () {

							var allData = {
								idsolicitud: $scope.solicitud.idsolicitud,
								idclasevisitadagma: $scope.solicitud.idclasevisitadagma,
								descripcion: $scope.solicitud.descripcion,
								favorable: $scope.solicitud.favorable,
								fechadeingreso: $scope.solicitud.fechadeingreso
							};
							console.warn(allData);
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							$scope.solicitudEnviada = angular.copy($scope.solicitud);
							$scope.solicitudEnviada.files = $scope.archivos;

							Upload.upload({
								url: root + 'eir/visitadagma/crearVisitaDagma',
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
