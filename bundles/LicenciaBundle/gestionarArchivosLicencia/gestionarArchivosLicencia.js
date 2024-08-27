saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("licencia-gestionararchivos", {
            url: "/licencia/gestionar-archivos/:id",
            views: {
                "main": {
                    controller: "GestionarArchivosLicenciaCtrl",
                    templateUrl: "../bundles/LicenciaBundle/gestionarArchivosLicencia/gestionarArchivosLicencia.tpl.html"
                }
            }
        });
    }
]).controller("GestionarArchivosLicenciaCtrl", ["$scope", "$http", "$stateParams", "root", "Upload","LoadingOverlap",
    function ($scope, $http, $stateParams, root, Upload, LoadingOverlap) {
        $scope.id = $stateParams.id;
        $scope.root = root;
        $scope.permisos = [];
        $scope.arraytipoArchivo = [{"id":1, "nombre":"Idenfiticación Ciudadano"}, {"id":2, "nombre":"Formulario Unico Nacional"},{"id":3, "nombre":"Certificado de Tradición"}, {"id":4, "nombre":"Pago Impuesto Predial"}, {"id":5, "nombre":"Plano Topográfico Georrefernciado"}, {"id":5, "nombre":"Plano Topográfico Georrefernciado"}, {"id":5, "nombre":"Plano Proyecto Firmado"}, {"id":6, "nombre":"Cetificado de Disponibilidad Servicios Públicos"}, {"id":7, "nombre":"Estudio de Amenaza y Riesgo"}, {"id":8, "nombre":"Plano Proyecto Firmado"}, {"id":9, "nombre":"Respuesta Curaduría (Licencia)"}];
        //$scope.arraytipoArchivo = [{"id":1, "nombre":"Documentos Solicitud"}, {"id":2, "nombre":"Documentos Gestión"},{"id":3, "nombre":"Documentos Finalización"}];
        
        $scope.consultarLicencia = function() {
            LoadingOverlap.show($scope);
            console.log(root);
            $http.get(root+'licencia/consultar/'+$scope.id).then(function(data) {
                $scope.licencia = data.data
                LoadingOverlap.hide($scope);
            });    
                   
        };
        $scope.consultarLicenciaAchivos = function() {
            $http.get(root+'licencia/consultar-archivos/'+$scope.id).then(function(data) {
                $scope.archivosLicencia = data.data.data;
                $(".overlap_espera").hide();   
            });   
        }
        
        $scope.consultarLicencia();
        $scope.consultarLicenciaAchivos();

        $scope.consultarPermisos = function () {
            $scope.permisos = [];            
            $http.get(root+'usuario/permisos',{}).then(function (result) {                
                console.log(result);
                angular.forEach(result.data.permisos, function(value, key) {
                    $scope.permisos[value] = true
                });
                $scope.userId = result.data.id+'';
            });

        };
        $scope.consultarPermisos();
        
        $scope.eliminarArchivo = function(archivo_id) {
            bootbox.confirm("Confirma que desea eliminar el archivo?",
            function (result) {
                if (result) {
                    LoadingOverlap.show($scope);
                    $http.post(root+"licencia/eliminararchivo/"+archivo_id).then(function (result) {
                        LoadingOverlap.hide($scope);
                        if(result.data.success==true) {
                            $scope.consultarLicenciaAchivos();
                        }
                        bootbox.alert({
                            message: result.data.msg,
                            size: 'small'
                        });
                    });
                }
            });
        }

        

        $scope.cargarArchivo = function() {
            if($scope.file.file == null) {
                bootbox.alert("El archivo es obligatorio.");
            } else {
                LoadingOverlap.show($scope);
                Upload.upload({
                    url: root +'licencia/adjuntararchivo/',
                    data: {
                        id: $scope.id,
                        tipoArchivo: $scope.tipoArchivo,
                        descripcion: $scope.descripcion,
                        archivo: $scope.file
                    },
                    transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                }).then(function(response){
                    $scope.tipoArchivo = null;
                    $scope.$broadcast('clearFile');
                    if(response.data.success){
                        $scope.consultarLicenciaAchivos();
                    }else{
                        alert('Error cargando archivo');
                    }
                    LoadingOverlap.hide($scope);
                }, function(){
    
                });
            }
            
        } 
                        
    }
]);
