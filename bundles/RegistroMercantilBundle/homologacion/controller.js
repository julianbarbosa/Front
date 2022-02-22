saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("homologacion-rit", {
            url: "/homologacion/:id/:hash",
            views: {
                "main": {
                    controller: "RegistroMercantilBundleCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/homologacion/template.tpl.html"
                }
            }
        });
    }
]).controller("RegistroMercantilBundleCtrl", ["$scope", "$stateParams", "$http", "root", "LoadingOverlap",
    function ($scope, $stateParams, $http, root, LoadingOverlap) {
        $scope.root = root;
        $scope.data = {};
        $scope.formData = {};

        $scope.consultarHomologacion = function () {
            LoadingOverlap.show($scope);
            $http.get(root + "registromercantil/homologacion/"+$stateParams.id+"/"+$stateParams.hash, {
                transformResponse: function (json, headerGetter) {
                    return angular.fromJson(json);
                }
            }).then(function (result) {
                $scope.result = result.data;
                $scope.data = result.data.data;
                console.log($scope.result);
                $scope.numeroidentificacion = result.data.numeroidentificacion;
                $scope.tipoidentificacion = result.data.tipoidentificacion;
                LoadingOverlap.hide($scope);
            });
        }
        $scope.consultarHomologacion();


        $scope.almacenarActividadesEconomicas = function (formData) {
            console.log($scope.formData);
            LoadingOverlap.show($scope);
            $http.post($scope.root + "registromercantil/homologacion/"+$stateParams.id+"/"+$stateParams.hash, formData).then(function (result) {
                $scope.response = result.data;
                LoadingOverlap.hide($scope);
            });
        }
        
        $scope.validarDigitoVerificacion = function() {
            console.info("entro a validar digito de verificación.");
            if($scope.formData.numeroidentificacion!== '' && $scope.formData.digitoverificacion!=='') {
                const digitoVerificacionCalculado = $scope.calcularDigitoVerificacion($scope.formData.numeroidentificacion);
                console.error("el dígito de verificación es: "+digitoVerificacionCalculado);
                if(digitoVerificacionCalculado!==$scope.formData.digitoverificacion) {
                    alert("El número de identificación o el dígito de verificación son incorrectos.");
                    $scope.formData.digitoverificacion = '';
                }
            }
        }
        
        $scope.duplicarFila = function($index) {
            var row = angular.copy($scope.data[$index]);
            row.sePuedeEliminar = true;
            $scope.data.push(row);
        }
        
        $scope.eliminarFila = function($index) {
            var row = angular.copy($scope.data[$index]);
            if(row.sePuedeEliminar == true) {
                $scope.data.splice($index, 1);
            }            
        }
        

        /**
         * Permite calcular el dígito de verificación
         * @param {string} myNit - NIT proporcionado por el RUES a la empresa.
         * @returns {Number} Retorna el número de verificación que corresponde a la empresa.
         */
        $scope.calcularDigitoVerificacion = function(myNit) {
            console.log("entro a calcular digito de verificacion");
            
            myNit = myNit.toString();
            var vpri,
                x,
                y,
                z;

            // Se limpia el Nit
            myNit = myNit.replace(/\s/g, ""); // Espacios
            myNit = myNit.replace(/,/g, ""); // Comas
            myNit = myNit.replace(/\./g, ""); // Puntos
            myNit = myNit.replace(/-/g, ""); // Guiones

            // Se valida el nit
            if (isNaN(myNit)) {
                console.log("El nit/cédula '" + myNit + "' no es válido(a).");
                return "";
            };

            // Procedimiento
            vpri = new Array(16);
            z = myNit.length;

            vpri[1] = 3;
            vpri[2] = 7;
            vpri[3] = 13;
            vpri[4] = 17;
            vpri[5] = 19;
            vpri[6] = 23;
            vpri[7] = 29;
            vpri[8] = 37;
            vpri[9] = 41;
            vpri[10] = 43;
            vpri[11] = 47;
            vpri[12] = 53;
            vpri[13] = 59;
            vpri[14] = 67;
            vpri[15] = 71;

            x = 0;
            y = 0;
            for (var i = 0; i < z; i++) {
                y = (myNit.substr(i, 1));
                // console.log ( y + "x" + vpri[z-i] + ":" ) ;

                x += (y * vpri[z - i]);
                // console.log ( x ) ;    
            }

            y = x % 11;
            // console.log ( y ) ;

            return (y > 1) ? 11 - y : y;
        }
    }
]);
