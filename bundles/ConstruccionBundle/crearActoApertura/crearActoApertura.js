saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-acto-apertura", {
            url: "/expediente/crear_acto_apertura/:idsolicitud",
            views: {
                "main": {
                    controller: "CrearActoAperturaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/crearActoApertura/crearActoApertura.tpl.html"
                }
            }
        });
    }
]).controller("CrearActoAperturaCtrl", ["$scope", "$stateParams", "Infraccion", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Infraccion, Upload, $timeout, $state) {
        $scope.visita = {};
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud; 
        $scope.visita.observacion = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        $scope.ocultarModal = true;
        $scope.infracciones = Infraccion.query({});

        $scope.hideAlert = function () {
            $scope.validator = {};
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
        };       

        $scope.save = function () {           
            console.log('actoapertura/generar');
            Upload.upload({                
                url: 'actoapertura/generar',
                data: {
                    data: $scope.proceso
                }
            }).then(function (response) {
                $scope.result = response.data;
                callback(response.data);
                if (response.data.success) {
                    $scope.proceso = {};
                }
                $timeout(function() {                        
                        $state.go('listar-peticion');
                        }, 3000);
            });
        };

        $scope.cancel = function () {
        };
    }
]);
