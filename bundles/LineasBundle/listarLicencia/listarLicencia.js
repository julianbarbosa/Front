saul.config(["$stateProvider", function(a) {
    a.state("listar-licencia", {
        url: "/licencia/listar",
        views: {
            main: {
                controller: "ListarLicenciaCtrl",
                templateUrl: "../bundles/IntegracionBundle/listarLicencias/listarLicencias.tpl.html"
            }
        }
    })
}]).controller("ListarLicenciaCtrl", ["$scope", "Licencia", "WebService", function(a, b, c) {
    a.currentPage = 1, a.numPerPage = 10, a.maxSize = 5, a.rowWarning = "estaEnviado", a.orderBy = "idLicenciaDAPM", a.webService = c.query(), console.log(a.webService), a.headers = [{
        name: "acciones",
        title: "Acciones",
        align: "text-center",
        input: !1,
        values: [{
            link: '<i class="ver-detalle fa fa-angle-right pull-left" title="Ver información adicional"></i>'
        }],
        options: [{
            value: 0,
            nameValidate: "estaEnviado",
            name: "No Enviado",
            link: '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'
        }]
    }, {
        name: "idLicencia",
        title: "Licencia",
        header_align: "text-center",
        body_align: "text-center",
        sorting: "sorting"
    }, {
        name: "observacion",
        title: "Observación",
        header_align: "text-left",
        body_align: "text-left",
        width: "50%"
    }, {
        name: "fechaEnvio",
        title: "Fecha Envío",
        header_align: "text-center",
        body_align: "text-center",
        sorting: "sorting"
    }, {
        name: "estaEnviado",
        title: "Estado Envío",
        header_align: "text-center",
        body_align: "text-center",
        options: [{
            value: 1,
            nameValidate: "estaEnviado",
            name: "Enviado",
            link: '<i class="fa fa-check" style="color:green" title="Ver información adicional"></i>'
        }, {
            value: 0,
            nameValidate: "estaEnviado",
            name: "No Enviado",
            link: '<i class="fa fa-exclamation-triangle danger" style="font-size:60px;color:red !important;"></i>'
        }]
    }], a.actualizarDatos = function() {
        var c = [{
            name: "currentPage",
            value: a.currentPage
        }, {
            name: "numPerPage",
            value: a.numPerPage
        }, {
            name: "orderBy",
            value: a.orderBy
        }];
        for (header in a.headers) "undefined" != typeof a.headers[header].value && "" !== a.headers[header].value && c.push({
            name: a.headers[header].name,
            value: a.headers[header].value
        });
        b.query(c).$promise.then(function(b) {
            a.licencias = b.data, a.totalItems = b.totalItems
        })
    }, a.actualizarDatos(), a.ordenarPor = function(b) {
        a.orderBy = b, a.actualizarDatos()
    }
}])