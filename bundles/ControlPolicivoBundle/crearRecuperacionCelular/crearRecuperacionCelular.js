saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-crear-recuperacion-celular", {
            url: "/controlpolicivo/registrarrecuperacioncelular",
            views: {
                "main": {
                    controller: "ControlPolicivoCrearRecuperacionCelularCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/crearRecuperacionCelular/crearRecuperacionCelular.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoCrearRecuperacionCelularCtrl", ["$scope", "root", "$http", "Hora", "Tercero", "Comuna", "Corregimiento","TipoDocIdentificacion", "Ciudad", "ComportamientoContrario", "dsJqueryUtils", "Upload",
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

        $scope.getMarcas = function() {
            $http.get(root+'controlpolicivo/dispositivomarca')
            .then(function (response) {
                $scope.marcas = response.data.data;
            });
        }
        $scope.getMarcas();

        $scope.getPropietario = function (viewValue) {
            if(viewValue!==undefined) {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                return Tercero.query({"clave": viewValue}).
                    $promise.then(function (response) {
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");
                        return response.map(function (item) {
                        console.log(item);
                            $scope.recuperacion.propietario = item;
                            return item;
                        });
                    });
            }
            
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
            $http.post(root+'controlpolicivo/recuperacioncelular',{ data: $scope.recuperacion  })
            .then(function (response) {
                $scope.result = response.data;
                callback(response.data);
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                if (response.data.success) {
                    $scope.recuperacion = {};
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
