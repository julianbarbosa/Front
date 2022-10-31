saul.config(["$stateProvider", function(a) {
    a.state("gestionar-peticion-nomenclatura", {
        url: "/certificado_nomenclatura/gestionar/:idsolicitud",
        views: {
            main: {
                controller: "GestionarNomenclaturaCtrl",
                templateUrl: "../bundles/NomenclaturaBundle/gestionar/gestionar.tpl.html"
            }
        }
    })
}]).controller("GestionarNomenclaturaCtrl", ["$scope", "root", "$stateParams", "Solicitud", "CertificadoNomenclatura", "CausasNegacionNomenclatura", "EstadosNomenclatura", "ObservacionesDevolucion", "Solicitud", "dsJqueryUtils", function($scope, $stateParams, c, Solicitud, CertificadoNomenclatura, CausasNegacionNomenclatura, EstadosNomenclatura, ObservacionesDevolucion, d, dsJqueryUtils) {
    
    $scope.root = $stateParams;
    $scope.item = {};
    $scope.nomenclatura = {};
    $scope.length_nomenclatura = null;
    $scope.nomenclaturaNegada = null;
    
    $scope.item.idSolicitud = c.idsolicitud;
    
    Solicitud.find({id: $scope.item.idSolicitud}).$promise.then(function(result) {
        $scope.data = result.data;
        $scope.data.nomenclaturas = [];
        angular.isUndefinedOrNull($scope.data.nomenclatura.predioTmp) || ($scope.data.nomenclatura.predio = $scope.data.nomenclatura.predioTmp), angular.isUndefinedOrNull($scope.data.nomenclatura.direccionVisual) || ($scope.data.nomenclatura.direccion = $scope.data.nomenclatura.direccionVisual), $scope.nomenclatura.direccion_verificada = $scope.data.nomenclatura.direccion, $scope.nomenclatura.informacion_adicional_verificada = $scope.data.nomenclatura.direccion_adicional
    });
    
    $scope.observacion_devolucion = ObservacionesDevolucion.query({id: $scope.item.idSolicitud});
    
    $scope.validarEstadoNomenclatura = function() {
        angular.isUndefinedOrNull($scope.data.estado_gestion.codigo) ? a.nomenclaturaNegada = null : "anulada" === $scope.data.estado_gestion.codigo ? ($scope.nomenclaturaNegada = !0, $scope.data.nomenclatura.observacion = null) : ($scope.nomenclaturaNegada = !1, $scope.data.nomenclatura.observacion = "Para efectos de trámites y/o revisión, se informa que la antigua dirección del predio era " + $scope.data.nomenclatura.direccion)
    };
    
    CausasNegacionNomenclatura.query().$promise.then(function(result) {
        $scope.causasNegacion = result;
    });
    
    EstadosNomenclatura.query().$promise.then(function(result) {
        $scope.estados = result;
    });
    
    angular.isUndefinedOrNull = function(val) {
        return angular.isUndefined(val) || null === val;
    };
    
    function callback(data) {
        $scope.validator = {};
        $scope.validator.alert = {};
        $scope.validator.alert.title = "Información: ";
        $scope.validator.alert.content = data.msg;
        $scope.validator.alert.type = data.type;
        $("html, body").animate({
            scrollTop: 0
        }, "slow", "swing");
    };
              
    $scope.hideAlert = function() {
        $scope.validator = {};
    };
        
    
    $scope.obtenerModalIngresoDireccion = function() {
        $.ajax({
            url: "https://planeacion.cali.gov.co/saul_dev/dapm.php/nomenclatura",
            data: {
                fieldNamecallbackFunction: "cerrarModal",
                fieldNameNPNrequerido: !1,
                fieldNameDiv: "modalIngresoDireccion",
                fieldNameNumeroUnico: "NPN",
                fieldNameDireccion: "BusquedaDireccion",
                fieldNameDireccionVisual: "BusquedaDireccionVisual",
                fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
            },
            success: function(a) {
                $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
            }
        })
    };
    
    $scope.save = function() {
        if(0 === $scope.data.nomenclaturas.length) {
            $scope.length_nomenclatura = "Debe ingresar al menos una nomenclatura."
        } else {
            $scope.data.direccion_verificada = document.getElementById("BusquedaDireccionVisual").value;
            $scope.data.informacion_adicional_verificada = document.getElementById("BusquedaInformacionAdicional").value;
            dsJqueryUtils.goTop();
            CertificadoNomenclatura.save({data: $scope.data}).$promise.then(function(result) {
                callback(result);
            });
            $scope.ocultarModal = !1;
        } 
    };
    
    
    $scope.agregarNomenclatura = function() {
        var direccion_verificada = document.getElementById("BusquedaDireccionVisual").value;
        var informacion_adicional = document.getElementById("BusquedaInformacionAdicional").value;
        if(direccion_verificada!=='') {
            $scope.data.nomenclaturas.push({es_lote: $scope.nomenclatura.es_lote,direccion_verificada: direccion_verificada,informacion_adicional_verificada: informacion_adicional });
            document.getElementById("BusquedaDireccionVisual").value = "";
            document.getElementById("BusquedaInformacionAdicional").value = "";
        }
        $scope.data.direccion = "";
        angular.forEach($scope.data.nomenclaturas, function(b, c) {
            $scope.data.direccion += escape(b.direccion_verificada + " " + b.informacion_adicional_verificada + ", ")
        });
    }; 
            
    $scope.quitarNomenclatura = function(index) {
        $scope.data.nomenclaturas.splice(index, 1);
    }
}])

.filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
})


