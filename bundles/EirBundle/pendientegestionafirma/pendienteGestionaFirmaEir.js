saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('pendientegestionafirmaeir', {
			url: '/eir/pendientegestionafirma/{idSolicitud}',
			views: {
				main: {
					controller: 'PendienteGestionaFirmaEirCtrl',
					templateUrl: '../bundles/EirBundle/pendientegestionafirma/pendienteGestionaFirmaEir.tpl.html'
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

		.controller('PendienteGestionaFirmaEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiuSolicitadas', 'PendienteGestionaFirmaEir', 'CambioRespuestaCiiu',
					function ($scope, $window, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiuSolicitadas, PendienteGestionaFirmaEir, CambioRespuestaCiiu) {
						$scope.tplinformacionEir = "../bundles/EirBundle/informacionEir/informacionEir.tpl.html";
						$scope.inputFileCmp = {};
						$scope.archivos = [];
						$scope.respuestaciiu = {};
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
							$scope.estado = 'pendientegestionafirma';
							$scope.messageErrorCliente = '';
							$scope.solicitud = {idsolicitud: $stateParams.idSolicitud};

							PendienteGestionaFirmaEir.validaTiposolicitud($stateParams.idSolicitud).then(
									function (response) {
										$scope.errors = [];
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
									},
									function (error) {
										bootbox.alert('<img class="irc_mi" src="http://blog.papelada.com.br/wp-content/uploads/2018/01/exclama%C3%A7%C3%A3o.png" alt="Resultado de imagen para alert image" width="20" height="20" style="margin-top: 0px;"> ' + error.msg,
												function (result) {
													$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
													console.log('This was logged in the callback: ' + result);
												});

									}
							);

						}


						$scope.guardarSolicitud = function () {

							$scope.solicitud.respuestaciiu = CambioRespuestaCiiu.getRespuesta();

							var allData = {
								idsolicitud: $scope.solicitud.idsolicitud,
								descripcion: $scope.solicitud.descripcion,
								respuestaCiiu: $scope.solicitud.respuestaciiu
							};

							//console.warn(allData);
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							PendienteGestionaFirmaEir.guardarDatos(allData).then(
									function (response) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");

										bootbox.alert("Se guradarón los datos satisfactoriamente, y se ha firmado digitalmente el documento.",
												function (result) {
													if (result === true) {
														$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
													} else {
														$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
													}
													//console.log('This was logged in the callback: ' + result); 
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
								console.warn('OK: ', error);
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
