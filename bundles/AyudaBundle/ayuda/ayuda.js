saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("ayuda", {
            url: "/ayuda",
            views: {
                "main": {
                    controller: "AyudaBundleAyudaCtrl",
                    templateUrl: "../bundles/AyudaBundle/ayuda/ayuda.tpl.html"
                }
            }
        });
    }
]).controller("AyudaBundleAyudaCtrl", ["$scope", "$timeout", "$state", 
    function ($scope, $timeout, $state) {        

        $scope.hideAlert = function () {
            $scope.validator = {};
        };       
        
        $scope.cancel = function () {
        };
        
        $scope.urlRepository = "../uploads/assets/";
        
        $scope.arrayTramitesServicios = [
            {nombre: "Asignación de Nomenclatura", 
                archivos: [ 
                        {tipo: "pdf", nombre:"Instructivo Asignación de Nomenclatura", descripcion:"Instructivo para la aplicación en línea de la solicitud de asignación.", url:$scope.urlRepository+"Instructivo_asignacion_nomenclatura.pdf"},
                        {tipo: "mp4", nombre:"Video Guía de Asignación de Nomenclatura", descripcion:"Video de ayuda", url:$scope.urlRepository+"asignacion_nomenclatura.mp4"}
                        
                       ]
            }, 
            {nombre: "Certificación de Nomenclatura", 
                archivos: [ 
                        {tipo: "mp4", nombre:"Video Guía de Certificación de Nomenclatura", descripcion:"Video de ayuda", url:$scope.urlRepository+"certificado_nomenclatura.mp4"}
                       ]
            }, 
            {nombre: "Estratificación", 
               archivos: [ 
                        {tipo: "pdf", nombre:"Manual de Estratificación", descripcion: "Paso a paso para realizar solicitud de certificado de estrato, revisión de estrato y apelación", url:$scope.urlRepository+"Manual_Estratificacion.pdf"}, 
                        {tipo: "mp4", nombre:"Certificado de Estrato Urbano", url:$scope.urlRepository+"certificado_estrato_urbano.mp4"}, 
                        {tipo: "mp4", nombre:"Certificado de Estrato Rural", url: $scope.urlRepository+"certificado_estrato_rural.mp4"},
                        {tipo: "mp4", nombre:"Revisión de Estrato", url: $scope.urlRepository+"revision_estrato.mp4"}, 
                        {tipo: "mp4", nombre:"Apelación de Estrato", url: $scope.urlRepository+"apelacion_estrato.mp4"}
                       ]
            },
            {nombre: "Lineas de Demarcación", 
                archivos: [ 
                        {tipo: "pdf", nombre:"Manual Lineas de Demarcación", descripcion:"Manual de línea de demarcación para el ciudadano.", url:$scope.urlRepository+"Manual_Lineas_de_Demarcacion_Ciudadano.pdf"}, 
                        {tipo: "mp4", nombre:"Video Lineas de Demarcación", descripcion:"Video que muestra la creación de una línea de demarcación en linea.", url:$scope.urlRepository+"linea_demarcacion.mp4"}
                       ]
            },
            {nombre: "Publicidad Exterior Visual", 
               archivos: [ 
                        {tipo: "pdf", nombre:"Manual Publicidad Exterior Visual", descripcion:"", url:$scope.urlRepository+"Manual_de_usuario_Publicidad.pdf"}, 
                        {tipo: "mp4", nombre:"Registro de Anunciante en Vallas", url:$scope.urlRepository+"registro_anunciante_vallas.mp4"},
                        {tipo: "mp4", nombre:"Registro de Vallas", url:$scope.urlRepository+"registro_vallas.mp4"},
                        {tipo: "mp4", nombre:"Permiso de Publicidad Automotor", url:$scope.urlRepository+"permiso_publicidad_automotor.mp4"}
                       ]
            },
            {nombre: "Uso de Suelo", 
               archivos: [ 
                        {tipo: "pdf", nombre:"Instructivo Uso de Suelo", descripcion:"Instructivo Uso del Suelo", url:$scope.urlRepository+"Instructivo_uso_de_suelo.pdf"}, 
                        {tipo: "mp4", nombre:"Video Guía de Uso de Suelo", url:"https://usodelsuelo.cali.gov.co/upload/documentos/mivideoguia.mp4"}
                       ]
            }                                   
        ];
    }
]);
