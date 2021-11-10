saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("informe-diario-por-tipo-solicitud", {
            url: "/informe/diario_por_tipo_solicitud",
            views: {
                "main": {
                    controller: "diarioPorTipoSolicitudCtrl",
                    templateUrl: "../bundles/InformesBundle/diarioPorTipoSolicitud/diarioPorTipoSolicitud.tpl.html"
                }
            }
        });
    }
]).controller("diarioPorTipoSolicitudCtrl", ["$scope", "Upload", "TipoSolicitud", "$timeout", "$state", 
    function ($scope, Upload, TipoSolicitud, $timeout, $state) {        

        $scope.tiposSolicitud = TipoSolicitud.query();                
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
            Upload.upload({
                url: 'sig/buscar',
                data: {
                    data: $scope.data
                }
            }).then(function (response) {
                $scope.result = response.data;
                callback(response.data);
                if (response.data.success) {
                    $scope.data = {};
                }                
            });
        };
        
        $scope.cancel = function () {
        };
        
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.popup1 = {
            opened: false
        };
        
    }
]);
