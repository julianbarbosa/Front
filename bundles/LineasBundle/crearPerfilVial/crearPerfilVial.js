saul.config(["$stateProvider", function(a) {
    a.state("crear-perfil-vial", {
        url: "/perfilvial/crearperfilvial/{id:int}",
        views: {
            main: {
                controller: "CrearPerfilVialCtrl",
                templateUrl: "../bundles/LineasBundle/crearPerfilVial/crearPerfilVial.tpl.html"
            }
        }
    }).state("aprobar-perfil-vial", {
        url: "/perfilvial/aprobarperfilvial/{id:int}/{aprobar:int}/{accion}",
        views: {
            main: {
                controller: "CrearPerfilVialCtrl",
                templateUrl: "../bundles/LineasBundle/crearPerfilVial/crearPerfilVial.tpl.html"
            }
        }
    }).state("crear-perfil-vial1", {
        url: "/perfilvial/crearperfilvial/",
        views: {
            main: {
                controller: "CrearPerfilVialCtrl",
                templateUrl: "../bundles/LineasBundle/crearPerfilVial/crearPerfilVial.tpl.html"
            }
        }
    }).state("consultar-perfil-vial", {
       url: "/perfilvial/consultarperfilvial/{id:int}",
        views: {
            main: {
                controller: "CrearPerfilVialCtrl",
                templateUrl: "../bundles/LineasBundle/crearPerfilVial/consultarPerfilVial.tpl.html"
            }
        }
    });
}]).controller("CrearPerfilVialCtrl", ["$scope", "$http", "root",  "$stateParams", "PerfilVial", "Barrio", "Vereda", "TipoVia", "ClaseVia", "ItemPorTipo", "dsJqueryUtils",
    function($scope, $http, root, $stateParams, PerfilVial, Barrio, Vereda, TipoVia, ClaseVia, ItemPorTipo, dsJqueryUtils) {
        $scope.status = {};
        $scope.status.isFirstOpen = true;
        $scope.status.isSecondOpen = true;
        $scope.status.isThirdOpen = true;
        $scope.status.isFourthOpen = true;
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();



        var inputs = angular.element("input");

        angular.forEach(inputs, function(value, key){
            console.info("value",value);
            var a = angular.element(value);
            console.log("a",a);
            a.attr('readonly','readonly');
        });

        $scope.consultarExistencia = function() {
            // console.log($scope.linea.tipoViaPrincipalId);
            // if(!angular.isUndefined($scope.linea.tipoViaPrincipalId) &&
            //    !angular.isUndefined($scope.linea.nombreViaPrincipal) &&
            //    !angular.isUndefined($scope.linea.tipoViaSecundariaId) &&
            //    !angular.isUndefined($scope.linea.nombreViaSecundaria)) {
            //     PerfilVial2.get({'tipoviaprincipal':$scope.linea.tipoViaPrincipalId,
            //         'nombreviaprincipal':$scope.linea.nombreViaPrincipal,
            //         'tipoviasecundaria':$scope.linea.tipoViaSecundariaId,
            //         'nombreviasecundaria':$scope.linea.nombreViaSecundaria});

            // }
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


        function init(isForm) {
            $scope.root = root;
            $scope.linea = {};
            $scope.accion = "Crear";
            if($stateParams.accion=='revisar') {
                $scope.accion = "Revisar";
            }
            if(isForm) {
                $scope.form.$setUntouched();
                $scope.form.$setPristine();
            }
            if($stateParams.id) {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                PerfilVial.query({id:$stateParams.id}).$promise.then(function(result){
                    console.log(result[0]);
                    if(result[0].success==false) {
                        alert(result[0].msg);
                    } else {
                        $scope.linea = result[0];
                        if($scope.linea.dimensionSeparador>0) {
                            $scope.linea.tieneSeparador = true;
                        }
                        $scope.linea.izquierdo.antejardinEsVariable = $scope.linea.izquierdo.antejardinVariable>0?true:false;
                        $scope.linea.izquierdo.andenEsVariable = $scope.linea.izquierdo.andenVariable>0?true:false;
                        $scope.linea.izquierdo.tieneSeparador = $scope.linea.izquierdo.calzadaSeparador>0?true:false;
                        $scope.linea.derecho.antejardinEsVariable = $scope.linea.derecho.antejardinVariable>0?true:false;
                        $scope.linea.derecho.andenEsVariable = $scope.linea.derecho.andenVariable>0?true:false;
                        $scope.linea.derecho.tieneSeparador = $scope.linea.derecho.calzadaSeparador>0?true:false;
                    }
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                });
            } else {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            }
        };

        TipoVia.query().$promise.then(function(result) {
            $scope.tiposvia = result;
            ClaseVia.query().$promise.then(function(result) {
                $scope.clasesVias = result;
                init();
            });
        });

        ItemPorTipo.query({tipo: 'tiposeparador'}).$promise.then(function(result) {
            $scope.tiposeparadorArray = result;
            console.log(result);
        });


        $scope.onSelect = function ($linea, $model, $label) {
            $scope.$linea = $linea;
            $scope.$model = $model;
            $scope.$label = $label;
        };

        $scope.hideAlert = function() {
            $scope.validator = {};
        };


        /**
         * Perfil Vial
         * @param {*} finalizar
         */
        $scope.save = function(finalizar) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.estaGuardando = 1;
            PerfilVial.save({
                data: $scope.linea,
                finalizar: finalizar
            }).$promise.then(function(result) {
                callback(result);
                init(1);
            });
            $scope.ocultarModal = !1;
        };


        $scope.duplicar = function ()
        {
            bootbox.confirm("Confirma que desea duplicar este perfil vial?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        dsJqueryUtils.goTop();
                        $http({
                            url: root+'perfilvial/duplicar/'+$scope.linea.id,
                            method: "PUT"
                        }).then(function(result) {
                            console.log(result);
                            callback(result.data);
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };

        $scope.anular = function ()
        {
            bootbox.confirm("Confirma que desea **ANULAR** este perfil vial?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        dsJqueryUtils.goTop();
                        $http({
                            url: root+'perfilvial/'+$scope.linea.id,
                            method: "DELETE"
                        }).then(function(result) {
                            callback(result.data);
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };

        $scope.aprobar = function (estado)
        {
            $scope.linea.estadoAprobacion = estado;
            bootbox.confirm("Confirma que desea <strong>"+estado+"</strong> esta linea de demarcación sin realizar ningún cambio?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        dsJqueryUtils.goTop();
                        $http.post(root+'perfilvial/aprobar/', $scope.linea).then(function(result) {
                            callback(result.data);
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };
    }]);
