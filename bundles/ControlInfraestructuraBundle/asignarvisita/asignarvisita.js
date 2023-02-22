saul
  .config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider.state("solicitarvisita-controlestructura", {
        url: "/controlestructura/solicitarvisita",
        views: {
          main: {
            controller: "SolicitarVisitaControlEstructuraCtrl",
            templateUrl:
              "../bundles/ControlInfraestructuraBundle/asignarvisita/asignarvisita.tpl.html",
          },
        },
      });
    },
  ])
  .controller("SolicitarVisitaControlEstructuraCtrl", [
    "$scope",
    "$http",
    "Barrio",
    "LoadingOverlap",
    "Upload",
    "root",
    function ($scope, $http, Barrio, LoadingOverlap, Upload, root) {
      $scope.sendsolicitud = { solicitante: { id: 7903, isActive: 1 } };
      $scope.saveButton = true;
      $scope.root = root;

      $scope.getBarrios = function (viewValue) {
        return Barrio.query({ clave: viewValue }).$promise.then(function (
          response
        ) {
          if (response.length == 0) {
            console.log("no encontró resultados");
          }
          return response.map(function (item) {
            return item;
          });
        });
      };

      $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
      };

      $scope.hideAlert = function () {
        $scope.validator = {};
      };

      $scope.save = function () {
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();
        $scope.saveButton = false;

        //var files = $scope.files;

        Upload.upload({
          url: root + "controlurbano/solicitud",
          data: {
            data: $scope.sendsolicitud,
          },
        }).then(function (response) {
          $scope.saveButton = true;
          $scope.result = response.data;
          callback(response.data);
          if (response.data.success) {
            $scope.sendsolicitud = {};
          }
          console.log(response.data);
          $scope.saveButton = true;
          $(".overlap_espera").fadeOut(500, "linear");
          $(".overlap_espera_1").fadeOut(500, "linear");
        });
      };

      function callback(data) {
        $scope.validator = {};
        $scope.validator.alert = {};
        $scope.validator.alert.title = data.title;
        $scope.validator.alert.content = data.msg;
        $scope.validator.alert.type = data.type;
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          "slow",
          "swing"
        );
      }

      $scope.cancel = function () {};
    },
  ]);
