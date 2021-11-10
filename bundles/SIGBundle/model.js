saul.factory("TipoSolicitudSIG", [
    "$resource",
    function ($resource) {
        return $resource("sig/tipoSolicitud", {}, {
            query: {method: 'GET', isArray: true}
        });
    }
]);