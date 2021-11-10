saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('informacionEir', {
			url: '/eir/informacion/{idSolicitud}',
			views: {
				main: {
					controller: 'InformacionEirCtrl',
					templateUrl: '../bundles/EirBundle/informacionEir/informacionEir.tpl.html'
				}
			}
		});

	}])

		.controller('InformacionEirCtrl',
				['$scope', '$window', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'ConsultarSolicitante', 'Comuna', 'root', 'ConfirmarDatosEir', 'InformacionEir', 'CambioRespuestaCiiu',
					function ($scope, $window, $resource, $state, $stateParams, $filter, $modal, ConsultarSolicitante, ComunaFactory, root, ConfirmarDatosEir, InformacionEir, CambioRespuestaCiiu) {

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
						};

						$scope.data = $stateParams;


						$scope.start = function () {
							$scope.init($stateParams.idSolicitud);
						};

						//Inicializando la aplicación
						$scope.init = function (idSolicitud) {

							$scope.estado = 'gestion';
							$scope.messageErrorCliente = '';
							$scope.solicitud = {
								documentos: []
							};
							$scope.AccionVentana = {};
							$scope.datosguardados = [];

							InformacionEir.retornaIdSolicitudPadre(idSolicitud)
									.then(function (response) {

										if (response.data.idsolicitudpadre) {
											$scope.idsolicitudpadre = response.data.idsolicitudpadre;
											$scope.idsolicitudhijo = response.data.idsolicitud;
										} else {
											$scope.idsolicitudhijo = response.data.idsolicitud;
											$scope.idsolicitudpadre = response.data.idsolicitud;
										}

										$(".overlap_espera").show();
										$(".overlap_espera_1").show();

										if ($scope.datosguardados == "") {
											InformacionEir.mostrarSolicitud($scope.idsolicitudpadre)
													.then(
															function (response) {
																$scope.eir = response.data;
																$scope.solicitud = response.data.solicitud;
																$scope.diastranscurridos = response.diastranscurridos;
																$scope.permisogestionar = response.permisogestionar;
																$scope.ciiu(response.data.idEir);
																$scope.estado = 'guardado';
															}, function (response) {
														alert(response.msg);
													}
													);

											InformacionEir.mostrarVisitas($scope.idsolicitudpadre)
													.then(function (response) {
														$scope.datosguardados = response;
														$scope.estado = 'guardado';
													}, function (response) {
														alert(response.msg);
													});

											InformacionEir.consultaRadicados($scope.idsolicitudpadre)
													.then(function (response) {
														$scope.radicados = response;
														$scope.estado = 'guardado';
													}, function (response) {
														alert(response.msg);
													});

											InformacionEir.consultaRespuestaCiiu($scope.idsolicitudpadre)
													.then(function (response) {
														$scope.respuesta = response;
														$scope.estado = 'guardado';

														$(".overlap_espera").fadeOut(500, "linear");
														$(".overlap_espera_1").fadeOut(500, "linear");

													}, function (response) {
														alert(response.msg);
													});

										} else {
											alert(response.msg);
										}

									}, function (response) {
										alert(response.msg);
									});
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

								$scope.emitirEvento = function () {

									CambioRespuestaCiiu.setRespuesta($scope.respuesta.data);
									//console.warn( 'Desde informacion R1:', $scope.respuesta );
									//console.warn( 'R2:', CambioRespuestaCiiu.getRespuesta() );
								};

								$scope.start();
							}]

								);
