saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("validar-propiedad-horizontal", {
            url: "/propiedadhorizontal/validar/:idpropiedadhorizontal",
            views: {
                "main": {
                    controller: "validarPropiedadHorizontalCtrl",
                    templateUrl: "../bundles/PropiedadHorizontalBundle/ValidarPropiedadHorizontal/validarPropiedadHorizontal.tpl.html"
                }
            }
        });
    }
]).controller("validarPropiedadHorizontalCtrl", ["$scope", "root", "$http", "$stateParams", 
    function ($scope, root, $http, $stateParams) {        
        
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        $scope.idpropiedadhorizontal = $stateParams.idpropiedadhorizontal;
        console.log($scope.idpropiedadhorizontal);

        $http.post(root+"propiedadhorizontal/validar_propiedad_horizontal", {id: $scope.idpropiedadhorizontal})
            .success(function(data){
                console.log(data);

                if (data.msg == "Ingreso correctamente") {
                    $scope.nombrePropiedadHorizontal = data.propiedadHorizontal['nombre'];
                    $scope.direccionPropiedadHorizontal = data.propiedadHorizontal['direccion'];
                    console.log(data.propiedadHorizontal);
                    $scope.notificacion = '';
                }
                else {
                    $scope.notificacion = data.msg;
                    $scope.resultadosConsulta = '';
                }

                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");  
            })
            .error(function(err){
                console.log(err);
            });
        

        // $scope.hideAlert = function () {
        //     $scope.validator = {};
        // };

        // $scope.cancel = function () {
        // };
    }
]);
