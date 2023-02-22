saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state('editar-eir', {
			url: '/eir/solicitar_eir/{tipoUsuario}',
			views: {
				main: {
					controller: 'SolicitarEirCtrl',
					templateUrl: '../bundles/EirBundle/solicitarEir/solicitarEir.tpl.html'
				}
			}
		})
				.state("ListarActividadesCiiu", {
					url: "/eir/consultarActividadesCiiu",
					views: {
						"main": {
							controller: "ListarActividadesCiiuCtrl",
							templateUrl: '../bundles/EirBundle/solicitarEir/solicitarEir.tpl.html'
						}
					}
				});
	}])
		.directive('tagManager', [function () {
				return {
					restrict: 'E',
					scope: {
						tags: '=',
						autocomplete: '=autocomplete',
						request: '=',
						codigo: '=',
						fecha: '='
					},
					template:
							'<div class="tags" ng-disabled="solicitud.idSolicitud">' +
							'<div ng-disabled="solicitud.idSolicitud" ng-repeat="(idx, tag) in tags" class="tag"><span class="label label-info alert-info">{{ tag.codCiiu +" - "+tag.nombreCiiu }}<a class="close" href ng-click="remove(idx)" data-toggle="tooltip" data-placement="top" title="" data-original-title="Tooltip on top">×</a></span></div>' +
							'</div>' +
							'<div class="input-group"><input type="text" id="buscar" name="actividades" class="form-control" placeholder="Por favor escriba la actividad que desea buscar" ng-disabled="solicitud.idSolicitud" ng-model="newValue" /> ' +
							'<span class="input-group-btn"><a class="btn btn-default" ng-disabled="solicitud.idSolicitud" ng-click="add()" id="botonbuscar">Agregar</a></span></div>',
					link: function ($scope, $element) {
						$scope.seleccionados = [];

						var input = angular.element($element).find('input');
						// setup autocomplete
						if ($scope.autocomplete) {
							$scope.autocompleteFocus = function (event, ui) {
								input.val(ui.item.value);
								return false;
							};
							$scope.autocompleteSelect = function (event, ui) {
								$scope.newValue = ui.item.value;
								$scope.$apply($scope.add);
								return false;
							};
							$($element).find('input').autocomplete({
								minLength: 0,
								source: function (request, response) {
									var item;
									var itemMostrar;
									return response((function () {
										var _i, _len, _ref, _results;
										_ref = $scope.autocomplete;
										_results = [];
										for (_i = 0, _len = _ref.length; _i < _len; _i++) {

											item = _ref[_i].codCiiu + " - " + _ref[_i].nombreCiiu + " - " + _ref[_i].palabraClave;
											itemMostrar = _ref[_i].codCiiu + " - " + _ref[_i].nombreCiiu;
											if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
												_results.push(itemMostrar);
											}
										}
										return _results;
									})());
								},
								focus: (function (_this) {
									return function (event, ui) {
										return $scope.autocompleteFocus(event, ui);
									};
								})(this),
								select: (function (_this) {
									return function (event, ui) {

										var str = ui.item.value;
										var codCiiu = str.split(" - ");
										//console.warn($scope.autocomplete);
										var indice = $scope.autocomplete.findIndex(function (element) {
											//console.warn(element.codCiiu==codCiiu[0]);
											return element.codCiiu == codCiiu[0] && element.nombreCiiu == codCiiu[1];
										});
										//console.warn("Encontramos a: ", $scope.autocomplete[indice]);

										//alert(codCiiu[0]);
										//console.log(ui.item.value);
										//$scope.save(ui.item.value);
										$('#botonbuscar').attr("disabled", false);
										return $scope.autocompleteSelect(event, ui);
									};
								})(this)
							});
						}
						$scope.areaxactividades = 0;
						// adds the new tag to the array
						$scope.add = function () {
							$('#areaxactividades').val("");							
							var codCiiu = $scope.newValue.split(" - ");
							var indice = $scope.autocomplete.findIndex(function (element) {
								//console.warn(element.codCiiu==codCiiu[0]);
								if (element.observacion == "null") {
									console.warn("es nulo");
								}
								return element.codCiiu == codCiiu[0] && element.nombreCiiu == codCiiu[1];
							});
							//console.warn($scope.tags);
							//console.warn("Encontramos a: ", $scope.autocomplete[indice]);
							// if not dupe, add it
							if ($('#buscar').val() == "") {
								$('#areaxactividades').val("");
								$('#botonbuscar').attr("disabled", true);
							}
							if ($('#buscar').val() != "") {
								//if ($scope.tags.indexOf($scope.newValue) == -1) {
								//console.warn("El nuevo valor es ...", $scope.newValue);

								if ($scope.tags.findIndex(function (element) {
									return element.codCiiu == $scope.autocomplete[indice].codCiiu && element.nombreCiiu == $scope.autocomplete[indice].nombreCiiu;
								}) == -1) {
									$scope.tags.push($scope.autocomplete[indice]);
									var str = $scope.newValue;
									var respuesta = str.split("-");
								}

								/*if ($scope.tags.indexOf($scope.newValue) == -1) {
								 $scope.tags.push($scope.newValue);
								 
								 var str = $scope.newValue;
								 var respuesta = str.split("-");
								 
								 //alert(respuesta[2]);
								 }*/
								$('#areaxactividades').val("");
								$scope.newValue = "";
							}
						};
						// remove an item
						$scope.remove = function (idx) {
							$scope.tags.splice(idx, 1);
							
							$('#areaxactividades').val("");
							$scope.areaxactividades = "";
							
							$('#tiposolicitud').val("");
							$('#botonbuscar').attr("disabled", true);
						};
						// capture keypresses
						input.bind('keypress', function (event) {
							// enter was pressed
							if (event.keyCode == 13) {
								$scope.$apply($scope.add);
							}
						});
					}
				};
			}])


		.controller('SolicitarEirCtrl',
				['$scope', '$resource', '$state', '$stateParams', '$filter', '$uibModal', 'MostrarSolicitudEir', 'ConsultarSolicitante', 'CrearSolicitudAsigNomenclatura', 'Comuna', 'root', 'PluginNomenclatura', 'Nomenclaturax', 'ActualizarSolicitudAsigNomenclatura', 'ConfirmarDatosEir', 'Upload', 'ListarActividadesCiiu', 'InformacionEir', 'UtilForm',
					function ($scope, $resource, $state, $stateParams, $filter, $modal, MostrarSolicitudEir, ConsultarSolicitante, CrearSolicitudAsigNomenclatura, ComunaFactory, root, PluginNomenclatura, Nomenclaturax, ActualizarSolicitudAsigNomenclatura, ConfirmarDatosEir, Upload, ServicioListarActividadesCiiu, InformacionEir, UtilForm) {

						$scope.selectedDoc = [
							{
								id: 1,
								nombre: "Planos",
								value: false
							},
							{
								id: 2,
								nombre: "CD's",
								value: false
							},
							{
								id: 3,
								nombre: "Usb",
								value: false
							},
							{
								id: 4,
								nombre: "Anexos",
								value: false
							},
							{
								id: 5,
								nombre: "Otros",
								value: false
							}
						];

						$scope.ciiu = function () {
							$scope.tags = [];
							$scope.allTags = [];
							var request = {'currentPage': 1,
								'numPerPage': 600, //aqui se carga la lista completa para hacer la busqueda
								'maxSize': 10,
								'orderBy': 'codCiiu'
							};
							$scope.request = request;
							ServicioListarActividadesCiiu
									.get(request)
									.$promise
									.then(function (response) {
										for (var i in response.alldata) {
											$scope.allTags.push(response.alldata[i]);
										}
									});
						};
						$scope.tags = [];
						$scope.allTags = [];
						$scope.data = $stateParams;
						$scope.currentPage = 1;
						$scope.numPerPage = 20;
						$scope.maxSize = 10;
						$scope.rowWarning = 'estaEnviado';
						$scope.orderBy = 'codCiiu';
						$scope.actualizarDatos = function ()
						{
							var request = {'currentPage': $scope.currentPage,
								'numPerPage': $scope.numPerPage,
								'orderBy': $scope.orderBy
							};
							for (header in $scope.headers) {
								if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
									request[$scope.headers[header].name] = $scope.headers[header].value;
								}
							}

						};
						$scope.ciiu();
						$scope.actualizarDatos();
						$('#botonbuscar').attr("disabled", true);
						$scope.ordenarPor = function (name)
						{
							$scope.orderBy = name;
							$scope.actualizarDatos();
						}

						$scope.alerts = [];
						$scope.closeAlert = function (index) {
							$scope.alerts.splice(index, 1);
						};
						$scope.resetInputFile = function () {
							$('#clear_btn_dom').trigger('click');
						};
						$scope.initInputFile = function () {
							//console.warn($('#input_file'));
							$('#input_file').pixelFileInput(
									{
										placeholder: 'Ningún archivo seleccionado...',
										choose_btn_tmpl: '<a href="#" class="btn btn-xs btn-primary">Seleccionar</a>',
										clear_btn_tmpl: '<a id="clear_btn_dom" href="#" class="btn btn-xs"><i class="fa fa-times"></i> Limpiar</a>'
									}
							);
						};
						$scope.eliminarArchivo = function (index) {
							$scope.files.splice(index, 1);
						};
						//files
						$scope.files = [];
						$scope.$on("fileSelected", function (event, args) {
							$scope.$apply(function () {
								if (args.file.type != 'application/pdf') {
									$scope.alerts.push({msg: 'El archivo "' + args.file.name + '" no está en formato PDF.'});
								} else if (args.file.size > 2097152) {
									$scope.alerts.push({msg: 'El archivo "' + args.file.name + '" tiene un tamaño mayor a 2M.'});
								} else {
									$scope.files.push(args.file);
								}
							});
						});
						//files

						$scope.start = function () {
							$scope.init($stateParams.IdSolicitud);

						};
						//Inicializando la aplicación
						$scope.init = function (idSolicitud) {

							$scope.initInputFile();
							$scope.funcionario = $stateParams.tipoUsuario == 'funcionario';
							$scope.mostrarFormSolicitud = !$scope.funcionario;
							$scope.estado = 'creacion';
							$scope.impreso = false;
							$scope.messageErrorCliente = '';
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
							if (typeof idSolicitud != 'undefined') {
								$scope.cargarSolicitud(idSolicitud);
							}
						};
						$scope.cargarSolicitud = function (idSolicitud) {

							$(".overlap_espera").show();
							$(".overlap_espera_1").show();
							MostrarSolicitudEir.get({
								idsolicitud: idSolicitud
							}).$promise.then(
									function (response) {
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										if (response.success) {
											if (!(response.data.solicitud.estado.codigo == 'pendiente' || response.data.solicitud.estado.codigo == 'preradicada')) {
												alert("La solicitud está en estado " + response.data.solicitud.estado.nombre);
												//$state.go('solicitar_eir', {tipoUsuario: $stateParams.tipoUsuario});
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
												}
											}
										} else {
											alert(response.msg);
											//$state.go('solicitar_eir', {tipoUsuario: $stateParams.tipoUsuario});
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
							var url = root + 'eir/impresionpdf/' + $scope.solicitud.idSolicitud;
							var method = "POST";
							var datos = [{
									name: 'documentos',
									value: JSON.stringify($scope.selectedDoc)
								}];
							console.warn(datos);
							UtilForm.openWith(url, method, datos);
							//window.open(root + 'eir/impresionpdf/' + $scope.solicitud.idSolicitud);
						};
						$scope.guardarCambios = function () {
							$scope.impreso = false;
							$scope.actualizarSolicitud();
						};
						$scope.confirmar = function () {
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();
							$scope.solicitudEnviada.files = $scope.files;
							Upload.upload({
								url: root + "eir/confirmardatos/" + $scope.solicitud.idSolicitud,
								data: $scope.solicitudEnviada,
								transformResponse: function (json, headerGetter) {
									return angular.fromJson(json);
								}
							}).then(
									function (response) {

										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										if (response.data.success) {
											bootbox.alert("Solicitud confirmada correctamente, se agregaron los anexos correspondientes",
													function (result) {
														$scope.init($scope.solicitud.idSolicitud);
														//listar tareas.
														$state.go('solicitud-listar-tareas', {tipoUsuario: 'funcionario'});
														$(".overlap_espera").fadeOut(500, "linear");
														$(".overlap_espera_1").fadeOut(500, "linear");
													});
										} else {
											//console.error(error);
											alert(response.data.msg);
										}
									});
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
							//Abrimos el overlap de carga
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();
							$scope.solicitud.idsolicitante = $scope.cliente.id;
							$scope.solicitudEnviada = angular.copy($scope.solicitud);
							$scope.solicitudEnviada.files = $scope.files;
							$scope.solicitudEnviada.idciiu = $scope.tags;
							$scope.solicitudEnviada.documentos = $scope.selectedDoc;
							if (typeof $scope.solicitud.npn == 'undefined') {
								alert('El campo de dirección existente está vacío.');
								return;
							}

							Upload.upload({
								url: root + 'eir/crearSolicitud',
								data: $scope.solicitudEnviada,
								transformResponse: function (json, headerGetter) {
									return angular.fromJson(json);
								}
							}).then(
									function (resp) {
										response = resp.data;
										$scope.files.length = 0;
										$scope.resetInputFile();
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear", function () {
											//console.warn('Response es ', response);
											if (response.success) {
												alert('Se ha generado la solicitud ' + response.data.idsolicitud + '.');
												$scope.estado = 'confirmacion';
												$scope.init(response.data.idsolicitud);
											} else {
												alert('Ha ocurrido un error. ' + response.msg);
											}
										});
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
									}
								});
								//console.warn('OK: ', response.status + ': ' + response.dat);
							}, function (evt) {
								$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
							}
							);
							//console.warn($scope.solicitudEnviada);
							return;
						};
						$scope.actualizarSolicitud = function () {
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							$scope.datosActualizacion = {
								idsolicitud: $scope.solicitud.idSolicitud,
								idpredio: $scope.solicitud.idpredio,
								idnomenclatura: $scope.solicitud.idnomenclatura,
								direccion: $scope.solicitud.direccion,
								npn: $scope.solicitud.npn,
								matriculainmobiliaria: $scope.solicitud.matriculainmobiliaria,
								areapredio: $scope.solicitud.areapredio,
								tiposolicitud: $scope.solicitud.tiposolicitud,
								licenciaconstruccion: $scope.solicitud.licenciaconstruccion,
								numerolicencia: $scope.solicitud.numerolicencia,
								numeropredial: $scope.solicitud.numeropredial,
								curaduriaurbana: $scope.solicitud.curaduriaurbana,
								actividades: $scope.solicitud.actividades,
								descripcionactividades: $scope.solicitud.descripcionactividades,
								areaxactividades: $scope.solicitud.areaxactividades,
								x: $scope.solicitud.x,
								y: $scope.solicitud.y,
								idciiu: $scope.tags
							};
							$scope.datosActualizacion.files = $scope.files;
							Upload.upload({
								url: root + 'asignomenclatura/' + $scope.solicitud.idSolicitud + '/edit',
								data: $scope.datosActualizacion,
								transformResponse: function (json, headerGetter) {
									return angular.fromJson(json);
								}
							}).then(
									function (resp) {
										//console.warn(resp);
										$scope.resetInputFile();
										response = resp.data;
										$(".overlap_espera").fadeOut(500, "linear");
										$(".overlap_espera_1").fadeOut(500, "linear");
										if (response.success) {
											//$scope.urlOrfeo = response.data.urlconsulta;
											$scope.files.length = 0;
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
							$scope.listarArchivosGuardados();
							$scope.solicitud.matriculainmobiliaria = (nuevaSolicitud.matriculainmobiliaria);
							$scope.solicitud.numeropredial = (nuevaSolicitud.numeropredial);
							$scope.solicitud.tiposolicitud = (nuevaSolicitud.tiposolicitud);
							$scope.solicitud.areapredio = (nuevaSolicitud.areapredio);
							$scope.solicitud.licenciaconstruccion = (nuevaSolicitud.licenciaconstruccion);
							$scope.solicitud.numerolicencia = (nuevaSolicitud.numerolicencia);
							$scope.solicitud.curaduriaurbana = (nuevaSolicitud.curaduriaurbana);
							$scope.solicitud.descripcionactividades = (nuevaSolicitud.descripcionactividades);
							$scope.solicitud.areaxactividades = (nuevaSolicitud.areaxactividades);
							$scope.solicitud.npn = (nuevaSolicitud.solicitud.predio.codigounico);
							$scope.solicitud.direccion = (nuevaSolicitud.solicitud.nomenclatura.direccion);
							$scope.solicitud.infoAdicional = (nuevaSolicitud.solicitud.nomenclatura.informacionadicional);
							$scope.solicitud.x = (nuevaSolicitud.x);
							$scope.solicitud.y = (nuevaSolicitud.y);
							$scope.cliente = $scope.solicitud.solicitud.solicitante;
						};
						$scope.actualizarCliente = function () {
							$scope.openModal('md', 'update');
						};
						$scope.openModal = function (size, action) {
							$scope.AccionVentana.type = action;
							var modalInstance = $modal.open({
								templateUrl: '../bundles/EirBundle/solicitarEir/clienteForm.tpl.html',
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
							PluginNomenclatura.obtenerModalIngresoDireccion($scope,
									function (data) {
										if (data.cambio) {
											$scope.solicitud.npn = data.npn;
											$scope.solicitud.direccion = data.direccion + (data.infoAdicional ? ' ' + data.infoAdicional : '');
											$scope.solicitud.idpredio = data.predioId != '' ? data.predioId : null;
											$scope.solicitud.idnomenclatura = data.nomenclaturaId != '' ? data.nomenclaturaId : null;

											Nomenclaturax.getInfoPorNpn(data.npn).then(function (data) {
												$scope.solicitud.areapredio = Math.round(data.predio.area);
												$scope.solicitud.numeropredial = data.predio.numero;
												$scope.solicitud.areaLlena = data.predio.area;
												//console.warn(data);
											}, function (error) {
												console.warn(error);
											}
											);
										}

									},
									function (data) {
										console.log(data);
									})
						};

						$scope.consultaTipoSolicitud = function () {
							$(".overlap_espera").show();
							$(".overlap_espera_1").show();

							var elementos = document.getElementsByName("idciiu");
							var numactividades = elementos.length;
							var actividades = "";

							for (i = 0; i < numactividades; i++) {
								if (actividades !== null) {
									actividades += '&actividad' + i + '=' + $('#idciiu_' + i + '').val();
								}
							}

							var DataForm = {
								actividades: $scope.tags,
								numactividades: numactividades,
								areapredio: $scope.solicitud.areapredio,
								areaxactividades: $scope.solicitud.areaxactividades
							};

							InformacionEir.consultaTipoSolicitud(DataForm)
									.then(
											function (response) {
												$scope.respuesta = response.respuesta;
												$scope.areaxactividades = 1;												
												
												/* if(response.tiposolicitud === 'convencional'){
													$('#usoConvencional').modal('show');
												} */

												$scope.solicitud.tiposolicitud = response.tiposolicitud;

												$(".overlap_espera").hide();
												$(".overlap_espera_1").hide();
											}, function (response) {
										alert(response.msg);
									}
									);

						}

						$scope.haveError = function (value, formCliente) {
							return 	formCliente[value] && formCliente[value].$touched &&
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
						
						$scope.previsualizar = function () {
							$scope.estado = 'creacion';
							var datos = null;
							var elementos = document.getElementsByName("idciiu");
							var numactividades = elementos.length;
							var actividades = "";
							for (i = 0; i < numactividades; i++) {
								if (actividades != null) {
									actividades += '&actividad' + i + '=' + $('#idciiu_' + i + '').val();
								}
							}

							window.open(root + 'eir/previsualizar/?idsolicitante=' + $scope.cliente.id
									+ '&idpredio=' + $scope.solicitud.idpredio
									+ '&idnomenclatura=' + $scope.solicitud.idnomenclatura
									+ '&npn=' + $scope.solicitud.npn
									+ '&direccion=' + $scope.solicitud.direccion
									+ '&matriculainmobiliaria=' + $scope.solicitud.matriculainmobiliaria
									+ '&tiposolicitud=' + $scope.solicitud.tiposolicitud
									+ '&areapredio=' + $scope.solicitud.areapredio
									+ '&licenciaconstruccion=' + $scope.solicitud.licenciaconstruccion
									+ '&numerolicencia=' + $scope.solicitud.numerolicencia
									+ '&curaduriaurbana=' + $scope.solicitud.curaduriaurbana
									+ '&numactividades=' + numactividades
									+ actividades
									+ '&descripcionactividades=' + $scope.solicitud.descripcionactividades
									+ '&areaxactividades=' + $scope.solicitud.areaxactividades
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
