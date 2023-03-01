saul
  .config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider.state("control-urbano-crearsolicitud-conradicado", {
        url: "/control-urbano/crearsolicitudconRadicado/",
        views: {
          main: {
            controller: "ControlUrbanoCrearSolicitudcrCtrl",
            templateUrl:
              "../bundles/ControlUrbanoBundle/crearsolicitudconRadicado/template.tpl.html",
          },
        },
      });
    },
  ])
  .controller("ControlUrbanoCrearSolicitudcrCtrl", [
    "$scope",
    "$http",
    "root",
    "LoadingOverlap",
    "PluginNomenclatura",
    "ListarTiposDocIdentificacion",
    "Upload",
    function (
      $scope,
      $http,
      root,
      LoadingOverlap,
      PluginNomenclatura,
      ListarTiposDocIdentificacion,
      Upload
    ) {
      $scope.root = root;
      $scope.esFuncionario = false;
      $scope.solicitud = {};
      $scope.solicitud.aplicaGarantia = 1;
      $scope.solicitud.aplicaConRadicado = 1;
      $scope.files = [];
      $scope.direccionRequerida = false;
      $scope.seBuscoSolicitante = false;
      $scope.seEncontroSolicitante = false;
      $scope.respuesta = [];
      $scope.respuesta.success = false;
      $scope.poderRequerido = false;
      $scope.npnRequerido = false;
      $scope.norfeoRequerido = true;

      $scope.inicializarDatosSolicitante = function () {
        $scope.solicitud.solicitante = [];
        $scope.solicitud.detalle = [];
        $scope.solicitud.detalle.esCompensacionMismoPredio = 1;
        $scope.seEncontroSolicitante = false;
        $scope.seBuscoSolicitante = false;
      };
      $scope.inicializarDatosSolicitante();

      //Funciones Iniciales del Proceso
      $scope.obtenerTiposIdentificacion = function () {
        ListarTiposDocIdentificacion.query().$promise.then(function (response) {
          $scope.arrayTipoIdentificacion = response;
        });
      };
      $scope.obtenerTiposIdentificacion();

      $scope.obtenerTipoVia = function () {
        $http.get(root + "pnitem/via").then(function (response) {
          $scope.arrayTipoVia = response.data;
        });
      };
      $scope.obtenerTipoVia();

      $scope.obtenerBarrio = function () {
        $http.get(root + "barrio/").then(function (response) {
          $scope.arrayBarrio = response.data;
        });
      };
      $scope.obtenerBarrio();

      $scope.validarPermisos = function () {
        LoadingOverlap.show($scope);
        $http
          .get(root + "usuario/actual")
          .then(function (response) {
            $scope.thisUser = response.data;

            if ($scope.thisUser.funcionario == 1) {
              if (
                $scope.thisUser.roles.indexOf("radicar_solicitudes") !== -1
              ) {
                $scope.esFuncionario = true;
              } else {
                alert(
                  "Usted NO tiene permisos, para radicar este tipo de solicitudes"
                );
              }
            } else {
              $scope.esFuncionario = false;
              $scope.solicitud.solicitante = angular.fromJson($scope.thisUser);
            }
          })
          .finally(function () {
            LoadingOverlap.hide($scope);
          });
      };
      $scope.validarPermisos();

      $scope.establecerDireccion = function (via, numero, placa, complemento) {
        $scope.direccionRequerida = true;
        return (
          via +
          " " +
          (numero == undefined ? "" : numero) +
          " # " +
          (placa == undefined ? "" : placa) +
          " " +
          (complemento == undefined ? "" : complemento)
        );
      };

      $scope.validarFormAdjuntosSolicitud = function () {
        $scope.validaciones = 0;
        var cantidadArchivos = 4;
        if ($scope.solicitud.solicitante.idtipodocidentificacion == 2) {
          cantidadArchivos++;
          if ($scope.solicitud.esEntidadSinAnimoLucro == 1) {
            cantidadArchivos++;
          }
        }
        $scope.validaciones +=
          $scope.files.certificadoExistencia.$valid == true ? 1 : 0;
        $scope.validaciones +=
          $scope.files.estadoSituacionFinanciera.$valid == true ? 1 : 0;
        $scope.validaciones +=
          $scope.files.estadoResultados.$valid == true ? 1 : 0;
        $scope.validaciones +=
          $scope.files.tarjetaProfesionalContador.$valid !== true ? 0 : 1;
        $scope.validaciones +=
          $scope.files.certificadoVigenciaContador.$valid == true ? 1 : 0;
        $scope.validaciones += $scope.files.estatutos.$valid == true ? 1 : 0;
        console.log(
          "cantidadArchivos=>" + cantidadArchivos,
          "validaciones=>" + $scope.validaciones
        );
        if ($scope.validaciones == cantidadArchivos) {
          $scope.step = $scope.step + 1;
        } else {
          bootbox.alert({
            message: "Debe adjuntar todos los archivos requeridos.",
            size: "small",
          });
        }
      };

      $scope.validarIdentificacionSolicitante = function (
        idTipoDocIdentificacion,
        identificacion
      ) {
        if (identificacion > 0 && idTipoDocIdentificacion > 0) {
          LoadingOverlap.show($scope);
          $scope.seBuscoSolicitante = true;
          $scope.seEncontroSolicitante = false;
          $http
            .get(
              root + "usuario/consultar_por_identificacion?id=" + identificacion
            )
            .then(function (response) {
              $scope.seEncontroSolicitante = true;
              $scope.solicitud.solicitante = response.data.data;
              console.log($scope.solicitud.solicitante);
              if (response.data.success !== true) {
                $scope.solicitud.solicitante = {
                  idtipodocidentificacion: idTipoDocIdentificacion,
                  numidentificacion: identificacion,
                };
                $scope.seEncontroSolicitante = false;
                LoadingOverlap.hide($scope);
              }
            })
            .finally(function () {
              $scope.solicitud.solicitante.idtipodocidentificacion =
                idTipoDocIdentificacion;
              $scope.solicitud.solicitante.numidentificacion = identificacion;
              LoadingOverlap.hide($scope);
            });
        } else {
          bootbox.alert(
            "Para buscar el ciudadano o la entidad, debe ingresar el tipo de identificación y número de Identificación."
          );
        }
      };

      $scope.obtenerModalIngresoDireccion = function () {
        PluginNomenclatura.obtenerModalIngresoDireccion(
          $scope,
          function (data) {
            $scope.solicitud.solicitante.direccion =
              data.direccion +
              (data.infoAdicional ? " " + data.infoAdicional : "");
          }
        );
      };

      $scope.changeTiposolicitud = function (pTemplate) {
        if (pTemplate === 'control_posterior') {
          $scope.npnRequerido = true;
        } else {
          $scope.npnRequerido = false;
        }
      }

      $scope.saveSolicitud = function (solicitud) {
        LoadingOverlap.show($scope);
        $scope.solicitudEnviada = angular.copy(solicitud);
        Upload.upload({
          url: root + "controlurbano/solicitud",
          data: {
            data: solicitud,
            files: $scope.files,
          },
          transformResponse: function (json, headerGetter) {
            return angular.fromJson(json);
          },
        }).then(function (response) {
          LoadingOverlap.hide($scope);
          $scope.respuesta.success = true;
          $scope.responseSolicitud = response.data;
        });
      };

      $scope.obtenerClaseSolicitud = function () {
        $http
          .get(root + "dominio/tipo-visita-construcciones")
          .then(function (response) {
            $scope.arrayClaseSolicitud = response.data;
          })
          .finally(function () {
            LoadingOverlap.hide($scope);
          });
      };
      $scope.obtenerClaseSolicitud();

      $scope.limpiarGarantia = function () {
        console.log("limpiar garantia");
        $scope.solicitud.garantia = {};
      };

      $scope.aniosGravables = function () {
        year = new Date().getFullYear();
        $scope.arrayAniosGravables = [];
        $scope.arrayAniosGravables.push((year - 1).toString());
        $scope.arrayAniosGravables.push((year - 2).toString());
        $scope.arrayAniosGravables.push((year - 3).toString());
      };
      $scope.aniosGravables();
    },
  ]);
