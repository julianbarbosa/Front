saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("consultar-nomenclatura", {
            url: "/nomenclatura/consultar/{tipoUsuario}",
            views: {
                "main": {
                    controller: "ConsultarNomenclaturaCtrl",
                    templateUrl: "../bundles/NomenclaturaBundle/consultar/consultar.tpl.html"
                }
            }
        });
    }
]).controller("ConsultarNomenclaturaCtrl", ["$scope", "$stateParams", "$timeout", "$state",'PluginNomenclatura','Nomenclaturax', 'root',
    function ($scope, $stateParams, $timeout, $state, PluginNomenclatura, Nomenclaturax, root) 
    {
        $scope.datosConsulta = null;
        $scope.predio = null;
        $scope.nomenclaturas = null;
        $scope.npn = "";
        $scope.estadoBuscar = true;
        $scope.buscandoCodigo = false;
        $scope.codigoInterno = '';
        $scope.codigoInternoError = false;
        $scope.codigoInternoData = {};
        $scope.tipoUsuario = $stateParams.tipoUsuario;

        $scope.setBuscandoCodigo = function (val){
            $state.go('validar-certificado-nomenclatura');
        };

   
        $scope.consultar = function () 
        {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            Nomenclaturax.
            getInfoPorNpn( $scope.datosConsulta.npn ).
            then(function(data){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear", function(){
                    $scope.predio = data.predio;
                    $scope.nomenclaturas = data.nomenclaturas;
                    $scope.permisoVerHistorico = data.verHistorico;
                    $scope.estadoBuscar = false;
                });
                
            }, function(data){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear", function(){
                    alert(data.msg);
                });
            });
        };

        $scope.consultarOtro = function(){
            $scope.estadoBuscar = true;
            $scope.direccion = '';
            $scope.npn = '';
        };

        $scope.consultarHistorico = function(nomenclatura){
            nomenclatura.loading = true;
            Nomenclaturax.
            getHistorico(nomenclatura.idnomenclatura).
            then(function(data){
                nomenclatura.loading = false;
                nomenclatura.historico = data;
            }, function(codigo, msg){
                nomenclatura.loading = false;
                alert('Error: '+msg);
            });
        };

        $scope.generarCertificado = function(){
            window.open(root+'certificado_nomenclatura/generar_interno/'+$scope.datosConsulta.predioId)
        };

        $scope.consultarCertificadoPorCodigoInterno = function(){
            if($scope.codigoInterno == ''){
                $scope.codigoInternoError = true;
                return;
            }
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.codigoInternoData = {};
            $scope.codigoInternoError = false;
            Nomenclaturax
            .getDataConsultaCertificadoInterno($scope.codigoInterno)
            .then(function(data){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                $scope.codigoInternoData = data;
                //$scope.codigoInternoData.direccionesHtml = data.direcciones.replace(/[;]/g, '<br>');
                $scope.codigoInternoData.direccionesArray = data.direcciones.split(';');
            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                alert(error.msg);
            });
        };
        

        $scope.limpiar = function () {
            $scope.npn = '';
            $scope.direccion = '';
        };
        
        $scope.obtenerModalIngresoDireccion = function() {
            PluginNomenclatura.obtenerModalIngresoDireccion($scope, function(params){
                $scope.datosConsulta = params;
                $scope.direccion = params.direccion+(params.infoAdicional?' '+params.infoAdicional:'');
                $scope.npn = params.npn;
            }, function(msg){
                alert(msg);
            });
        };

        $scope.formatearNPN = function($event){
            if($event.keyCode == 13){
                alert('enter');
            }else{
                $scope.npn = $scope.npn.replace(/([a-z0-9]+)/i, '#$1 L');
            }
        };

        $scope.notificarNomenclaturaErrada = function(i){
            alert('Aún no implementada. Nomenclatura'+$scope.nomenclaturas[i].idnomenclatura);
        };
    }
]);
