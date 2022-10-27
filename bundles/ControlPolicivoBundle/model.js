saul
.factory('ActualizarComparendosRNMCService', ['$q', 'root', 'MyHttp', function ($q, root, MyHttp) {
        return {
            //Devuelve una nomenclatura
            get: function (tipoIdentificacion, numeroIdentificacion) {
                return MyHttp.myHttp(
                        root + "controlpolicivo/consultacomparendosporidentificacion/" + tipoIdentificacion+ "/" +numeroIdentificacion,
                        'GET',
                        {}
                );
            }
        };
}]).factory('ActualizarCustodioRNMCService', ['$q', 'root', 'MyHttp', function ($q, root, MyHttp) {
        return {
            //Devuelve una nomenclatura
            get: function (tipoIdentificacion, numeroIdentificacion) {
                return MyHttp.myHttp(
                        root + "controlpolicivo/consultacustodioporidentificacion/" + tipoIdentificacion+ "/" +numeroIdentificacion,
                        'GET',
                        {}
                );
            }
        };
}]).factory('AnularPedagogiasActivas', ['$q', 'root', 'MyHttp', function ($q, root, MyHttp) {
        return {
            //Devuelve una nomenclatura
            get: function (id) {
                return MyHttp.myHttp(
                        root + "controlpolicivo/anularpedagogiasactivas/"+id,
                        'GET',
                        {}
                );
            }
        };
}]).factory('CasaJusticia', ['$q', 'root', 'MyHttp', function ($q, root, MyHttp) {
    return {
        //Devuelve una nomenclatura
        consulta: function () {
            return MyHttp.myHttp(
                    root + "controlpolicivo/casajusticia",
                    'GET',
                    {}
            );
        }
    };
}]).factory("ComparendoPorFormatoAll", ["$resource", "root", function ($resource, root) {
    return $resource(root + "controlpolicivo/comparendo/numeroformatoall/:id", {}, {
        find: {
            method: "GET",
            isArray: false
        },
        query: {
            method: "GET",
            isArray: false
        }
    })
}]).factory("ComparendoExpediente", ["$resource", "root", function ($resource, root) {
    return $resource(root + "controlsanciones/comparendo/get/:idInterno/:numeroFormato", {}, {
        get: {
            method: "GET",
            isArray: false
        }
    })
}])
.factory("ComparendoPorId", ["$resource", "root", function ($resource, root) {
    return $resource(root + "controlpolicivo/comparendo/id/:id", {}, {
        get: {
            method: "GET",
            isArray: false
        }
    })
}]);