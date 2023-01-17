saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registro-mercantil-listar", {
            url: "/registro-mercantil/listar/:id",
            views: {
                "main": {
                    controller: "RegistroMercantilListarCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/listarRegistroMercantil/listarRegistroMercantil.tpl.html"
                }
            }
        });
        $stateProvider.state("rit-listar", {
            url: "/rit/listar/:id",
            views: {
                "main": {
                    controller: "RegistroMercantilListarCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/listarRegistroMercantil/listarRegistroMercantil.tpl.html"
                }
            }
        });
    }
]).controller("RegistroMercantilListarCtrl", ["$scope", "root", "$http", 'DevolverSolicitud', "$stateParams",
    function ($scope, root, $http, DevolverSolicitud, $stateParams) {
        $scope.currentPage = 1;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.actualizandoDatos = false;
        $scope.detalleRit = '';
       
        console.log("rit",$stateParams.id);

        if( $stateParams.id == 'rm') {
            $scope.titulo = "Registros Mercantiles";
        } else if($stateParams.id == 'rit') {
            $scope.titulo = "Registros de Información Tributaria - RIT";
            $scope.detalleRit = { 'icon': '<i class="fa fa-file-pdf-o" title="Clic para ver el detalle"></i>', 'link': '../../saul2/app_dev.php/registromercantil/rit/formulario/' };
        }
        $scope.query = {
            filter: [],
            limit: 10,
            page: 1,
            column: '',
            comunas: ''
        };


        $scope.headers = [
            {
                type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [

                    { 'icon': '<i class="fa fa-search" title="Clic para ver el detalle"></i>', 'link': '#!/registro-mercantil/consultar/' },
                    $scope.detalleRit
                ],
            },
            { type: 'text', name: 'id', name2: '', title: 'Num Interno', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%' },
            { type: 'text', name: 'identificador', name2: '', title: 'Identificador', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%' },
            { type: 'text', name: 'identificacion', title: 'Identificación', header_align: 'text-center', body_align: 'text-center', sorting: false, input: true },
            { type: 'text', name: 'razonSocial', title: 'Razón Social', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '40%' },
            { type: 'text', name: 'tipoTercero', title: 'Tipo', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '20%' },
            { type: 'date', name: 'fechaMatricula', title: 'Fecha de Matrícula', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%' }
        ];

        $scope.onClickAction = function (item, row) {
            $scope.$eval(item['click']).call([], item, row);
        }

        $scope.buscar = function (keyCode) {
            if (keyCode == 13) {
                $scope.query.page = 1;
                $scope.actualizarDatos();
            }
        };

        $scope.actualizarDatos = function () {
            $scope.query.filter = [];
            if ($scope.actualizandoDatos) {
                return;
            }

            $scope.actualizandoDatos = true;

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            var request = [{ 'name': 'currentPage', 'value': $scope.currentPage },
            { 'name': 'numPerPage', 'value': $scope.numPerPage },
            { 'name': 'orderBy', 'value': $scope.orderBy }
            ];
            console.log($scope.query);
            for (header in $scope.headers) {
                if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                    data = {};
                    data[$scope.headers[header].name] = $scope.headers[header].value;
                    $scope.query.filter.push(data);
                }
            }
            console.info($scope.query);
            $scope.obtenerRegistroMercantil($scope.query);
        };

        $scope.obtenerRegistroMercantil = function (data) {
            console.info("data=>", data);
            $http.post(root + 'integracion/camaracomercio/registromercantil/listar/'+$stateParams.id, data).then(function (response) {
                $scope.data = response.data.data;
                $scope.totalItems = response.data.totalItems;
                $scope.actualizandoDatos = false;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            })
        }


        $scope.actualizarDatos();

        $scope.ordenarPor = function (name) {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        };

        $scope.desactivar = function (id) {
            //console.log("el id es = " + id);
        };

        $scope.parJson = function (json) {
            try {
                return angular.fromJson('[' + json + ']');;
            } catch (e) {
                return null;
            }

        }


    }
]);
