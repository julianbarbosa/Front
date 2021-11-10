saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-buscar-recuperacion-celular", {
            url: "/controlpolicivo/buscarrecuperacioncelular",
            views: {
                "main": {
                    controller: "ControlPolicivoBuscarRecuperacionCelularCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/buscarRecuperacionCelular/buscarRecuperacionCelular.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoBuscarRecuperacionCelularCtrl", ["$scope", "root", "$http", "Hora", "Tercero", "Comuna", "Corregimiento","TipoDocIdentificacion", "Ciudad", "ComportamientoContrario", "dsJqueryUtils", "Upload",
    function ($scope, root, $http, Hora, Tercero, Comuna, Corregimiento, TipoDocIdentificacion, Ciudad, ComportamientoContrario, dsJqueryUtils, Upload) {
        $scope.Comparendo = {};
        
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


        $scope.buscarRecuperacionCelular = function () {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $http.get(root+'controlpolicivo/recuperacioncelularporimei/'+$scope.imei)
            .then(function (response) {
                if(response.data.success==true) {
                    $scope.data = response.data.data[0];
                    $scope.data.estado = $scope.data.estado.codigo;
                } else {
                    callback(response.data);
                }                
				$(".overlap_espera").hide();
				$(".overlap_espera_1").hide();
            });
        };

        $scope.save = function () {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $http.post(root+'controlpolicivo/cambiarestado/', {'data': $scope.data})
            .then(function (response) {
                console.log(response.data);
                $scope.data = response.data;
                callback($scope.data);
				$(".overlap_espera").hide();
				$(".overlap_espera_1").hide();
            });
        };



        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};            
            $scope.validator.alert.content = data.msg;
            if(data.success==true) {
                $scope.validator.alert.title = 'Exito ';
                $scope.validator.alert.type = 'success';
            } else {
                $scope.validator.alert.title = 'Advertencia ';
                $scope.validator.alert.type = 'danger';
            }
            

            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        }
        ;



    }
]);
