saul.config(["$stateProvider",
  function ($stateProvider) {
    $stateProvider.state("control-urbano-report-b", {
      url: "/reportes/report-b/",
      views: {
        "main": {
          controller: "ControlUrbanoReportBCtrl",
          templateUrl: "../bundles/ControlUrbanoReportsBundle/report-b/template.tpl.html"
        }
      }
    });
  }
]).controller("ControlUrbanoReportBCtrl", ["$scope", "$http", "root",
  function ($scope, $http, root) {
    $scope.currentPage = 1;
    $scope.numPerPage = 20;
    $scope.busqueda = {};
    $scope.orderBy = 'idvisita';
    $scope.data = []; // Array para almacenar los datos

    // Define los campos de búsqueda
    $scope.camposBusqueda = [
      {
        label: "Fecha Inicial Reporte",
        name: "fechainicialreporte",
        type: "date",
        estado: "activo"
      },
      {
        label: "Fecha Final Reporte",
        name: "fechafinalreporte",
        type: "date",
        estado: "activo"
      },
      {
        label: "Comuna",
        type: "select",
        name: "comuna",
        store: "arrayComunas",
        estado: "activo"
      },
      {
        label: "Barrio",
        type: "select",
        name: "barrio",
        store: "arrayBarrios",
        estado: "activo"
      },
      {
        label: "Corregimiento",
        type: "select",
        name: "corregimiento",
        store: "arrayCorregimientos",
        estado: "activo"
      },
      {
        label: "Identificación Propietario",
        name: "identificacionpropietario",
        type: "integer"
      },
      {
        label: "Nombre Propietario",
        name: "propietario",
        type: "string"
      },
      {
        label: "Dirección del Predio",
        name: "direccion",
        type: "string"
      },
      {
        label: "Estado",
        type: "select",
        name: "estado",
        store: "arrayEstados"
      },
      {
        label: "Licencia",
        name: "licencia",
        type: "string"
      },
      {
        label: "Tipo Visita",
        name: "tipovisita",
        type: "select",
        store: "arrayTipoVisita",
        estado: "activo"
      },
      {
        label: "Número Predial Nacional",
        name: "numeropredialnacional",
        type: "string"
      },
      {
        label: "Número Catastral",
        name: "catastral",
        type: "string"
      }

    ];

    $scope.getCamposBusquedaInhabilitados = function () {
      $scope.camposBusquedaInhabilitados = [];
      $scope.consecutivo = 0;
      $scope.camposBusqueda.forEach(function (item) {
        if (item.estado !== 'activo') {
          $scope.camposBusquedaInhabilitados[$scope.consecutivo] = { text: item.label, value: item.name };
          $scope.consecutivo++;
        }
      })
      return $scope.camposBusquedaInhabilitados;
    }
    $scope.eliminarCampo = function (index) {
      $scope.camposBusqueda[index].estado = 'inactivo';
    }

    $scope.agregarCampo = function () {
      bootbox.prompt({
        title: "Seleccione el campo a agregar",
        inputType: 'select',
        inputOptions: $scope.getCamposBusquedaInhabilitados(),
        callback: function (result) {
          $scope.camposBusqueda.forEach(function (item, index) {
            if (item.name == result) {
              $scope.camposBusqueda[index].estado = 'activo';
              $scope.$apply();
            }
          })
        }
      });
    }
    $scope.headers = [
      { type: 'text', name: 'v5_comuna', title: 'Comuna', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '7%' },
      { type: 'text', name: 'nombre', title: 'Barrio', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '10%' },
      { type: 'text', name: 'nombre_corregimiento', title: 'Corregimiento', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '10%' },
      { type: 'text', name: 'total_visitas', title: 'Visitas Asignadas', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '7%' },
      { type: 'text', name: 'visitas_realizadas', title: 'Visitas Realizadas', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '7%' },
    ];

    // Función para buscar datos
    $scope.actualizarDatos = function () {
      var params = {
        currentPage: $scope.currentPage,
        numPerPage: $scope.numPerPage,
        orderBy: $scope.orderBy,
      };

      // Agrega los valores de los filtros activos al objeto de parámetros
      angular.forEach($scope.camposBusqueda, function (filtro) {
        if ($scope.busqueda[filtro.name]) {
          params[filtro.name] = $scope.busqueda[filtro.name];
        }
      });

      // Realiza la solicitud HTTP al endpoint de consulta
      $http.get(root + 'controlurbano/reports/visitasxprocedimientos', { params: params })
        .then(function (response) {
          console.log("la respuesta:",response)
          if (typeof response.data === 'object') {
            // Si la respuesta es un objeto JSON válido
            $scope.data = response.data;
          } else {
            console.error('La respuesta no es un objeto JSON válido:', response.data);
          }
          $(".overlap_espera").fadeOut(500, "linear");
          $(".overlap_espera_1").fadeOut(500, "linear");
        })
        .catch(function (error) {
          console.error('Error al obtener los datos:', error);
        });

      console.log("data is:",$scope.data);
    };

    $scope.getStore = function (nameStore) {
      return $scope.$eval(nameStore);
    }
    // $scope.esFecha = function (value) {
    //   return angular.isDate(value);
    // }

    $scope.esObjeto = function (value) {
      return angular.isObject(value);
    }

    $scope.consultarTipoVisita = function () {
      $http.get(root + 'tipo_visita/').then(function (data) {
        $scope.arrayTipoVisita = data.data;
        $scope.arrayTipoVisita.forEach(function (item) {
          item['nombre'] = item.nombre;
          item['value'] = item.idTipoVisita;
        })
      });
    };

    $scope.consultarTipoVisita();

    $scope.consultarComunas = function () {
      $http.get(root + 'comuna/').then(function (data) {
        $scope.arrayComunas = data.data;
        $scope.arrayComunas.forEach(function (item) {
          item['nombre'] = item.codigo;
          item['value'] = item.codigo;
        })
      });
    };
    $scope.consultarComunas();

    $scope.consultarBarrios = function () {
      $http.get(root + 'barrio/').then(function (data) {
        $scope.arrayBarrios = data.data;
        $scope.arrayBarrios.forEach(function (item) {
          item['nombre'] = item.nombre;
          var year = new Date(item.codigo).toISOString().split('-')[0];
          item['value'] = year;
        })
      });
    };
    $scope.consultarBarrios();

    $scope.consultarCorregimientos = function () {
      $http.get(root + 'corregimiento/').then(function (data) {
        $scope.arrayCorregimientos = data.data;
        $scope.arrayCorregimientos.forEach(function (item) {
          item['nombre'] = item.nombre;
          item['value'] = item.codigo;
        })
      });
    };
    $scope.consultarCorregimientos();

    $scope.activarDetalle = function (id) {
      if ($scope.rowActive !== id) {
        $scope.rowActive = id;
      } else {
        $scope.rowActive = 0;
      }
    };

    function callback(data) {
      $scope.validator = {};
      $scope.validator.alert = {};

      $scope.validator.alert.content = data.msg + ' <a href="#!/controlpolicivo/verificarlicencia" ><i class="fa fa-file-text" aria-hidden="true"></i> Volver a lista</a>';

      if (data.success === true) {
        $scope.validator.alert.type = 'alert-success';
        $scope.validator.alert.title = "Exito: ";
      } else {
        $scope.validator.alert.type = 'alert-danger';
        $scope.validator.alert.title = "Advertencia: ";
      }
      $("html, body").animate({
        scrollTop: 0
      }, "slow", "swing");
    };


    // Llama a la función de búsqueda al cargar la página
    $scope.actualizarDatos();
  }
]);



