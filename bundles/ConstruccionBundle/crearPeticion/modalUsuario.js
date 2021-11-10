saul.controller("ModalUsuarioCtrl", ["$scope", "$uibModalInstance", "identificacion",
    function ($scope, $uibModalInstance, identificacion) {
        $scope.usuario = {};
        $scope.usuario.identificacion = identificacion;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        function validateSaveUsuario() {
            var validator = {},
                    usuario = $scope.usuario;

            if (!usuario.identificacion) {
                validator.identificacion = "Ingrese su identificacion";
            }
            if (!usuario.tipo_identificacion) {
                validator.tipo_identificacion = "Ingrese un tipo de identificacion";
            }
            if (!usuario.nombre) {
                validator.nombre = "Ingrese su nombre";
            }
            if (!usuario.apellido) {
                validator.apellido = "Ingrese un apellido";
            }                       
            if (usuario.email_confirm !== usuario.email) {
                validator.email_confirm = "El email debe coincidir";
                validator.email = "El email debe coincidir";
            }
            if (!usuario.telefono) {
                validator.telefono = "Ingrese un telefono";
            }
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        }
        ;

        $scope.save = function () {
            if (validateSaveUsuario()) {
                $uibModalInstance.close($scope.usuario);
            }
        };
    }]);