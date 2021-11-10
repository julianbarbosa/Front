saul.factory("Licencia", [
    "$resource",
    function ($resource) {
        return $resource("licencia/", {}, {
            query: {method: 'GET'}
        });
    }
]).factory("WebService", [
    "$resource",
    function ($resource) {
        return $resource("webservice/principal/", {}, {
            query: {method: 'GET'}
        });
    }
])