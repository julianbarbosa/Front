saul.config(["$stateProvider", function (a) {
        a.state("gestionar-peticion-lineas", {
            url: "/lineas/gestionar/:idsolicitud",
            views: {
                main: {
                    controller: "GestionarLineasCtrl",
                    templateUrl: "../bundles/LineasBundle/gestionar/gestionar.tpl.html"
                }
            }
        })
    }]).controller("GestionarLineasCtrl", ["$scope", "root", "urlPlugInNomenclatura", "$stateParams", "Barrio", "TipoVia", "ClaseVia", "Demarcacion", "LineaDemarcacion", "ConsultaLineaDemarcacionLadoManzana", "dsJqueryUtils",
    function ($scope, root, urlPlugInNomenclatura, $stateParams, Barrio, TipoVia, ClaseVia, Demarcacion, LineaDemarcacion, ConsultaLineaDemarcacionLadoManzana, dsJqueryUtils) {

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        }
        ;
        $scope.item = {};
        $scope.root = root;
        $scope.demarcacion = {};
        $scope.item.frentes = [];
        $scope.item.demarcaciones = [];
        $scope.item.idSolicitud = $stateParams.idsolicitud;
        $scope.maxlengthcodigounico = 30;
        $scope.maxlengthnumeropredial = 13;
        $scope.faltante_codigo_unico = $scope.maxlengthcodigounico;
        $scope.urlLinea = null;

        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        $scope.cargarLineaDeLadoManzana = function (lineaLadoManzana) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.item_demarcacion = {
                tipoVia: lineaLadoManzana.tipoViaPrincipal,
                nombreVia: lineaLadoManzana.nombreViaPrincipal,
                claseVia: lineaLadoManzana.claseVia,
                antejardinIzq: lineaLadoManzana.antejardinIzquierdo,
                antejardinDer: lineaLadoManzana.antejardinDerecho,
                andenIzq: lineaLadoManzana.andenIzquierdo,
                andenDer: lineaLadoManzana.andenDerecho,
                calzada: lineaLadoManzana.calzada,
                via: lineaLadoManzana.via,
                frente: 0,
                observacion: "Según proyecto urbanístico"
            };
            $scope.item.demarcaciones.push($scope.item_demarcacion);
            $scope.demarcacion = {};
            $(".overlap_espera").fadeOut(500, "linear");
            $(".overlap_espera_1").fadeOut(500, "linear");
        };


        $scope.buscandoLineaPorLadoManzana = false;
        $scope.consultarLineaPorLadoManzana = function (parametro) {
            $scope.buscandoLineaPorLadoManzana = true;
            if (parametro == 'numeropredial') {
                ConsultaLineaDemarcacionLadoManzana.query({numeropredial: $scope.item.numero_predial})
                    .$promise
                    .then(
                        function (data) {
                            $scope.buscandoLineaPorLadoManzana = false;
                            $scope.lineasPorLadoManzana = data;
                        },
                        function (error) {
                            $scope.buscandoLineaPorLadoManzana = false;
                            alert('Se encontró un error en el servidor: Error ' + error.status + ' ' + error.statusText);
                        }
                    );
            } else if (parametro == 'direccion') {
                ConsultaLineaDemarcacionLadoManzana.query({direccion: $scope.item.direccion})
                    .$promise
                    .then(
                        function (data) {
                            $scope.buscandoLineaPorLadoManzana = false;
                            $scope.lineasPorLadoManzana = data;
                        },
                        function (error) {
                            $scope.buscandoLineaPorLadoManzana = false;
                            alert('Se encontró un error en el servidor: Error ' + error.status + ' ' + error.statusText);
                        }
                    );
            }
        }


        LineaDemarcacion.find({id: $scope.item.idSolicitud}).$promise.then(function (response) {
            $scope.item = response;
            $scope.item.idsolicitud = $scope.item.idSolicitud;
            $scope.item.numero_predial = response.numeroPredialLocal;
            $scope.item.codigo_unico = response.numeroPredialNacional;  
            Demarcacion.query({id: response.id}).$promise.then(function (response) {
                $scope.item.demarcaciones = response;
            }).finally(function () {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
            $scope.lineasPorLadoManzana = ConsultaLineaDemarcacionLadoManzana.query({numeropredial: $scope.item.numero_predial});
        });

        $scope.localizaciones = [{id: 1, nombre: "Nor-Este"}, {id: 2, nombre: "Nor-Oeste"}, {id: 3, nombre: "Sur-Este"}, {id: 4, nombre: "Sur-Oeste"}];

        TipoVia.query().$promise.then(function (result) {
            $scope.tiposvia = result;
        });

        ClaseVia.query().$promise.then(function (result) {
            $scope.clasesVias = result;
        });

        $scope.getBarrios = function (viewValue) {
            return Barrio.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length == 0) {
                        console.log("no encontró resultados");
                    }
                    return response.map(function (item) {
                        return item;
                    });
                });
        };

        angular.isUndefinedOrNull = function (value) {
            return angular.isUndefined(value) || null === value;
        };

        $scope.agregarDemarcacion = function (data) {
            $scope.item_demarcacion = {
                tipoVia: data.tipoVia,
                nombreVia: data.nombreVia,
                claseVia: data.claseVia,
                antejardinIzq: angular.isUndefinedOrNull(data.antejardinIzq) ? 0 : data.antejardinIzq,
                antejardinDer: angular.isUndefinedOrNull(data.antejardinDer) ? 0 : data.antejardinDer,
                andenIzq: angular.isUndefinedOrNull(data.andenIzq) ? 0 : data.andenIzq,
                andenDer: angular.isUndefinedOrNull(data.andenDer) ? 0 : data.andenDer,
                calzada: angular.isUndefinedOrNull(data.calzada) ? 0 : data.calzada,
                via: angular.isUndefinedOrNull(data.via) ? 0 : data.via,
                frente: angular.isUndefinedOrNull(data.frente) ? 0 : parseFloat(data.frente),
                observacion: data.observacion
            };
            $scope.item.demarcaciones.push($scope.item_demarcacion);
            $scope.demarcacion = {}
        };

        $scope.quitarDemarcacion = function ($index) {
            $scope.item.demarcaciones.splice($index, 1);
        };

        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };

        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        $scope.obtenerModalIngresoDireccion = function () {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: !1,
                    activarBusqueda: !0,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "BusquedaDireccion",
                    fieldNameDireccionVisual: "BusquedaDireccionVisual",
                    fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
                },
                success: function (a) {
                    $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
                }
            })
        };

        $scope.save = function (b) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.item.informacionadicional = '';
            if (!($scope.es_lote === true)) {
                $scope.item.direccion = document.getElementById("BusquedaDireccionVisual").value;
                $scope.item.informacionadicional = document.getElementById("BusquedaInformacionAdicional").value;
            }
            dsJqueryUtils.goTop();
            LineaDemarcacion.save({
                data: $scope.item,
                demarcaciones: $scope.item.demarcaciones,
                finalizar: b
            }).$promise.then(function (result) {
                callback(result);
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
            $scope.ocultarModal = !1;
        };
    }])
