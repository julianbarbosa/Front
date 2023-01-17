saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-solicitarpedagogia", {
            url: "/controlpolicivo/solicitarpedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoSolicitarPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/solicitarPedagogia/solicitarPedagogia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoSolicitarPedagogiaCtrl", ["$scope", "Upload", "TipoSolicitudSIG", "$timeout", "$state", 
    function ($scope, Upload, TipoSolicitudSIG, $timeout, $state) {        

        $scope.tiposSolicitud = TipoSolicitudSIG.query();                
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
    }
]);
