saul.directive('inputFile2', function(){
	return {
		restrict: 'E',
		require: '?model',
		scope:{
			label: '@',
			description: '@',
			placeholder: '@',
			required: '@',//Por defecto no requerida (false)
			shadow: '@',
            name: '@',
            model: '=',//{$valid: boolean que indica si el campo es válido, file: null o archivo seleccionado}
			accept: '@',//Por defecto PDF e imágenes. Debe ser 
			min: '@',//Min en Kb (0 kb por defecto)
			max:'@',//Max en Kb (2048 Kb por defecto)
			fn: '=',
			// callbackFunction: '@'
		},
		templateUrl: '../directives/inputFile2/inputFile.tpl.html',
		link: function ($scope, element, attrs, ngModel) {
			//Seteamos las ocpiones por defecto
			var options = $scope.options = {};
            $scope.model = {};
            $scope.model.$pristine = false;
            
			options.label || (options.label='');
			options.min = $scope.min?$scope.min*1024:0;//Por defecto 0
			options.max = $scope.max?$scope.max*1024:2097152;//Por defecto 2M
			options.allowedExtensions = $scope.accept?$scope.accept:'pdf,png,jpeg,jpg,PDF,PNG,JPEG,JPG,doc,docx,xls,xlsx';//Por defecto imágenes y pdf
			options.regex = new RegExp("(.*?)\.(" + options.allowedExtensions.replace(/,/g,"|") + ")$");
			options.description = $scope.description?$scope.description:'';//Por defecto vacía
			options.required = $scope.required?true:false;//Por defecto False
            options.required = $scope.shadow?true:false;//Por defecto False
            options.name = $scope.name?$scope.name:'';
            
			//Inicializamos el modelo y el error
            $scope.model = {};
			$scope.model.$valid || ($scope.model.$valid=true);
			$scope.model.$error || ($scope.model.$error = { accept: false, min: false, max: false, required: false, msg: []});
			$scope.model.file || ($scope.model.file = null);
			$scope.model.$error.msg.length = 0;
			//$scope.fn || ($scope.fn = {});

			$scope.alerts = [];

			//Valida que el campo esté correcto
			function updateValid() {
				$scope.model.$error.msg.length = 0;
				if($scope.model.file!=null){
					element.find('.pfi-filename')[0].innerHTML = $scope.model.file.name;
					//Validamos 
					if (!(options.regex.test($scope.model.file.name))) {
						$scope.model.$error.accept = true;
						$scope.model.$errorformato = 'El archivo debe estar en alguno de estos formatos: '+options.allowedExtensions;
					}else{
						$scope.model.$error.accept = false;
					}

					if($scope.model.file.size >  options.max ){
						$scope.model.$error.max = true;
		        		$scope.model.$error.msg.push('El archivo tiene un tamaño mayor a '+(options.max/1024)+'Kb.');
		        	}else{
		        		$scope.model.$error.max = false;
		        	}

		        	if($scope.model.file.size <  options.min ){
		        		$scope.model.$error.msg.push('El archivo tiene un tamaño menor '+(options.min/1024)+'Kb.');
		        	}else{
		        		$scope.model.$error.min = false;
		        	}

		        	$scope.model.$error.required = false;

				}else{
					element.find('.pfi-filename')[0].innerHTML = '';
					element.find('.input_file')[0].value = '';
					$scope.model.$error.accept = false;
					$scope.model.$error.max = false;
					$scope.model.$error.min = false;
					if(options.required){
						$scope.model.$error.msg.push('El archivo es requerido.');
						$scope.model.$error.required = true;
					}else{
						$scope.model.$error.required = false;
					}
				}

				$scope.model.$valid = !($scope.model.$error.accept || $scope.model.$error.max || $scope.model.$error.min || $scope.model.$error.required);
			}

			$scope.model.reset = function(){
                $scope.model.$pristine = false;
				$scope.model.file = null;
				updateValid();
			};

			//Cierra el diálogo de error
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};

			//Inicializa el elemento
			$scope.initInputFile = function(){
                $scope.model.$pristine = true;
				element.find('.clear_btn_dom')[0].addEventListener('click', function(e){
					e.preventDefault();
					$scope.model.file = null;
					$scope.$apply(function () {updateValid();});
				});
				element.find('.pfi-choose')[0].addEventListener('click', function(e){
					e.preventDefault();
					element.find('.input_file')[0].click();
				});
                element.find('.input_file')[0].addEventListener('input', function(e){
					$scope.model.$pristine = false;
				});
				updateValid();
			};

	        $scope.$on("fileSelected", function (event, args) {
                $scope.model.$errorformato = null;
                $scope.model.$pristine = true;
	        	//Impedimos que el evento se propague al controlador
	        	event.stopPropagation();
	        	$scope.model.file = args.file;
				// $scope.callbackFunction();
	        	//Actualizamos el front
	        	$scope.$apply(function () {updateValid();});
	        });

	        $scope.initInputFile();
		}
	};
});