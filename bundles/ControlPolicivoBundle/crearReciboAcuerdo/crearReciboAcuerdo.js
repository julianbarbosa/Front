saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-CrearReciboAcuerdo", {
            url: "/controlpolicivo/crearreciboacuerdo/:idcomparendo",
            views: {
                "main": {
                    controller: "ControlPolicivoCrearReciboAcuerdoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/CrearReciboAcuerdo/CrearReciboAcuerdo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoCrearReciboAcuerdoCtrl", ["$scope", '$stateParams', "root", "$http", "Comparendo", "Tercero", "Comuna", "Corregimiento","TipoDocIdentificacion", "Ciudad", "ComportamientoContrario", "dsJqueryUtils", "Upload",
    function ($scope, $stateParams,root, $http, Comparendo, Tercero, Comuna, Corregimiento, TipoDocIdentificacion, Ciudad, ComportamientoContrario, dsJqueryUtils, Upload) {
        $scope.recibo = {};
        $scope.recibo.idComparendo = $stateParams.idcomparendo;
        TipoDocIdentificacion.query().$promise.then(function (response) {
            $scope.arrayTipoDocIdentificacion = response;
        });

        Comparendo.query({id:$stateParams.idcomparendo}).$promise.then(function(result) {
            $scope.comparendo = result.data;
            console.log("consultando comparendos");
        });


        $scope.popup1 = {
            opened: false
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
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
            $http.post(root+'controlpolicivo/crearreciboacuerdo',{ data: $scope.recibo  })
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
