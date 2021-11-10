saul.controller('nomenclaturaFormController',
	['$scope', '$uibModalInstance', 'NomenclaturaService', 'Opciones', 'PluginNomenclatura', 'Nomenclaturax', 'LoadingOverlap',
	function($scope, $modalInstance, NomenclaturaService, Opciones, PluginNomenclatura, Nomenclaturax, LoadingOverlap){
		//Opciones
		//Objeto de la forma
		// {
		// 	accion: string que puede ser 'crear' o 'editar'
		//  cargar: booleano que indica si se desea cargar la nomenclatura a partir del idNomenclatura.
		// nomenclatura: { //Un objeto con los datos iniciales para mostrar
		// 	idnomenclatura: number obligatorio en caso de accion=edit o cargar=true
		// 	direccion: Dirección principal que se va a mostrar
		// 	informacionadicional: Complemento de la dirección que se mostrará
		// 	direccionVisual: Dirección visual que se mostrará
		// 	direccionAnterior: Dirección anterior q se mostrará
		// 	codigo_estado: Estado que se mostrrá
		// 	npn: Número predial nacional que se mostrará
		// 	numero: Número predial alfanumérico que s emostrará
		// 	observacion: Observación que se mostrará.
		// }
		// }
		console.warn(Opciones);
		

		//Indica si se debe consultar la nomenclatura del servidor
		var debeCargarNomenclatura = Opciones.accion=='editar' || Opciones.cargar == true;

		//Usada para mostrar la cortina de Loading...
		//@mostrar boolean True si se quiere mostrar la cortina, false en caso de querer ocultarla
		//@callback function función que se va a ejecutar tras finalizar la animación
		//@dataCallback object Objeto que se va a pasar a la función callback cuando se ejecute
		var fnMostrarCortina = function(mostrar, callback, dataCallback){
			//Si se debe mostrar la cortina
			if(mostrar){
				//Iniciamos a mostrar la cortina
				LoadingOverlap.show($scope, callback, dataCallback);
			}else{
				LoadingOverlap.hide($scope, callback, dataCallback);
			}
		};

		var copiarAlPortapapeles = function(texto) {
			// Crea un campo de texto "oculto"
			var aux = document.createElement("input");

			// Asigna el contenido del elemento especificado al valor del campo
			aux.setAttribute("value", texto);

			// Añade el campo a la página
			document.body.appendChild(aux);

			// Selecciona el contenido del campo
			aux.select();

			// Copia el texto seleccionado
			document.execCommand("copy");

			// Elimina el campo de la página
			document.body.removeChild(aux);
		}

		var setEntity = function(nomenclatura){
			$scope.entidad = {};
            $scope.entidad.idnomenclatura = nomenclatura.idnomenclatura;
            $scope.entidad.direccion = nomenclatura.direccion;
            $scope.entidad.informacionadicional = nomenclatura.informacionadicional;
            $scope.entidad.direccionvisual = nomenclatura.direccionVisual;
            $scope.entidad.direccionAnterior = nomenclatura.direccionAnterior;
            $scope.entidad.observacion = nomenclatura.observacion;
            if(nomenclatura.estado){
	            $scope.entidad.codigo_estado = nomenclatura.estado.codigo;
	            $scope.entidad.estado = nomenclatura.estado.nombre;
            }
            if(nomenclatura.predio){
	            $scope.entidad.npn = nomenclatura.predio.codigounico;
	            $scope.entidad.numero = nomenclatura.predio.numero;
            }
		};
		
		//Respuesta por defecto
		Opciones.respuesta = {type: 'canceled', data: null};

		//Mensaje para mostrar cuando se realiza una acción de guardar. CUando el mensaje es vacío no se muestra
		$scope.alert = {type: '', msg: ''};

		$scope.pluginNomenclaturaAbierto = false;

		$scope.verHistorico = true;
		$scope.loadingHistorico = false;
		$scope.historico = false;

		//Estados que puede tener una nomenclatura
        $scope.estadosPosibles = {
            'pendiente': 'Pendiente',
            'porverificar': 'Por Verificar',
            'porinvestigar': 'Por Investigar',
            'verificada': 'Verificada',
            'anulada': 'Anulada',
            'certificada': 'Certificada',
            'porcertificar': 'Por Certificar',
            'certificadaporsistema': 'Certificada por Sistema'
        };

        //En caso de que se deba cargar la nomenclatura inicialmente
		if(debeCargarNomenclatura){
			//Colocamos la cortina
			fnMostrarCortina(true);
			//Consultamos la nomenclatura
			NomenclaturaService
			.get(Opciones.nomenclatura.idnomenclatura)
			.then(function(respuesta){
				//Ocultamos la cortina
				fnMostrarCortina(false, function(respuesta){
					setEntity(respuesta.data);
				}, respuesta);
			}, function(error){
				//Ocultamos la cortina
				fnMostrarCortina(false, function(error){
					alert('Ha ocurrido un error. '+error.msg);
					setEntity({});
				}, error);
			});
		}else{
			setEntity({});
		}

		//Abre el plugin de nomenclatura y si hay algún cambio se modifica la nomenclatura local
        $scope.lanzarDialogoDireccion = function(){
        	$scope.pluginNomenclaturaAbierto = true;
        	PluginNomenclatura.obtenerModalIngresoDireccion($scope, function(data){
        		if(data.cambio){
	            	//Actualizamos la entidad local con la respuesta del server
	                $scope.entidad.direccion = data.direccion;
	                $scope.entidad.informacionadicional = data.infoAdicional;
	                $scope.entidad.direccionvisual = data.direccionVisual;
	                $scope.entidad.npn = data.npn;
	                $scope.entidad.numero = data.numero;
	            }
	            $scope.pluginNomenclaturaAbierto = false;
        	}, function(error){
        		alert(error);
        	})
        };

        //Copia al portapapeles el y muestra un mensaje Toast que se ha copiado el atributo que se pasa por parámetro
        $scope.copiar = function(atributo){
        	copiarAlPortapapeles( $scope.entidad[atributo] );
        	$.growl({ title: "Copiado", message: "Se ha copiado "+atributo });
        };


		//Se ejecuta cuando se presiona en actualizar
        $scope.actualizarEntidad = function(){
        	fnMostrarCortina(true);

        	NomenclaturaService
        	.actualizar($scope.entidad)
        	.then(
                function(response){
                	fnMostrarCortina(false, function(response){
	                	//Actualizamos la entidad local con la respuesta del server
	                    setEntity(response.data);
	                    Opciones.respuesta = {type: 'success', data: response.data};
	                    $scope.alert.type = 'success';
	                    $scope.alert.msg = response.msg;
                	}, response);
				},
				function(error){
					//Si tenemos algún error
                	fnMostrarCortina(false, function(error){
	                    $scope.alert.type = 'danger';
	                    $scope.alert.msg = error.msg;
                	}, error);
				}
            );
        };

        //Crea la entidad en servidor
        $scope.crearEntidad = function(){
        	fnMostrarCortina(true);

        	Nomenclaturax
        	.crear($scope.entidad)
        	.then(
        		function(response){
                	fnMostrarCortina(false, function(response){
	                	//Actualizamos la entidad local con la respuesta del server
	                    setEntity(response.data.nomenclatura);
	                    Opciones.respuesta = {type: 'success', data: response.data};
	                    $scope.alert.type = 'success';
	                    $scope.alert.msg = response.msg;
                	}, response);
        		},
				function(error){
					//Si tenemos algún error
                	fnMostrarCortina(false, function(error){
	                    $scope.alert.type = 'danger';
	                    $scope.alert.msg = error.msg;
                	}, error);
				}
        	);
        	return;
        };


        $scope.consultarHistorico = function(){
            $scope.loadingHistorico = true;
            Nomenclaturax.
            getHistorico($scope.entidad.idnomenclatura).
            then(function(data){
                $scope.loadingHistorico = false;
                $scope.historico = data;
            }, function(codigo, msg){
                nomenclatura.loading = false;
                alert('Error: '+msg);
            });
        };

		$scope.haveError = function(value, formCliente){
			return 	formCliente[value] && formCliente[value].$touched && 
					(
						formCliente[value].$error.required==true || 
						formCliente[value].$error.email==true || 
						formCliente[value].$error.tel==true || 
						formCliente[value].$error.minlength==true || 
						formCliente[value].$error.maxlength==true || 
						formCliente[value].$error.min==true || 
						formCliente[value].$error.max==true || 
						formCliente[value].$error.pattern==true
					);
		}
	 
	    $scope.cancelar = function (){
	    	$modalInstance.dismiss('cancel');
	    };
	}
]);
