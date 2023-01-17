saul.controller('sfUserController',
		['$scope', '$uibModalInstance', 'Usuario', 'AccionVentana', 'CrearSolicitante', 'ActualizarSolicitante', 'ListarTiposDocIdentificacion', 'ListarBarrios', 'ListarGrupos', 'urlPlugInNomenclatura', '$resource', 'listarGruposxIDUsuario',
			function ($scope, $modalInstance, Usuario, AccionVentana, CrearSolicitante, ActualizarSolicitante, ListarTiposDocIdentificacion, ListarBarrios, ListarGrupos, urlPlugInNomenclatura, $resource, listarGruposxIDUsuario) {

				$scope.idsgrupos = [];
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

				$scope.init = function () {
					$(".overlap_espera").show();
					$(".overlap_espera_1").show();

					$scope.tiposIdentificacion = [];
					$scope.barrios = [];
					$scope.grupos = [];
					$scope.arrayopciones = [
						{id: 0,
							nombre: "No"},
						{id: 1,
							nombre: "Si"}];

					$scope.arrayopcionesbool = [
						{id: false,
							nombre: "No"},
						{id: true,
							nombre: "Si"}];

					$scope.usuario = angular.copy(Usuario);

					$scope.messageErrorUsuario = '';
					$scope.errors = [];

					switch (AccionVentana.type) {
						case 'create':
							$scope.servicio = CrearSolicitante;
							AccionVentana.value = 'created';
							break;
						case 'update':
							$scope.servicio = ActualizarSolicitante;
							AccionVentana.value = 'updated';
							break;
					}

					if (AccionVentana.type == 'update') {
						$scope.grupo = {};
						listarGruposxIDUsuario.get(Usuario).$promise.then(function (response) {
							if (response.success) {
								//console.log(response);
								//$scope.selection.length = 0;
								for (var i in response.data) {
									//Si no lo encuentra									
									if ($scope.selection.indexOf(response.data[i].idgrupo) < 0) {
										$scope.selection.push(response.data[i].groupId);
									}
								}
							}
						});
					}


					$scope.action = AccionVentana.type;

					ListarTiposDocIdentificacion.query({}).$promise.then(
							function (response) {
								for (var i = response.length - 1; i >= 0; i--) {
									$scope.tiposIdentificacion.push(response[i]);
								}

								ListarBarrios.query({}).$promise.then(
										function (response) {
											for (var i = 0; i < response.length; i++) {
												$scope.barrios.push(response[i]);
											}
											$(".overlap_espera").fadeOut(500, "linear");
											$(".overlap_espera_1").fadeOut(500, "linear");
										},
										function (error) {}
								);


								ListarGrupos.query({}).$promise.then(
										function (response) {
											for (var i = 0; i < response.length; i++) {
												$scope.grupos.push(response[i]);
											}
											$(".overlap_espera").fadeOut(500, "linear");
											$(".overlap_espera_1").fadeOut(500, "linear");
										},
										function (error) {}
								);
							},
							function (error) {}
					);
				};


				$scope.guardar = function (param) {
					$(".overlap_espera").show();
					$(".overlap_espera_1").show();

					$scope.usuario.grupos = [];
					$scope.usuario.grupos.push($scope.selection);

					$scope.servicio.query($scope.usuario).$promise.then(
							function (response) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									if (response.success) {
										Usuario = $scope.usuario;
										if (response.data !== null) {
											$resource('http://localhost/saul/sfapply/enviaremail')
													.get({
														idusuario: response.data.id
													}).
													$promise
													.then(
															function (response) {
																alert('Se envio un correo para la activación de la cuenta');
																///$scope.currentPage = 
																$modalInstance.dismiss('cancel');
															}, function (error) {
														$scope.messageErrorUsuario = 'No se pudo enviar la activación por correo';
													});
										}
									} else {
										AccionVentana.value = 'error';
										$scope.messageErrorUsuario = response.msg;
										$scope.errors = response.data;
									}
								});
							},
							function (error) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear");
								AccionVentana.value = 'error';
								$scope.messageErrorUsuario = "Oops!! tenemos inconvenientes para almacenar, por favor intente nuevamente.";
							}
					);
				};

				$scope.haveError = function (value, formUsuario) {
					return 	formUsuario[value] && formUsuario[value].$touched &&
							(
									formUsuario[value].$error.required == true ||
									formUsuario[value].$error.email == true ||
									formUsuario[value].$error.tel == true ||
									formUsuario[value].$error.minlength == true ||
									formUsuario[value].$error.maxlength == true ||
									formUsuario[value].$error.min == true ||
									formUsuario[value].$error.max == true ||
									formUsuario[value].$error.pattern == true
									);
					//return (value in $scope.errors);
				}

				$scope.cancelar = function () {
					AccionVentana.value = 'canceled';
					$modalInstance.dismiss('cancel');
				};

				$scope.obtenerModalIngresoDireccion = function () {

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
						success: function (a) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear", function () {
								$("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
							});
						},
						error: function (jqXHR, textStatus, errorThrown) {
							$(".overlap_espera").fadeOut(500, "linear");
							$(".overlap_espera_1").fadeOut(500, "linear");
							switch (textStatus) {
								case 'timeout':
									alert("Se ha agotado el tiempo de respuesta del servidor. Intente nuevamente. (Error " + jqXHR.status + ")");
									break;
								case 'error':
									alert("Se ha generado un error en el servidor. Intente nuevamente o consulte al administrador. (Error " + jqXHR.status + ")");
									break;
								case 'abort':
									alert("El servidor ha abortado la conexión. Intente nuevamente. (Error " + jqXHR.status + ")");
									break;
								case 'parsererror':
									alert("La respuesta del servidor no ha sido correcta. Consulte al administrador. (Error " + jqXHR.status + ")");
									break;
								default:
									alert("Lo sentimos, ha ocurrido un error. Intente nuevamente. (Error " + jqXHR.status + ")");
									break;
							}
						}
					});
				};

				cerrarModal = function () {
					$('#modalIngresoDireccion').modal('toggle');

					if (
							!(document.getElementById('npn').value == ''
									&& document.getElementById('direccion').value == ''
									&& document.getElementById('predioId').value == ''
									&& document.getElementById('nomenclaturaId').value == '')
							) {

						$scope.usuario.npn = document.getElementById('npn').value;
						$scope.usuario.direccion = document.getElementById('direccion').value + document.getElementById('infoAdicional').value;
						$scope.usuario.idpredio = document.getElementById('predioId').value != '' ? document.getElementById('predioId').value : null;
						$scope.usuario.idnomenclatura = document.getElementById('nomenclaturaId').value != '' ? document.getElementById('nomenclaturaId').value : null;

						document.getElementById('npn').value = '';
						document.getElementById('direccion').value = '';
						document.getElementById('infoAdicional').value = '';
						document.getElementById('predioId').value = '';
						document.getElementById('nomenclaturaId').value = '';

					}

				};

				$scope.init();

			}]);
