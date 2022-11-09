saul.config(["$stateProvider",
	function ($stateProvider) {
		$stateProvider.state("listarGrupos", {
			url: "/admin/listargrupos",
			views: {
				"main": {
					controller: "listarGruposCtrl",
					templateUrl: "../bundles/AdminBundle/listarGrupos/listarGrupos.tpl.html"
				}
			}
		});
	}
]).controller("listarGruposCtrl", ["$scope", '$uibModal', 'UsuarioActual', 'listarGruposxUsuario',
	function ($scope, $modal, UsuarioActual, listarGruposxUsuario) {

		$user = {};
		UsuarioActual.query().$promise.then(function (response) {
			$user = response;
			$scope.actualizarDatos();
		});


		$scope.alert = {};
		$scope.alert.msg = '';

		$scope.currentPage = 1;
		$scope.numPerPage = 10;
		$scope.maxSize = 5;
		$scope.rowWarning = 'estaEnviado';
		$scope.orderBy = 'id';
		$scope.headers = [
			{type: 'text', name: 'idgrupo', title: 'IDGrupo', header_align: 'text-center', body_align: 'text-center', width: '10%'},
			{type: 'text', name: 'grupo', title: 'Grupo', header_align: 'left', body_align: 'text-left', sorting: 'sorting', width: '45%'},
			{type: 'text', name: 'permiso', title: 'Permiso', header_align: 'left', body_align: 'text-left', width: '45%'},
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
			request.push({'name': 'usuarioid', 'value': $user.id});
			listarGruposxUsuario.get(request).$promise.then(function (response) {
				$scope.data = response['data'];
				$scope.totalItems = response['totalItems'];
			});
		};

		$scope.ordenarPor = function (name)
		{
			$scope.orderBy = name;
			$scope.actualizarDatos();
		}

	}

]);

