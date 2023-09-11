saul.config(["$stateProvider", function(a) {
    a.state("cerrar-con-archivo-solicitud-lineas", {
        url: "/lineas/cerrar-con-archivo/:idsolicitud",
        views: {
            main: {
                controller: "CerrarConArchivoLineasCtrl",
                templateUrl: "../bundles/LineasBundle/cerrarConArchivo/cerrar.tpl.html"
            }
        }
    })
}]).controller("CerrarConArchivoLineasCtrl", ["$scope", "$http", "root", "UtilForm","$stateParams","Upload",
    function($scope, $http, root, UtilForm,  $stateParams, Upload) {
        
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
        $scope.item = {};
        $scope.root = root;
        $scope.item.idSolicitud = $stateParams.idsolicitud;
        
        $scope.file = '';
        $scope.$on("fileSelected", function (event, args) {              
            $scope.file = args.file;            
        });
        
        $scope.save = function(cerrar) {
            if($scope.files.respuesta.$valid==true) {
                if(cerrar===1) {
                    bootbox.confirm("Confirma que desea realizar esta acción?",
                    function (result) {
                        if (result) {                        
                             $scope.guardar();
                        }
                    });            
                } else {
                    $scope.guardar(0);
                }
            } else {
                bootbox.alert("Para guardar debe cargar un archivo de respuesta.");
            }
        };
        
       
        
        $scope.guardar = function() {
            $scope.iniciarEspera();
            Upload.upload({
                method: 'post',
                url: root+'linea/responerpdf',  
                data: {
                    idSolicitud: $scope.item.idSolicitud,
                    files: $scope.files
                }
            }).then(function (response) {
                $scope.finalizarEspera();
                $scope.result = response.data;
                callback(response.data);                
                $scope.item = [];
                $scope.isSuccess = true;
            });   
        }
    }])
