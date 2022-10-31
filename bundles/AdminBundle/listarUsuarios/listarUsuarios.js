saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state("listarUsuarios", {
			url: "/admin/listarusuarios",
			views: {
				"main": {
					controller: "listarUsuariosCtrl",
					templateUrl: "../bundles/AdminBundle/listarUsuarios/listarUsuarios.tpl.html"
				}
			}
		});
	}
])
		.controller('ModalCtrl', ['$scope', '$uibModalInstance', 'DataModal', function ($scope, $modalInstance, DataModal) {
				$scope.mensaje = DataModal.mensaje;
				$scope.titulo = DataModal.titulo;

				$scope.close = function () {
					$modalInstance.dismiss('cerrar');
					window.location.href = "https://planeacion.cali.gov.co/saul/";
				};
			}])



		.controller("listarUsuariosCtrl", ["$scope", "listarUsuarios", "ConsultarSolicitante", "desactivarUsuario", "activarUsuario", "listarGruposxUsuario", '$uibModal',
			function ($scope, listarUsuarios, ConsultarSolicitante, desactivarUsuario, activarUsuario, listarGruposxUsuario, $modal) {

				$scope.alert = {};
				$scope.alert.msg = '';

				$scope.closeAlert = function () {
					$scope.alert.msg = '';
				};

				$scope.AccionVentana = {};
				$scope.currentPage = 1;
				$scope.numPerPage = 10;
				$scope.maxSize = 5;
				$scope.rowWarning = 'estaEnviado';
				$scope.orderBy = 'id';
				$scope.headers = [
					{type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
						values: [
							{
								'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Editar Usuario"></i>',
								'click': 'actualizarUsuario'
							},
							{
								'icon': '<i class="ver-detalle fa fa-lock" title="Ver Grupos y Permisos Asociados al Usuario"></i>',
								'click': 'verGrupos'
							},
						],
						options: [
							{
								'value': "0", //Pendiente Por Aprobación
								'nameValidate': 'isActive',
								'icon': '<i class="fa fa-user text-danger" title="Activar Usuario"></i>',
								'click': 'activarusuario'
							},
							{
								'value': "1", //Pendiente Por Aprobación
								'nameValidate': 'isActive',
								'icon': '<i class="fa fa-user text-success" title="Desactivar Usuario"></i>',
								'click': 'desactivarusuario'
							},
						],
					},
					{type: 'text', name: 'id', name2: '', title: 'Id', header_align: 'text-center', body_align: 'text-center', width: '5%'},
					{type: 'text', name: 'firstName', title: 'Nombres', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '15%'},
					{type: 'text', name: 'lastName', title: 'Apellidos', header_align: 'text-center', body_align: 'text-center', width: '15%'},
					{type: 'text', name: 'emailAddress', title: 'Email', header_align: 'text-center', body_align: 'text-center', width: '15%'},
					{type: 'text', name: 'numidentificacion', title: 'Num.Identificación', header_align: 'text-center', body_align: 'text-center', width: '10%'},
					{type: 'text', name: 'username', title: 'UserName', header_align: 'text-center', body_align: 'text-center', width: '10%'},
					{type: 'text', name: 'telefono', title: 'Telfono', header_align: 'text-center', body_align: 'text-center', width: '10%', input: false},
					{type: 'date', name: 'lastLogin', title: 'Último Acceso', header_align: 'text-center', body_align: 'text-center', width: '10%', input: false},
				];

				$scope.actualizarDatos = function ()
				{
					var request = [{'name': 'currentPage', 'value': $scope.currentPage},
						{'name': 'numPerPage', 'value': $scope.numPerPage},
						{'name': 'orderBy', 'value': $scope.orderBy}
					];
					for (header in $scope.headers) {
						if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
							request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
						}
					}
					listarUsuarios.get(request).$promise.then(function (response) {
						$scope.data = response['data'];
						$scope.totalItems = response['totalItems'];
						if (response['msg']) {
							$scope.msg = response['msg'];
							$scope.success = response['success'];
							$scope.openModalError("Error", $scope.msg);
							//alert($scope.msg);
						}
					});



				};

				$scope.actualizarDatos();

				$scope.ordenarPor = function (name)
				{
					$scope.orderBy = name;
					$scope.actualizarDatos();
				}

/////
				$scope.caller = function (item, row) {
					$scope.$eval(item['click']).call([], item, row);
				};

				$scope.desactivarusuario = function (item, row) {
					desactivarUsuario.get(row).$promise.then(function (response) {
						if (response.success) {
							$scope.alert = {
								msg: 'Se cambio el estado exitosamente',
								sucess: true,
								type: 'success'
							};
							$scope.actualizarDatos();
						} else {
							$scope.alert = {
								msg: 'No se hicieron cambios',
								sucess: false,
								type: 'warning'
							};
							$scope.actualizarDatos();
						}
					});
				};

				$scope.activarusuario = function (item, row) {
					activarUsuario.get(row).$promise.then(function (response) {
						if (response.success) {
							$scope.alert = {
								msg: 'Se cambio el estado exitosamente',
								sucess: true,
								type: 'success'
							};
							$scope.actualizarDatos();
						} else {
							$scope.alert = {
								msg: 'No se hicieron cambios',
								sucess: false,
								type: 'warning'
							};
							$scope.actualizarDatos();
						}
					});
				};

				$scope.actualizarUsuario = function (item, row) {
					$scope.usuario = row;
					$scope.openModal('lg', 'update');
				};

				$scope.crearUsuario = function () {
					$scope.usuario = {};
					$scope.openModal('lg', 'create');
				};

				$scope.verGrupos = function (item, row) {
					$scope.grupo = {};
					listarGruposxUsuario.get(row).$promise.then(function (response) {
						if (response.success) {
							if (response.data.length > 0) {
								var modalInstance = $modal.open({
									templateUrl: '../bundles/AdminBundle/listarGrupos/listarGrupos.tpl.html',
									controller: 'listarGruposCtrl',
									size: 'lg',
									resolve: {
										Usuario: function () {
											return row;
										}
									}
								}).closed.then(function () {

								});
							} else {
								$scope.alert = {
									msg: 'No Hay Grupos Asociados al usuario',
									sucess: false,
									type: 'warning'
								};
							}
						} else {
							$scope.alert = {
								msg: response.msg,
								sucess: false,
								type: 'warning'
							};
							$scope.actualizarDatos();
						}
					});
				};

				$scope.openModal = function (size, action) {
					$scope.AccionVentana.type = action;
					var modalInstance = $modal.open({
						templateUrl: '../bundles/AdminBundle/listarUsuarios/crearUsuario.tpl.html',
						controller: 'sfUserController',
						size: size,
						resolve: {
							Usuario: function () {
								return $scope.usuario;
							},
							AccionVentana: function () {
								return $scope.AccionVentana;
							}
						}
					}).closed.then(function () {
						if ($scope.AccionVentana.value == 'created' || $scope.AccionVentana.value == 'updated') {
							$scope.actualizarDatos();
						}
					});
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
				};

				$scope.openModalError = function (titulo, mensaje) {
					$scope.datosModal = {
						mensaje: mensaje,
						titulo: titulo
					};

					var modalInstance = $modal.open({
						templateUrl: "../bundles/AdminBundle/listarUsuarios/modal.tpl.html",
						controller: 'ModalCtrl',
						size: 'md',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							DataModal: function () {
								return $scope.datosModal;
							}
						}
					}).closed.then(function () {
						//alert('Callback ejecutado');
						//console.warn($scope.datosModal);
					});
				};
			}
		]);
