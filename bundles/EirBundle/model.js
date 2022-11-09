saul.
//Servicio para abrir un formulario en otra ventana. Es útil en caso de previsualización de un pdf
		factory("UtilForm", [function () {
				return {
					/**
					 * Abre una nueva ventana con los parámetros especificados
					 * @param  {String}     url    Url que se va a abrir
					 * @param  {String}     method Puede ser post o get
					 * @param  {Array}      data   Arreglo con objetos {name, value} que serán los datos enviados
					 */
					openWith: function (url, method, data) {
						var f = document.createElement('form');
						f.innerHTML = '';
						f.setAttribute('method', method);
						f.setAttribute('action', url);
						f.setAttribute('style', 'display: none');

						for (var i = data.length - 1; i >= 0; i--) {
							var input = document.createElement("input");
							input.setAttribute('type', "text");
							input.setAttribute('name', data[i].name);
							input.setAttribute('value', data[i].value);
							f.appendChild(input);
						}

						document.body.appendChild(f);

						var win = window.open('', 'ventanaPrevisualizacion');
						f.target = 'ventanaPrevisualizacion';
						f.submit();
						f.parentElement.removeChild(f);
					}
				};
			}])
		.factory("ListarBarrios", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "barrio/", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		])
		.factory("PluginNomenclatura", ['urlPlugInNomenclatura', function (urlPlugInNomenclatura) {
				return {
					obtenerModalIngresoDireccion: function ($scope, fnClose, fnError) {

						$('body').append(
								'<div id="__urlPlugInNomenclatura__hiddens_plugin_direccion">' +
								'<input id="__urlPlugInNomenclatura__npn" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__direccion" type="hidden">' +
								'<input id="__urlPlugInNomenclatura__infoAdicional" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__direccionVisual" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__predioId" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__nomenclaturaId" type="hidden" />' +
								'</div>' +
								'<div id="__urlPlugInNomenclatura__modalIngresoDireccion" class="modal fade modal-change" role="dialog" aria-hidden="true" ></div>'
								);
						var modalDireccion = $('#__urlPlugInNomenclatura__modalIngresoDireccion');
						__cerrarModalPlugInNomenclatura0 = function () {
							modalDireccion.modal('hide');
						};
						__cerrarModalPlugInNomenclatura1 = function () {

							$scope.$apply(function () {
								fnClose(
										{
											npn: document.getElementById('__urlPlugInNomenclatura__npn').value,
											direccion: document.getElementById('__urlPlugInNomenclatura__direccion').value,
											infoAdicional: document.getElementById('__urlPlugInNomenclatura__infoAdicional').value ? document.getElementById('__urlPlugInNomenclatura__infoAdicional').value.trim() : null,
											direccionVisual: document.getElementById('__urlPlugInNomenclatura__direccionVisual').value,
											predioId: document.getElementById('__urlPlugInNomenclatura__predioId').value,
											nomenclaturaId: document.getElementById('__urlPlugInNomenclatura__nomenclaturaId').value,
											cambio: !(document.getElementById('__urlPlugInNomenclatura__npn').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__direccion').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__direccionVisual').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__predioId').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__nomenclaturaId').value == '')
										}
								);
							});

							$('#__urlPlugInNomenclatura__hiddens_plugin_direccion').remove();
							modalDireccion.remove();
						};


						$(".overlap_espera").show();
						$(".overlap_espera_1").show();

						$.ajax({
							url: urlPlugInNomenclatura,
							data: {
								fieldNamecallbackFunction: '__cerrarModalPlugInNomenclatura0',
								fieldNameNPNrequerido: false,
								activarBusqueda: true,
								fieldNameDiv: "__urlPlugInNomenclatura__modalIngresoDireccion",
								fieldNameNumeroUnico: "__urlPlugInNomenclatura__npn",
								fieldNameDireccion: "__urlPlugInNomenclatura__direccion",
								fieldNameDireccionVisual: "__urlPlugInNomenclatura__direccionVisual",
								fieldNameDireccionAdicional: "__urlPlugInNomenclatura__infoAdicional",
								fieldNameIdPredio: "__urlPlugInNomenclatura__predioId",
								fieldNameIdNomenclatura: "__urlPlugInNomenclatura__nomenclaturaId"
							},
							success: function (a) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									modalDireccion.empty();
									modalDireccion.append(a);
									modalDireccion.on('hidden.bs.modal', function (e) {
										__cerrarModalPlugInNomenclatura1();
									})
									modalDireccion.modal("show");
								});
							},
							error: function (jqXHR, textStatus) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									fnError("Ha ocurrido un error. Intente nuevamente o consulte al administrador (Error: " + textStatus + ")")
								});
							}
						});
					}
				}
			}])
		.factory('LoadingOverlap', [function () {
				function show($scope, callback, dataCallback) {
					//Iniciamos a mostrar la cortina
					$(".overlap_espera").show();
					$(".overlap_espera_1").show(function () {
						//Si se pasa un callback se ejecutará al finalizar la animación
						if (callback) {
							$scope.$apply(function () {
								callback(dataCallback);
							});
						}
					});
				}

				function hide($scope, callback, dataCallback) {
					//Iniciamos a mostrar la cortina
					$(".overlap_espera").fadeOut(500, "linear");
					$(".overlap_espera_1").fadeOut(500, function () {
						//Si se pasa un callback se ejecutará al finalizar la animación
						if (callback) {
							$scope.$apply(function () {
								callback(dataCallback);
							});
						}
					});
				}
				return {
					show: show,
					hide: hide
				};
			}])
		.factory('GestionEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					consultarActividadesCiiuSolicitadas: function (idEir) {
						return MyHttp.myHttp(
								root + "eir/consultarActividadesCiiuSolicitadas/" + idEir,
								'GET',
								{}
						);
					},
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					listarActividades: function () {
						return MyHttp.myHttp(
								root + "eir/consultarActividadesCiiu",
								'GET',
								{}
						);
					},
					mostrarVisitas: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/consultarVisitasSolicitadas/" + idsolicitud,
								'GET',
								{}
						);
					},
					consultaRadicados: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/consultarRadicados/" + idsolicitud,
								'GET',
								{}
						);
					},
					consultaRespuestaCiiu: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/consultarRespuestaCiiu/" + idsolicitud,
								'GET',
								{}
						);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
				};
			}])
		.factory('InformacionEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					retornaIdSolicitudPadre: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/retornasolicitudpadre/" + idsolicitud,
								'GET',
								{}
						);
					},
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/informacion/" + idsolicitud,
								'GET',
								{}
						);
					},
					mostrarVisitas: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/consultarVisitasSolicitadas/" + idsolicitud,
								'GET',
								{}
						);
					},
					consultaRadicados: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/consultarRadicados/" + idsolicitud,
								'GET',
								{}
						);
					},
					consultaRespuestaCiiu: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/consultarRespuestaCiiu/" + idsolicitud,
								'GET',
								{}
						);
					},
					consultaRoles: function () {
						return MyHttp.myHttp(
								root + "eir/consultarRoles",
								'GET',
								{}
						);
					},
					consultaTipoSolicitud: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/consultatiposolicitud",
								'POST',
								datosFormulario
								);
					},
				};
			}])
		.factory('ResolucionEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {
				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/resolucion/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/resolucion/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					ListarClasesResolucion: function () {
						return MyHttp.myHttp(
								root + "eir/resolucion/listarclaseresolucion",
								'GET',
								{}
						);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/resolucion/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
					ListarRevisor: function () {
						return MyHttp.myHttp(
								root + "eir/consultarevisor",
								'GET',
								{}
						);
					},
					previsualizarPlantilla: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/resolucion/previsualizarplantilla",
								'GET',
								datosFormulario
								);
					},
				};
			}])
		.factory('VisitaTecnicaEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/visitatecnica/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/visitatecnica/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					listarInfracciones: function () {
						return MyHttp.myHttp(
								root + "eir/visitatecnica/listarInfracciones",
								'GET',
								{}
						);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/visitatecnica/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
				};
			}])
		.factory('VisitaDagmaEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/visitadagma/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/visitadagma/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/visitadagma/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
				};
			}])
		.factory('VisitaSeguridadyJusticiaEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/visitaseguridadyjusticia/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/visitaseguridadyjusticia/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/visitaseguridadyjusticia/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
				};
			}])
		.factory('PendienteGestionaPendienteCiudadanoEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionapendienteciudadano/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionapendienteciudadano/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionapendienteciudadano/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
					previsualizarPlantilla: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionapendienteciudadano/previsualizarplantilla",
								'GET',
								datosFormulario
								);
					},
					ListarRevisor: function () {
						return MyHttp.myHttp(
								root + "eir/consultarevisor",
								'GET',
								{}
						);
					},
				};
			}])
		.factory('PendienteCiudadanoaPendienteGestionEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/pendienteciudadanoapendientegestion/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/pendienteciudadanoapendientegestion/guardardatos/",
								'POST',
								datosFormulario
								);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/pendienteciudadanoapendientegestion/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
				};
			}])
		.factory('PendienteGestionaFirmaEir', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					mostrarSolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionafirma/" + idsolicitud,
								'GET',
								{}
						);
					},
					guardarDatos: function (datosFormulario) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionafirma/cambiarestadoafirma",
								'POST',
								datosFormulario
								);
					},
					validaTiposolicitud: function (idsolicitud) {
						return MyHttp.myHttp(
								root + "eir/pendientegestionafirma/validatiposolicitud/" + idsolicitud,
								'GET',
								{}
						);
					},
				};
			}])
		.factory('CambioRespuestaCiiu', [function () {
				this.respuesta = null;

				return {
					setRespuesta: function (respuesta) {
						this.respuesta = respuesta;
						//console.warn('desde el model: ',respuesta);
					},
					getRespuesta: function () {
						return this.respuesta;
					}
				};
			}])
		.factory("ConsultarSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/consultar_por_identificacion", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		])
		.factory("ActualizarSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/actualizar_solicitante", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		])
		.factory("CrearSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/crear_solicitante", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		])
		.factory("CrearUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/crear", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		])
		.factory("MostrarSolicitudEir", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "eir/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		])
		.factory("ConfirmarDatosEir", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "eir/confirmardatos/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false}
				});
			}
		])
		.factory("ListarActividadesCiiu", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "eir/consultarActividadesCiiu", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'},
				});
			}
		])
		.factory("ListarActividadesCiiuSolicitadas", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "eir/consultarActividadesCiiuSolicitadas/:idEir", {idEir: '@idEir'}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		])
		.factory('MyHttp', ['$q', '$http', 'root', function ($q, $http, root) {
				function fnError(defered, errorHttp) {
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
					defered.reject({status: errorHttp.status, msg: msg, success: false});
				}

				function fnSuccess(defered, response) {
					var data = response.data;
					if (data.success) {
						defered.resolve(data);
					} else {
						defered.reject(data);
					}
				}

				function myHttp(ruta, method, params) {
					var defered = $q.defer();
					//var ruta = root + 'fnomenclatura/buscarnpn';
					var config = {
						url: ruta,
						method: method,
						transformResponse: function (data, headersGetter, status) {
							try {
								return angular.fromJson(data);
							} catch (error) {
								return {success: false, msg: 'Error de respuesta, se espera un JSON.'}
							}
						}
					};
					if (method == 'GET') {
						config.params = params;
					} else {
						config.data = params;
					}
					$http(config)
							.then(
									function (response) {
										fnSuccess(defered, response);
									},
									function (error) {
										fnError(defered, error);
									}
							);
					return defered.promise;
				}

				return {
					myHttp: myHttp
				}

			}])