saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("asignarvisita-controlinfraestructura", {
            url: "/controlinfraestructura/asignarvisita",
            views: {
                "main": {
                    controller: "AsignarVisitaControlInfraestructuraCtrl",
                    templateUrl: "../bundles/ControlInfraestructuraBundle/asignarvisita/asignarvisita.tpl.html"
                }
            }
        });
    }
]).controller("AsignarVisitaControlInfraestructuraCtrl", ["$scope", "$http", "Licencia", "LoadingOverlap", "$stateParams", "root",
    function ($scope, $http, LicenciaAll, LoadingOverlap, $stateParams, root) {
        $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.busqueda = [];
        $scope.rowActive = '';
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {
                type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
                values: [
                    { 'icon': '<i class="ver-detalle fa fa-pencil-square-o  pull-left" title="Crear Solicitud de Visita Control Posterior"></i>', action: 'crearSolicitudVisitaControlPosterior' },
                    { 'icon': '<i class="ver-detalle fa fa-plus-square pull-left" title="Ver Detalle de la licencia"></i>', style: 'text-danger', action: 'activarDetalle' },
                ]
            },
            { type: 'text', name: 'licencia', name2: '', title: 'Nro Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '5%' },
            { type: 'text', name: 'identificacionpropietario', name2: '', title: 'Autorizacion UAESP', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '5%' },
            { type: 'text', name: 'propietario', title: 'Propietario', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '40%' },
            { type: 'text', name: 'direccion', title: 'Direccion', header_align: 'text-center', body_align: 'text-center', input: false, width: '20%' },
            { type: 'text', name: 'comuna', title: 'Comuna', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
            { type: 'text', name: 'tipo', title: 'Tipo', header_align: 'text-center', body_align: 'text-center', input: false, width: '20%' },
            { type: 'text', name: 'estado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
            { type: 'text', name: 'fecha_solicitud', title: 'Fecha Solicitud', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
        ];

        $scope.consultarCuradurias = function () {
            $http.get(root + 'app_dev.php/licencias/curaduria/').then(function (data) {
                console.log(data);

                $scope.arrayCuradurias = data.data;
            });
        };
        $scope.consultarCuradurias();



        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};

            $scope.validator.alert.content = data.msg + ' <a href="#!/controlpolicivo/verificarlicencia" ><i class="fa fa-file-text" aria-hidden="true"></i> Volver a lista</a>';

            if (data.success === true) {
                $scope.validator.alert.type = 'alert-success';
                $scope.validator.alert.title = "Exito: ";
            } else {
                $scope.validator.alert.type = 'alert-danger';
                $scope.validator.alert.title = "Advertencia: ";
            }
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };

        $scope.actualizarDatos = function (page) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            var request = [{ 'name': 'currentPage', 'value': page },
            { 'name': 'numPerPage', 'value': $scope.numPerPage },
            { 'name': 'orderBy', 'value': $scope.orderBy }
            ];
            request.push({ 'name': 'identificacionpropietario', 'value': $scope.busqueda.identificacionpropietario });
            request.push({ 'name': 'propietario', 'value': $scope.busqueda.nombrepropietario });
            request.push({ 'name': 'curaduria', 'value': $scope.busqueda.curaduria });
            request.push({ 'name': 'direccion', 'value': $scope.busqueda.direccion });
            request.push({ 'name': 'catastral', 'value': $scope.busqueda.catastral });
            request.push({ 'name': 'licencia', 'value': $scope.busqueda.licencia });
            request.push({ 'name': 'estado', 'value': 'ejecutoriada' });
            request.push({ 'name': 'matriculainmobiliaria', 'value': $scope.busqueda.matriculainmobiliaria });
            LicenciaAll.get(request)
                .$promise.then(function (response) {
                    $scope.data = response['data'];
                    $scope.totalItems = response['totalItems'];
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                });
        };

        $scope.ordenarPor = function (name) {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }

        $scope.caller = function (funcion, item) {
            $scope.$eval(funcion).call([], item);
        };

        $scope.activarDetalle = function (item) {
            if ($scope.rowActive !== item.id) {
                $scope.rowActive = item.id;
            } else {
                $scope.rowActive = 0;
            }
        };

        $scope.crearSolicitudVisitaControlPosterior = function (item) {
            bootbox.confirm("Confirma que desea crear una visita de control posterior para el predio ubicado en la dirección " + item.direccion + "?",
                function (result) {
                    if (result) {
                        LoadingOverlap.show($scope);
                        $http.post(root + "controlposterior/crearsolicitudvisita/" + item.id).then(function (result) {
                            LoadingOverlap.hide($scope);
                            if (result.data.success == true) {
                                // Licencia.documentoExpediente = null;
                            }
                            bootbox.alert({
                                message: result.data.msg,
                                size: 'small'
                            });
                        });
                    }
                });
        }

    }
]);
