saul.config(["$stateProvider",
  function ($stateProvider) {
    $stateProvider.state("control-urbano-report-a", {
      url: "/reportes/report-a/",
      views: {
        "main": {
          controller: "ControlUrbanoReportACtrl",
          templateUrl: "../bundles/ControlUrbanoReportsBundle/report-a/template.tpl.html"
        }
      }
    });
  }
]).controller("ControlUrbanoReportACtrl", ["$scope", "$http", "root",
  function ($scope, $http, root) {
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
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
        label: "Barrio",
        type: "select",
        name: "barrio",
        store: "arrayBarrios",
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
      { type: 'text', name: 'visitas_asignadas', title: 'Visitas Asignadas', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '7%' },
      { type: 'text', name: 'visitas_realizadas', title: 'Visitas Realizadas', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '7%' },
      { type: 'text', name: 'numero_de_infracciones', title: 'Infracciones Reportadas', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '10%' },
      { type: 'text', name: 'porcentaje_visitas_realizadas', title: 'Porcentaje Visitas', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
      { type: 'text', name: 'porcentaje_infracciones', title: 'Porcentaje Infracciones', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
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
      $http.get(root + 'controlurbano/reports/visitaseinfracciones', { params: params })
        .then(function (response) {
          if (typeof response.data === 'object') {
            // Si la respuesta es un objeto JSON válido
            $scope.data = response.data;
            //$scope.data = [{"visitas_asignadas":"6","visitas_realizadas":"4","numero_de_infracciones":"3"}];
          } else {
            console.error('La respuesta no es un objeto JSON válido:', response.data);
          }
          $(".overlap_espera").fadeOut(500, "linear");
          $(".overlap_espera_1").fadeOut(500, "linear");
        })
        .catch(function (error) {
          console.error('Error al obtener los datos:', error);
        });

      console.log($scope.data);
    };

    $scope.getStore = function (nameStore) {
      return $scope.$eval(nameStore);
    }
    $scope.esFecha = function (value) {
      return angular.isDate(value);;
    }

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



// saul.config(["$stateProvider",
//   function ($stateProvider) {
//     $stateProvider.state("control-urbano-report-a", {
//       url: "/reportes/report-a/",
//       views: {
//         "main": {
//           controller: "ControlUrbanoReportACtrl",
//           templateUrl: "../bundles/ControlUrbanoReportsBundle/report-a/template.tpl.html"
//         }
//       }
//     });
//   }
// ]).controller("ControlUrbanoReportACtrl", ["$scope", "$http", "Licencia", "$filter", "$stateParams", "root", "UtilForm",
//   function ($scope, $http, ComparendoAll, $filter, $stateParams, root, UtilForm) {
//     $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
//     $scope.currentPage = 1;
//     $scope.numPerPage = 10;
//     $scope.maxSize = 5;
//     $scope.busqueda = {};
//     $scope.rowActive = '';
//     $scope.rowWarning = 'estaEnviado';
//     $scope.orderBy = 'idsolicitud';

//     $scope.camposBusqueda = [
//       {
//         label: "Fecha Inicial Reporte",
//         name: "fechainicialreporte",
//         type: "date",
//         estado: "activo"
//       },
//       {
//         label: "Fecha Final Reporte",
//         name: "fechafinalreporte",
//         type: "date",
//         estado: "activo"
//       },
//       {
//         label: "Barrio",
//         type: "select",
//         name: "barrio",
//         store: "arrayBarrios",
//         estado: "activo"
//       },
//       {
//         label: "Comuna",
//         type: "select",
//         name: "comuna",
//         store: "arrayComunas",
//         estado: "activo"
//       },
//       {
//         label: "Corregimiento",
//         type: "select",
//         name: "corregimiento",
//         store: "arrayCorregimientos",
//         estado: "activo"
//       },
//       {
//         label: "Identificación Propietario",
//         name: "identificacionpropietario",
//         type: "integer"
//       },
//       {
//         label: "Nombre Propietario",
//         name: "propietario",
//         type: "string"
//       },
//       {
//         label: "Dirección del Predio",
//         name: "direccion",
//         type: "string"
//       },
//       {
//         label: "Estado",
//         type: "select",
//         name: "estado",
//         store: "arrayEstados"
//       },
//       {
//         label: "Licencia",
//         name: "licencia",
//         type: "string"
//       },
//       {
//         label: "Tipo Licencia",
//         name: "tipolicencia",
//         type: "string"
//       },
//       {
//         label: "Número Predial Nacional",
//         name: "numeropredialnacional",
//         type: "string"
//       },
//       {
//         label: "Número Catastral",
//         name: "catastral",
//         type: "string"
//       }

//     ];

//     $scope.getCamposBusquedaInhabilitados = function () {
//       $scope.camposBusquedaInhabilitados = [];
//       $scope.consecutivo = 0;
//       $scope.camposBusqueda.forEach(function (item) {
//         if (item.estado !== 'activo') {
//           $scope.camposBusquedaInhabilitados[$scope.consecutivo] = { text: item.label, value: item.name };
//           $scope.consecutivo++;
//         }
//       })
//       return $scope.camposBusquedaInhabilitados;
//     }
//     $scope.eliminarCampo = function (index) {
//       $scope.camposBusqueda[index].estado = 'inactivo';
//     }

//     $scope.agregarCampo = function () {
//       bootbox.prompt({
//         title: "Seleccione el campo a agregar",
//         inputType: 'select',
//         inputOptions: $scope.getCamposBusquedaInhabilitados(),
//         callback: function (result) {
//           $scope.camposBusqueda.forEach(function (item, index) {
//             if (item.name == result) {
//               $scope.camposBusqueda[index].estado = 'activo';
//               $scope.$apply();
//             }
//           })
//         }
//       });
//     }

//     $scope.downloadData = function () {
//       $scope.request = [];
//       $scope.camposBusqueda.forEach(function (item) {
//         if (item.estado == 'activo') {
//           $scope.request.push({ 'name': item.name, 'value': $scope.busqueda[item.name] });
//         }
//       });
//       UtilForm.openWith(
//         root + "licencia/descargarcsv",
//         'post', $scope.request);
//     }

//     $scope.downloadAllData = function () {
//       $scope.request = [];
//       UtilForm.openWith(
//         root + "licencia/descargarcsv",
//         'post', $scope.request);
//     }

//     $scope.arrayEstados = [{ codigo: "expedido", nombre: "Expedida" },
//     { codigo: "ejecutoriada", nombre: "Ejecutoriada" }];

//     $scope.headers = [
//       {
//         type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
//         values: [
//           { icon: 'fa-pencil-square-o', title: 'Ver Historial Comparendo', link: '#!/licencia/consultarlicencia/', 'action': 'activarDetalle' },
//           { icon: 'fa fa-folder', title: 'Gestionar Archivos', link: '#!/licencia/archivos/{{licencia.idLicencia}}', action: 'gestionarArchivos' }
//         ],
//         options: [
//           { 'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>' }
//         ]
//       },
//       { type: 'text', name: 'visitas_asignadas', name2: '', title: 'Visitas Asignadas', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', input: false, width: '7%' },
//       { type: 'text', name: 'visitas_realizadas', name2: '', title: 'Visitas Realizadas', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '7%' },
//       { type: 'text', name: 'infracciones_reportadas', title: 'Infracciones Reportadas', header_align: 'text-center', body_align: 'text-center', input: false, sorting: 'sorting', width: '10%' },
//       { type: 'text', name: 'porcentaje_visitas', title: 'Porcentaje Visitas', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
//       { type: 'text', name: 'porcentaje_infracciones', title: 'Porcentaje Infracciones', header_align: 'text-center', body_align: 'text-center', input: false, width: '10%' },
//     ];


//     $scope.getStore = function (nameStore) {
//       return $scope.$eval(nameStore);
//     }
//     $scope.esFecha = function (value) {
//       return angular.isDate(value);;
//     }

//     $scope.esObjeto = function (value) {
//       return angular.isObject(value);
//     }

//     $scope.consultarComunas = function () {
//       $http.get(root + 'comuna/').then(function (data) {
//         $scope.arrayComunas = data.data;
//         $scope.arrayComunas.forEach(function (item) {
//           item['nombre'] = item.codigo;
//         })
//       });
//     };
//     $scope.consultarComunas();

//     $scope.consultarBarrios = function () {
//       $http.get(root + 'barrio/').then(function (data) {
//         $scope.arrayBarrios = data.data;
//         $scope.arrayBarrios.forEach(function (item) {
//           item['nombre'] = item.nombre;
//         })
//       });
//     };
//     $scope.consultarBarrios();

//     $scope.consultarCorregimientos = function () {
//       $http.get(root + 'corregimiento/').then(function (data) {
//         $scope.arrayCorregimientos = data.data;
//         $scope.arrayCorregimientos.forEach(function (item) {
//           item['nombre'] = item.nombre;
//         })
//       });
//     };
//     $scope.consultarCorregimientos();

//     $scope.activarDetalle = function (id) {
//       if ($scope.rowActive !== id) {
//         $scope.rowActive = id;
//       } else {
//         $scope.rowActive = 0;
//       }
//     };

//     function callback(data) {
//       $scope.validator = {};
//       $scope.validator.alert = {};

//       $scope.validator.alert.content = data.msg + ' <a href="#!/controlpolicivo/verificarlicencia" ><i class="fa fa-file-text" aria-hidden="true"></i> Volver a lista</a>';

//       if (data.success === true) {
//         $scope.validator.alert.type = 'alert-success';
//         $scope.validator.alert.title = "Exito: ";
//       } else {
//         $scope.validator.alert.type = 'alert-danger';
//         $scope.validator.alert.title = "Advertencia: ";
//       }
//       $("html, body").animate({
//         scrollTop: 0
//       }, "slow", "swing");
//     };

//     $scope.actualizarDatos = function (page) {
//       $(".overlap_espera").show();
//       $(".overlap_espera_1").show();
//       $scope.request = [{ 'name': 'currentPage', 'value': page },
//       { 'name': 'numPerPage', 'value': $scope.numPerPage },
//       { 'name': 'orderBy', 'value': $scope.orderBy }
//       ];

//       $scope.camposBusqueda.forEach(function (item) {
//         if (item.estado == 'activo') {
//           $scope.request.push({ 'name': item.name, 'value': $scope.busqueda[item.name] });
//         }
//       });
//       console.log("el request" + $scope.request);
//       ComparendoAll.get($scope.request)
//         .$promise.then(function (response) {
//           $scope.data = response['data'];
//           $scope.totalItems = response['totalItems'];
//           $(".overlap_espera").fadeOut(500, "linear");
//           $(".overlap_espera_1").fadeOut(500, "linear");
//         });
//     };

//     $scope.ordenarPor = function (name) {
//       $scope.orderBy = name;
//       $scope.actualizarDatos();
//     }

//     $scope.caller = function (funcion, item) {
//       $scope.$eval(funcion).call([], item);
//     };

//     $scope.gestionarArchivos = function (id) {
//       window.open('#!/licencia/gestionar-archivos/' + id);
//     }

//   }
// ]);
