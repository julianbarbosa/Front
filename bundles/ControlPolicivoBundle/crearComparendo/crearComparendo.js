saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-crearComparendo", {
            url: "/controlpolicivo/crearcomparendo",
            views: {
                "main": {
                    controller: "ControlPolicivoCrearComparendoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/crearComparendo/crearComparendo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoCrearComparendoCtrl", ["$scope", "root", "$http", "Hora", "Tercero", "Comuna", "Corregimiento","TipoDocIdentificacion", "Ciudad", "ComportamientoContrario", "dsJqueryUtils", "Upload",
    function ($scope, root, $http, Hora, Tercero, Comuna, Corregimiento, TipoDocIdentificacion, Ciudad, ComportamientoContrario, dsJqueryUtils, Upload) {
        $scope.Comparendo = {};
        TipoDocIdentificacion.query().$promise.then(function (response) {
            $scope.arrayTipoDocIdentificacion = response;
        });
        var date = new Date();
        $scope.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        //fecha comparendo
        $scope.popup1 = {
            opened: false,
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.options1 = {
            maxDate: new Date()
        };

        //fecha pago recibo
        $scope.popup2 = {
            opened: false,
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.options2 = {
            maxDate: $scope.lastDay
        };

        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };

        $scope.hideAlert = function () {
            $scope.validator = {};
        };


        $scope.getComportamientosContrarios = function (viewValue, idPadre) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            return ComportamientoContrario.query({"clave": viewValue, 'idPadre': idPadre}).
                $promise.then(function (response) {
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    if (response.length == 0) {
                       console.log("no encontró resultados");
                    }
                    return response.map(function (item) {
                        return item;
                    });
                });
        };


        $scope.getInfractor = function (viewValue) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            return Tercero.query({"clave": viewValue}).
                $promise.then(function (response) {
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    return response.map(function (item) {
                        $scope.Comparendo.infractor = item;
                        return item;
                    });
                });
        };


        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        }
        ;



        $scope.save = function ()
        {
            dsJqueryUtils.goTop();
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            console.log("url=>"+root+'controlpolicivo/comparendo');
            $http.post(root+'controlpolicivo/comparendo',{ data: $scope.Comparendo, files: $scope.files  })
            .then(function (response) {
                $scope.result = response.data;
                callback(response.data);
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                if (response.data.success) {

                }
                $scope.Comparendo = {};
                $scope.form.$setUntouched();
                $scope.form.$setPristine();
            });
        };

        $scope.cancel = function () {
        };
    }
]);
