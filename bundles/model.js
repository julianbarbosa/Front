saul.
		factory("ArtesEscenicasProductor", [
			"$resource",
			"root",
			function ($resource, root) {
				
				$(".overlap_espera").show();
				$(".overlap_espera_1").show();
	
				return $resource(root + "artesescenicas/consultar_datos_productor", {}, {
					'post': {method: 'POST', isArray: false},
					'query': {method: 'POST', isArray: false}
				});
			}
		]).
		// factory("ValidarPropiedadHorizontal", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "propiedadhorizontal/validar_propiedad_horizontal", {id: '@id'}, {
		// 			query: {method: 'POST', isArray: true}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasEvento", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artes/evento", {}, {
		// 			'query': {method: 'POST', isArray: false, transformResponse: function (json, headerGetter) {
		// 					return angular.fromJson(json);
		// 				}},
		// 			'post': {method: 'POST'}
		// 			//'query': {method: 'GET'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasActualizarEvento", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/actualizar_evento", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'POST'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasPdf", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/generar_pdf", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'POST'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasAforo", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/ver_datos_aforo", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'GET', transformResponse: function (json, headerGetter) {
		// 					return angular.fromJson(json);
		// 				}}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasSolicitud", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/consultar_solicitud", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'GET', isArray: false}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasArchivosSolicitud", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "tiposolicitud/:idTipoSolicitud/listartiposdocumento", {idTipoSolicitud: '@idTipoSolicitud'}, {
		// 			'get': {method: 'GET', isArray: true},
		// 			'query': {method: 'GET'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasConsultarArchivos", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "solicitud/:idSolicitud/listardocs/:idTipoDocumento", {idSolicitud: '@idSolicitud', idTipoDocumento: '@idTipoDocumento'}, {
		// 			'get': {method: 'GET'},
		// 			'query': {method: 'GET'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasGuardarArchivos", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "/solicitud/:idSolicitud/adjuntar/:idTipoDocumento", {idsolicitud: '@idSolicitud', idTipoDocumento: '@idTipoDocumento'}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'POST'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasEliminarArchivos", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "solicitud/:idSolicitud/eliminardoc/:idSolicitudXDocumento", {idSolicitud: '@idSolicitud', idSolicitudXDocumento: '@idSolicitudXDocumento'}, {
		// 			'post': {method: 'POST'},
		// 			'get': {method: 'GET'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasPdfContador", ['root', function (root) {
		// 		return {
		// 			openPdfContador: openPdfContador
		// 		};

		// 		function openPdfContador(data) {
		// 			window.open(root + 'artesescenicas/pdf_contador?datospdf=' + angular.toJson(data));
		// 		}
		// 		;
		// 	}
		// ]).
		// factory("ArtesEscenicasPdfRadicado", ['root', function (root) {
		// 		return {
		// 			openPdfRadicado: openPdfRadicado
		// 		};

		// 		function openPdfRadicado(data) {
		// 			window.open(root + 'artesescenicas/pdf_radicado?idsolicitud=' + angular.toJson(data.idsolicitud));
		// 		}
		// 		;
		// 	}
		// ]).
		// factory("ArtesEscenicasDiasEvento", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/ver_dias_evento", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'GET'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasRadicar", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/radicar", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'POST'}
		// 		});
		// 	}
		// ]).
		// factory("ArtesEscenicasVerArchivos", ['root', function (root) {
		// 		return {
		// 			openFile: openFile
		// 		};

		// 		function openFile(data) {
		// 			window.open(root + "solicitud/" + data.idSolicitud + "/visualizardoc/" + data.idDocumento + "/" + data.idSolicitudXDocumento);
		// 		}
		// 		;
		// 	}
		// ]).
		// factory("ArtesEscenicasActualizarCorreo", [
		// 	"$resource",
		// 	"root",
		// 	function ($resource, root) {
		// 		return $resource(root + "artesescenicas/actualizar_correo", {}, {
		// 			'post': {method: 'POST'},
		// 			'query': {method: 'GET'}
		// 		});
		// 	}
		// ]).
		factory("TipoSolicitud", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "tiposolicitud/", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("Licencia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "licencia/consultar", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("AsignacionVisita", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignacionvisita/crear",{}, {
					query: {method: 'POST', isArray: false},
				});
			}
		]).
		factory("ConsultarAsignacionesControlPosterior", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignacionvisita/consultar", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosResolverPedagogia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/resolverpedagogia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("MovimientoComparendo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/movimientocomparendo/:id", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("Audiencia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/audiencia/:id", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosPrimeraInstancia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/primerainstancia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosSegundaInstancia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/segundainstancia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosPorVerificar", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/comparendoporverificar", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("SegundaInstanciaComparendo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/segundainstancia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("GoogleCalendar", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/consultarcalendario/:fechaInicial/:fechaFinal", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).factory("CerrarLineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineademarcacion/cerrar/:id", {
			'query1': {method: 'GET', isArray: false}
		});
	}
]).
		factory("ConsultaLineaDemarcacionLadoManzana", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "lineademarcacion/consulta/ladomanzana", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("LineaDemarcacionLadoManzana", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "lineademarcacion/:id/:direccion/:npn", {
					'query1': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("LineaDemarcacionLadoManzana2", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "lineademarcacionladomanzana/:tipoviaprincipal/:nombreviaprincipal/:tipoviasecundaria/:nombreviasecundaria", {
					'query1': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("SIG", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "sig/buscar", {
					'query': {method: 'GET', isArray: true}
				});
			}
		]).
		factory("AsistentesProgramacionPedagogia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/asistentesprogramacionpedagogia/:id", {
					'get': {method: 'GET', isArray: false},
					'query': {method: 'GET', isArray: false}
				});
			}
		])
		.factory("ListarTiposDocIdentificacion", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "tipodocidentificacion/all", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		]).
		factory("MostrarSolicitudAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("ListarSolicitudAsignacion", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/listar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("CrearSolicitudAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/create", {}, {
					query: {method: 'POST', isArray: false}
				});
			}
		]).
		factory("ActualizarSolicitudAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/:idsolicitud/edit", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					post: {method: 'POST', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("ConfirmarDatosAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/confirmardatos/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ConsultarSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/consultar_por_identificacion", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ActualizarSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/actualizar_solicitante", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("CrearSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/crear_solicitante", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("CrearUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/crear", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("AsignarNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				console.warn("El root es...", root, "   y la ruta es:", root + "nomenclatura");
				return $resource(root + "nomenclatura/testing", {}, {
					//return $resource(root+"lineas", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]);
saul.factory("TipoDocIdentificacion", ["$resource", "root", function (a, b) {
		return a(b + "tipodocidentificacion/", {}, {
			query: {
				method: "GET",
				isArray: true
			}
		})
	}]).factory("Comparendo", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/comparendo/id/:id/:numeroFormato", {}, {
			find: {
				method: "GET",
				isArray: false
			},
			query: {
				method: "GET",
				isArray: false
			}
		})
	}]).factory("ComparendoAll", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/comparendo/all/:id/:numeroFormato", {}, {
			find: {
				method: "GET",
				isArray: false
			},
			query: {
				method: "GET",
				isArray: false
			}
		})
	}]).factory("Pedagogia", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/pedagogia/:id", {}, {
			find: {
				method: "GET",
				isArray: false
			},
			query: {
				method: "GET",
				isArray: false
			},
			save: {
				method: 'POST'
			}
		})
	}]).factory("ProgramacionPedagogia", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/programacionpedagogia/:id", {}, {
			query: {
				method: "GET",
				isArray: false
			},
			save: {
				method: 'POST'
			}
		})
	}]).factory("LineaDemarcacionIDESC", ["$resource", "root", function ($resource, root) {
		return $resource(root + "idesc/lineas/:id", {}, {
			find: {
				method: "GET",
				isArray: !1
			}
		})
	}]).factory("SolicitudLineaDemarcacion", ["$resource", "root", function ($resource, root) {
		return $resource(root + "lineademarcacion/obtenersolicitudesabiertas/:npn", {
			npn: "@npn"
		}, {
			query: {
				method: "GET",
				isArray: !1
			}
		})
	}]).factory("ObservacionesDevolucion", ["$resource", "root", function ($resource, root) {
		return $resource(root + "movimiento_solicitud/observaciones_devolucion/:id", {
			id: "@id"
		}, {
			query: {
				method: "GET",
				isArray: !1
			}
		})
	}]).factory("AprobarFirmaCertificadoNomenclatura", ["$resource", "root", function ($resource, root) {
		return $resource(root + "certificado_nomenclatura/aprobar_firma/", {}, {
			query: {
				method: "GET",
				isArray: false
			},
			save: {
				method: "POST"
			}
		})
	}]).factory("DevolverCertificadoNomenclatura", ["$resource", "root", function ($resource, root) {
		return $resource(root + "certificado_nomenclatura/devolver/", {}, {
			query: {
				method: "GET",
				isArray: !1
			},
			save: {
				method: "POST"
			}
		})
	}]).factory("SolicitudXNomenclatura", ["$resource", "root", function ($resource, root) {
		return $resource(root + "solicitudxnomenclatura/:idsolicitud", {
			direccion: "@idsolicitud"
		}, {
			find: {
				method: "GET",
				isArray: !0
			}
		})
	}]).factory("EstadosNomenclatura", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "nomenclatura/estados", {}, {
			query: {method: 'GET', isArray: true}
		});
	}]).
		factory("ConfirmarDatosCertifNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/confirmardatos/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ListarNomenclaturas", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "nomenclatura/listar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("ListarLogsProcesoNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/listar_logs", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("ListarProcesos", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/listar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("ProcesoAutorizar", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/autorizar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							try {
								var fromJson = angular.fromJson(json);
								fromJson.json = json;
								return fromJson;
							} catch (error) {
								if (headerGetter.status == 403) {
									return {success: false, msg: 'No tiene permisos para ejecutar esta acción.'};
								} else {
									return {success: false, msg: headerGetter.statusText}
								}
							}
						}
					}
				});
			}
		]).
		factory("Proceso2Ready", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/to_ready", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							try {
								var fromJson = angular.fromJson(json);
								fromJson.json = json;
								return fromJson;
							} catch (error) {
								if (headerGetter.status == 403) {
									return {success: false, msg: 'No tiene permisos para ejecutar esta acción.'};
								} else {
									return {success: false, msg: headerGetter.statusText}
								}
							}
						}
					}
				});
			}
		]).
		factory("ListarActividadesUsoSuelo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + ":idComuna/:idBarrio/:idAreaActividad/:idTipo/:idVocacion", {idComuna: 'idComuna', idBarrio: 'idBarrio', idAreaActividad: 'idAreaActividad', idTipo: 'idTipo', idVocacion: 'idVocacion'}, {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'},
				});
			}
		]).
		factory("GuardarConsultaActividadesUsoSuelo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usosuelo/guardarconsultaactividades", {}, {
					'save': {method: 'POST'}
				});
			}
		]).
		factory("MostrarSolicitudCertifNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("ActualizarSolicitudCertifNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/:idsolicitud/edit", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					post: {method: 'POST', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("Nomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "nomenclatura", {}, {
					query: {method: 'GET', isArray: true}
				});
			}
		]).factory("CertificadoNomenclatura", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "certificado_nomenclatura/gestionar/:direccion", {direccion: '@direccion'}, {
			query: {method: 'GET', isArray: false},
			save: {method: 'POST'}
		});
	}
])
		.factory("DevolverCertificadoNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/devolver/", {}, {
					query: {method: 'GET', isArray: false},
					save: {method: 'POST'}
				});
			}
		])
		.factory("FirmaCertificadoNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/firmar/", {}, {
					query: {method: 'GET', isArray: false},
					save: {method: 'POST'}
				});
			}
		])
		.factory("CausasNegacionNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "causa_negacion_nomenclatura", {}, {
					query: {method: 'GET', isArray: true}
				});
			}
		])
		.factory("Predio", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "predio/", {}, {
					query: {method: 'GET', isArray: true}
				});
			}
		]).factory("Infraccion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "infraccion/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Usuario", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "usuario/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Solicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "solicitud/:id", {id: '@id'}, {
			save: {method: 'POST'},
			query: {method: 'GET', isArray: false},
			find: {method: 'GET', isArray: false}
		});
	}
])
		.factory("TareaSolicitud", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "tareasolicitud/:id", {id: '@id'}, {
					query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}
					}
				});
			}
		]).factory("MovimientoSolicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "movimiento_solicitud/:id", {id: '@id'}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("SolicitudXDocumento", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "solicitudxdocumento/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("InfraccionXSolicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "infraccionxsolicitud/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Hora", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "controlpolicivo/hora", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Hora", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "controlpolicivo/hora", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Fecha", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "controlpolicivo/fecha", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Comuna", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comuna/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Vereda", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "vereda/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Corregimiento", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "corregimiento/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ComunaAll", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comuna/all", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Barrio", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "barrio/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ComportamientoContrario", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comportamientocontrario/:clave/:idPadre", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ComportamientoContrarioAll", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comportamientocontrario/all/all", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Tercero", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tercero/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Ciudad", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "ciudad/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("HistorialVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/historial/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Visita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/:id", {}, {
			find: {method: 'GET', isArray: false},
			query: {method: 'GET', isArray: false},
			create: {method: 'POST', isArray: true}
		});
	}
]).factory("VisitaTodo", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/todo", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Visitaxdocumento", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visitaxdocumento/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("TipoVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tipo_visita/:id", {}, {
			find: {method: 'GET', isArray: false},
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("FormularioVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/generar/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("EncabezadoVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/encabezado/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("EstadoXSolicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "estado/consultar_por_solicitud/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Abogados", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "abogado/consultar_por_tipo_solicitud/:idTipoSolicitud", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("TecnicosVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tecnicosvisita/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("AreaActividad", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "idesc/consultar_area_actividad/:id", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Idesc", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "idesc/:id", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("TipoVia", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tipo_via/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ClaseVia", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "clase_via/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("LineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineas/:id/:idLinea", {}, {
			find: {method: 'GET', isArray: false},
			save: {method: 'POST'},
			locate: {method: "DELETE", isArray: !1},
			findall: {method: "PATCH", isArray: false}
		});
	}
]).factory("FirmaLineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineas/firmar_certificado/:id", {}, {
			save: {method: 'POST'}
		});
	}
]).factory("DevolverLineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineas/devolver", {}, {
			save: {method: 'POST'}
		});
	}
]).factory("Frente", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "frente/:id", {}, {
			find: {method: 'GET', isArray: true}
		});
	}
]).factory("Demarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "demarcacion/:id", {}, {
			find: {method: 'GET', isArray: true}
		});
	}
])

		.factory("listarUsuarios", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listarusuarios", {}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		])


		.factory("desactivarUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/desactivarusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])

		.factory("activarUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/activarusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])

		.factory("listarGruposxUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listargruposxusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])

		.factory("listarGruposxIDUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listargruposxidusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])
//Servicio para abrir un formulario en otra ventana. Es útil en caso de previsualización de un pdf
		.factory("UtilForm", [function () {
				return {
					/**
					 * Abre una nueva ventana con los parámetros especificados
					 * @param  {String}     url    Url que se va a abrir
					 * @param  {String}     method Puede ser post o get
					 * @param  {Array}      data   Arreglo con objetos {name, value} que serán los datos enviados
					 */
					openWith: function (url, method, data) {
						var f = document.createElement('form');
						f.innerHTML = '';
						f.setAttribute('method', method);
						f.setAttribute('action', url);
						f.setAttribute('style', 'display: none');

						for (var i = data.length - 1; i >= 0; i--) {
							var input = document.createElement("input");
							input.setAttribute('type', "text");
							input.setAttribute('name', data[i].name);
							input.setAttribute('value', data[i].value);
							f.appendChild(input);
							console.warn(data[i].value);
						}

						document.body.appendChild(f);

						var win = window.open('', 'ventanaPrevisualizacion');
						f.target = 'ventanaPrevisualizacion';
						f.submit();
						f.parentElement.removeChild(f);
					}
				};
			}])
		.factory("ListarBarrios", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "barrio/", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		])

		.factory("ListarGrupos", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listargrupos", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		])
		.factory("PluginNomenclatura", ['urlPlugInNomenclatura', function (urlPlugInNomenclatura) {
				return {
					obtenerModalIngresoDireccion: function ($scope, fnClose, fnError) {

						$('body').append(
								'<div id="__urlPlugInNomenclatura__hiddens_plugin_direccion">' +
								'<input id="__urlPlugInNomenclatura__npn" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__direccion" type="hidden">' +
								'<input id="__urlPlugInNomenclatura__infoAdicional" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__direccionVisual" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__predioId" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__nomenclaturaId" type="hidden" />' +
								'</div>' +
								'<div id="__urlPlugInNomenclatura__modalIngresoDireccion" class="modal fade modal-change" role="dialog" aria-hidden="true" ></div>'
								);
						var modalDireccion = $('#__urlPlugInNomenclatura__modalIngresoDireccion');
						__cerrarModalPlugInNomenclatura0 = function () {
							modalDireccion.modal('hide');
						};
						__cerrarModalPlugInNomenclatura1 = function () {

							$scope.$apply(function () {
								fnClose(
										{
											npn: document.getElementById('__urlPlugInNomenclatura__npn').value,
											direccion: document.getElementById('__urlPlugInNomenclatura__direccion').value,
											infoAdicional: document.getElementById('__urlPlugInNomenclatura__infoAdicional').value ? document.getElementById('__urlPlugInNomenclatura__infoAdicional').value.trim() : null,
											direccionVisual: document.getElementById('__urlPlugInNomenclatura__direccionVisual').value,
											predioId: document.getElementById('__urlPlugInNomenclatura__predioId').value,
											nomenclaturaId: document.getElementById('__urlPlugInNomenclatura__nomenclaturaId').value,
											cambio: !(document.getElementById('__urlPlugInNomenclatura__npn').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__direccion').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__direccionVisual').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__predioId').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__nomenclaturaId').value == '')
										}
								);
							});

							$('#__urlPlugInNomenclatura__hiddens_plugin_direccion').remove();
							modalDireccion.remove();
						};


						$(".overlap_espera").show();
						$(".overlap_espera_1").show();

						$.ajax({
							url: urlPlugInNomenclatura,
							data: {
								fieldNamecallbackFunction: '__cerrarModalPlugInNomenclatura0',
								fieldNameNPNrequerido: false,
								activarBusqueda: true,
								fieldNameDiv: "__urlPlugInNomenclatura__modalIngresoDireccion",
								fieldNameNumeroUnico: "__urlPlugInNomenclatura__npn",
								fieldNameDireccion: "__urlPlugInNomenclatura__direccion",
								fieldNameDireccionVisual: "__urlPlugInNomenclatura__direccionVisual",
								fieldNameDireccionAdicional: "__urlPlugInNomenclatura__infoAdicional",
								fieldNameIdPredio: "__urlPlugInNomenclatura__predioId",
								fieldNameIdNomenclatura: "__urlPlugInNomenclatura__nomenclaturaId"
							},
							success: function (a) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									modalDireccion.empty();
									modalDireccion.append(a);
									modalDireccion.on('hidden.bs.modal', function (e) {
										__cerrarModalPlugInNomenclatura1();
									})
									modalDireccion.modal("show");
								});
							},
							error: function (jqXHR, textStatus) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									fnError("Ha ocurrido un error. Intente nuevamente o consulte al administrador (Error: " + textStatus + ")")
								});
							}
						});
					}
				}
			}])
		.factory('DevolverSolicitud', ['$q', '$http', 'root', function ($q, $http, root) {
				function fnError(defered, errorHttp) {
					var msg = 'Error: ';
					switch (errorHttp.status) {
						case 500:
							msg += 'Error interno en el servidor. Intente nuevamente o consulte al administrador.';
							break;
						case 403:
							msg += 'No tiene permisos para realizar esta acción.';
							break;
						case 503:
							msg += 'Servicio no disponible temporalmente.';
							break;
						case 401:
							msg += 'No ha sido posible encontrar la ruta.';
							break;
						default:
							msg = 'Error ' + errorHttp.status + ': ' + errorHttp.statusText;
							break;
					}

					defered.reject({status: errorHttp.status, msg: msg, success: false});
				}

				function fnSuccess(defered, response) {
					var data = response.data;
					if (data.success) {
						defered.resolve(data);
					} else {
						defered.reject(data);
					}
				}

				var urls = {
					'certificadonomenclatura': 'certificado_nomenclatura/reset/',
					'asignacion_nomenclatura': 'asignomenclatura/reset/',
				}

				return {
					/**
					 * Devuelve una solicitud de Certificado de nomenclatura a estado Pendiente
					 */
					devolver: function (idSolicitud, codigoTipoSolicitud, observaciones) {
						var defered = $q.defer();
						if (typeof urls[codigoTipoSolicitud] == 'undefined') {
							defered.reject({msg: 'Operación no implementada para este tipo de solicitud.', success: false, data: null});
						} else {
							$http
									.post(root + urls[codigoTipoSolicitud] + idSolicitud, {observaciones: observaciones})
									.then(
											function (response) {
												fnSuccess(defered, response)
											}, function (error) {
										fnError(defered, error);
									}
									);
						}
						return defered.promise;
					}
				};

			}])

		.factory('LoadingOverlap', [function () {
				function show($scope, callback, dataCallback) {
					//Iniciamos a mostrar la cortina
					$(".overlap_espera").show();
					$(".overlap_espera_1").show(function () {
						//Si se pasa un callback se ejecutará al finalizar la animación
						if (callback) {
							$scope.$apply(function () {
								callback(dataCallback);
							});
						}
					});
				}

				function hide($scope, callback, dataCallback) {
					//Iniciamos a mostrar la cortina
					$(".overlap_espera").fadeOut(500, "linear");
					$(".overlap_espera_1").fadeOut(500, function () {
						//Si se pasa un callback se ejecutará al finalizar la animación
						if (callback) {
							$scope.$apply(function () {
								callback(dataCallback);
							});
						}
					});
				}
				return {
					show: show,
					hide: hide
				};
			}])

		.factory('MyHttp', ['$q', '$http', 'root', function ($q, $http, root) {
				function fnError(defered, errorHttp) {
					var msg = 'Error ' + errorHttp.status + ': ';
					switch (errorHttp.status) {
						case 500:
							msg += 'Error interno en el servidor. Intente nuevamente o consulte al administrador.';
							break;
						case 403:
							msg += 'No tiene permisos para acceder.';
							break;
						case 503:
							msg += 'Servicio no disponible temporalmente.';
							break;
						case 401:
							msg += 'No ha sido posible encontrar la ruta.';
							break;
						case 405:
							msg += 'Método GET o POST no permitido.';
							break;
						default:
							msg += errorHttp.statusText;
							break;
					}
					defered.reject({status: errorHttp.status, msg: msg, success: false});
				}

				function fnSuccess(defered, response) {
					var data = response.data;
					if (data.success) {
						defered.resolve(data);
					} else {
						defered.reject(data);
					}
				}

				function myHttp(ruta, method, params) {
					var defered = $q.defer();
					//var ruta = root + 'fnomenclatura/buscarnpn';
					var config = {
						url: ruta,
						method: method,
						transformResponse: function (data, headersGetter, status) {
							try {
								return angular.fromJson(data);
							} catch (error) {
								return {success: false, msg: 'Error de respuesta, se espera un JSON.'}
							}
						}
					};
					if (method == 'GET') {
						config.params = params;
					} else {
						config.data = params;
					}
					$http(config)
							.then(
									function (response) {
										fnSuccess(defered, response);
									},
									function (error) {
										fnError(defered, error);
									}
							);
					return defered.promise;
				}

				return {
					myHttp: myHttp
				}

			}])


		.factory('NomenclaturaService', ['$q', 'root', 'MyHttp', function ($q, root, MyHttp) {

				return {
					//Devuelve una nomenclatura
					get: function (idNomenclatura) {
						return MyHttp.myHttp(
								root + "nomenclatura/" + idNomenclatura,
								'GET',
								{}
						);
					},

					//Actualiza una nomenclatura
					actualizar: function (objetNomenclatura) {
						return MyHttp.myHttp(
								root + "nomenclatura/actualizar/" + objetNomenclatura.idnomenclatura,
								'POST',
								objetNomenclatura
								);
					},
					//Crea una nomenclatura en estado certificada
					crearCertificada: function (objetNomenclatura) {
						return MyHttp.myHttp(
								root + "nomenclatura/crear_certificada",
								'POST',
								objetNomenclatura
								);
					}
				};
			}])

saul.
		factory("TipoSolicitud", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "tiposolicitud/", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("Licencia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "licencia/consultar", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("AsignacionVisita", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignacionvisita/crear",{}, {
					query: {method: 'POST', isArray: false},
				});
			}
		]).
		factory("ConsultarAsignacionesControlPosterior", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignacionvisita/consultar", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosResolverPedagogia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/resolverpedagogia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("MovimientoComparendo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/movimientocomparendo/:id", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("Audiencia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/audiencia/:id", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosPrimeraInstancia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/primerainstancia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosSegundaInstancia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/segundainstancia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ComparendosPorVerificar", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/comparendoporverificar", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("SegundaInstanciaComparendo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/segundainstancia", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("GoogleCalendar", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/consultarcalendario/:fechaInicial/:fechaFinal", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).factory("CerrarLineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineademarcacion/cerrar/:id", {
			'query1': {method: 'GET', isArray: false}
		});
	}
]).
		factory("ConsultaLineaDemarcacionLadoManzana", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "lineademarcacion/consulta/ladomanzana", {
					'query': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("LineaDemarcacionLadoManzana", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "lineademarcacion/:id/:direccion/:npn", {
					'query1': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("LineaDemarcacionLadoManzana2", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "lineademarcacionladomanzana/:tipoviaprincipal/:nombreviaprincipal/:tipoviasecundaria/:nombreviasecundaria", {
					'query1': {method: 'GET', isArray: false}
				});
			}
		]).
		factory("SIG", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "sig/buscar", {
					'query': {method: 'GET', isArray: true}
				});
			}
		]).
		factory("AsistentesProgramacionPedagogia", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "controlpolicivo/asistentesprogramacionpedagogia/:id", {
					'get': {method: 'GET', isArray: false},
					'query': {method: 'GET', isArray: false}
				});
			}
		])
		.factory("ListarTiposDocIdentificacion", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "tipodocidentificacion/all", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		]).
		factory("MostrarSolicitudAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("ListarSolicitudAsignacion", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/listar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("CrearSolicitudAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/create", {}, {
					query: {method: 'POST', isArray: false}
				});
			}
		]).
		factory("ActualizarSolicitudAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/:idsolicitud/edit", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					post: {method: 'POST', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("ConfirmarDatosAsigNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "asignomenclatura/confirmardatos/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ConsultarSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/consultar_por_identificacion", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ActualizarSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/actualizar_solicitante", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("CrearSolicitante", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/crear_solicitante", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("CrearUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usuario/crear", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("AsignarNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				console.warn("El root es...", root, "   y la ruta es:", root + "nomenclatura");
				return $resource(root + "nomenclatura/testing", {}, {
					//return $resource(root+"lineas", {}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]);
saul.factory("TipoDocIdentificacion", ["$resource", "root", function (a, b) {
		return a(b + "tipodocidentificacion/", {}, {
			query: {
				method: "GET",
				isArray: true
			}
		})
	}]).factory("Comparendo", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/comparendo/id/:id/:numeroFormato", {}, {
			find: {
				method: "GET",
				isArray: false
			},
			query: {
				method: "GET",
				isArray: false
			}
		})
	}]).factory("ComparendoAll", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/comparendo/all/:id/:numeroFormato", {}, {
			find: {
				method: "GET",
				isArray: false
			},
			query: {
				method: "GET",
				isArray: false
			}
		})
	}]).factory("Pedagogia", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/pedagogia/:id", {}, {
			find: {
				method: "GET",
				isArray: false
			},
			query: {
				method: "GET",
				isArray: false
			},
			save: {
				method: 'POST'
			}
		})
	}]).factory("ProgramacionPedagogia", ["$resource", "root", function ($resource, root) {
		return $resource(root + "controlpolicivo/programacionpedagogia/:id", {}, {
			query: {
				method: "GET",
				isArray: false
			},
			save: {
				method: 'POST'
			}
		})
	}]).factory("LineaDemarcacionIDESC", ["$resource", "root", function ($resource, root) {
		return $resource(root + "idesc/lineas/:id", {}, {
			find: {
				method: "GET",
				isArray: !1
			}
		})
	}]).factory("SolicitudLineaDemarcacion", ["$resource", "root", function ($resource, root) {
		return $resource(root + "lineademarcacion/obtenersolicitudesabiertas/:npn", {
			npn: "@npn"
		}, {
			query: {
				method: "GET",
				isArray: !1
			}
		})
	}]).factory("ObservacionesDevolucion", ["$resource", "root", function ($resource, root) {
		return $resource(root + "movimiento_solicitud/observaciones_devolucion/:id", {
			id: "@id"
		}, {
			query: {
				method: "GET",
				isArray: !1
			}
		})
	}]).factory("AprobarFirmaCertificadoNomenclatura", ["$resource", "root", function ($resource, root) {
		return $resource(root + "certificado_nomenclatura/aprobar_firma/", {}, {
			query: {
				method: "GET",
				isArray: false
			},
			save: {
				method: "POST"
			}
		})
	}]).factory("DevolverCertificadoNomenclatura", ["$resource", "root", function ($resource, root) {
		return $resource(root + "certificado_nomenclatura/devolver/", {}, {
			query: {
				method: "GET",
				isArray: !1
			},
			save: {
				method: "POST"
			}
		})
	}]).factory("SolicitudXNomenclatura", ["$resource", "root", function ($resource, root) {
		return $resource(root + "solicitudxnomenclatura/:idsolicitud", {
			direccion: "@idsolicitud"
		}, {
			find: {
				method: "GET",
				isArray: !0
			}
		})
	}]).factory("EstadosNomenclatura", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "nomenclatura/estados", {}, {
			query: {method: 'GET', isArray: true}
		});
	}]).
		factory("ConfirmarDatosCertifNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/confirmardatos/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false}
				});
			}
		]).
		factory("ListarNomenclaturas", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "nomenclatura/listar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("ListarLogsProcesoNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/listar_logs", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("ListarProcesos", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/listar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							var fromJson = angular.fromJson(json);
							fromJson.json = json;
							return fromJson;
						}
					}
				});
			}
		]).
		factory("ProcesoAutorizar", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/autorizar", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							try {
								var fromJson = angular.fromJson(json);
								fromJson.json = json;
								return fromJson;
							} catch (error) {
								if (headerGetter.status == 403) {
									return {success: false, msg: 'No tiene permisos para ejecutar esta acción.'};
								} else {
									return {success: false, msg: headerGetter.statusText}
								}
							}
						}
					}
				});
			}
		]).
		factory("Proceso2Ready", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "proceso/to_ready", {}, {
					query: {
						method: 'GET',
						isArray: false,
						transformResponse: function (json, headerGetter) {
							try {
								var fromJson = angular.fromJson(json);
								fromJson.json = json;
								return fromJson;
							} catch (error) {
								if (headerGetter.status == 403) {
									return {success: false, msg: 'No tiene permisos para ejecutar esta acción.'};
								} else {
									return {success: false, msg: headerGetter.statusText}
								}
							}
						}
					}
				});
			}
		]).
		factory("ListarActividadesUsoSuelo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + ":idComuna/:idBarrio/:idAreaActividad/:idTipo/:idVocacion", {idComuna: 'idComuna', idBarrio: 'idBarrio', idAreaActividad: 'idAreaActividad', idTipo: 'idTipo', idVocacion: 'idVocacion'}, {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'},
				});
			}
		]).
		factory("GuardarConsultaActividadesUsoSuelo", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "usosuelo/guardarconsultaactividades", {}, {
					'save': {method: 'POST'}
				});
			}
		]).
		factory("MostrarSolicitudCertifNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/:idsolicitud", {idsolicitud: '@idsolicitud'}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("ActualizarSolicitudCertifNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/:idsolicitud/edit", {idsolicitud: '@idsolicitud'}, {
					query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					post: {method: 'POST', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		]).
		factory("Nomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "nomenclatura", {}, {
					query: {method: 'GET', isArray: true}
				});
			}
		]).factory("CertificadoNomenclatura", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "certificado_nomenclatura/gestionar/:direccion", {direccion: '@direccion'}, {
			query: {method: 'GET', isArray: false},
			save: {method: 'POST'}
		});
	}
])
		.factory("DevolverCertificadoNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/devolver/", {}, {
					query: {method: 'GET', isArray: false},
					save: {method: 'POST'}
				});
			}
		])
		.factory("FirmaCertificadoNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "certificado_nomenclatura/firmar/", {}, {
					query: {method: 'GET', isArray: false},
					save: {method: 'POST'}
				});
			}
		])
		.factory("CausasNegacionNomenclatura", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "causa_negacion_nomenclatura", {}, {
					query: {method: 'GET', isArray: true}
				});
			}
		])
		.factory("Predio", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "predio/", {}, {
					query: {method: 'GET', isArray: true}
				});
			}
		]).factory("Infraccion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "infraccion/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Usuario", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "usuario/", {}, {
			query: {method: 'GET', isArray: false,}
		});
	}

]).factory("UsuarioActual", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "usuario/actual/", {}, {
			query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
                return angular.fromJson(json);
            }}
		});
	}
]).factory("Solicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "solicitud/:id", {id: '@id'}, {
			save: {method: 'POST'},
			query: {method: 'GET', isArray: false},
			find: {method: 'GET', isArray: false}
		});
	}
])
		.factory("TareaSolicitud", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "tareasolicitud/:id", {id: '@id'}, {
					query: {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}
					}
				});
			}
		]).factory("MovimientoSolicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "movimiento_solicitud/:id", {id: '@id'}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("SolicitudXDocumento", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "solicitudxdocumento/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("InfraccionXSolicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "infraccionxsolicitud/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Hora", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "controlpolicivo/hora", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Hora", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "controlpolicivo/hora", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Fecha", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "controlpolicivo/fecha", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Comuna", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comuna/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Vereda", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "vereda/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Corregimiento", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "corregimiento/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ComunaAll", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comuna/all", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Barrio", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "barrio/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ComportamientoContrario", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comportamientocontrario/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ComportamientoContrarioAll", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "comportamientocontrario/all/all", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Tercero", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tercero/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Ciudad", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "ciudad/:clave", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("HistorialVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/historial/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Visita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/:id", {}, {
			find: {method: 'GET', isArray: false},
			query: {method: 'GET', isArray: false},
			create: {method: 'POST', isArray: true}
		});
	}
]).factory("VisitaTodo", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/todo", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Visitaxdocumento", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visitaxdocumento/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("TipoVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tipo_visita/:id", {}, {
			find: {method: 'GET', isArray: false},
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("FormularioVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/generar/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("EncabezadoVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "visita/encabezado/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("EstadoXSolicitud", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "estado/consultar_por_solicitud/:id", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("Abogados", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "abogado/consultar_por_tipo_solicitud/:idTipoSolicitud", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("TecnicosVisita", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tecnicosvisita/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("AreaActividad", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "idesc/consultar_area_actividad/:id", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("Idesc", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "idesc/:id", {}, {
			query: {method: 'GET', isArray: false}
		});
	}
]).factory("TipoVia", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "tipo_via/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("ClaseVia", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "clase_via/", {}, {
			query: {method: 'GET', isArray: true}
		});
	}
]).factory("LineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "linea_demarcacion/:id/:idLinea", {}, {
			find: {method: 'GET', isArray: false},
			save: {method: 'POST'},
			locate: {method: "DELETE", isArray: !1},
			findall: {method: "PATCH", isArray: false}
		});
	}
]).factory("FirmaLineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineas/firmar_certificado/:id", {}, {
			save: {method: 'POST'}
		});
	}
]).factory("DevolverLineaDemarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "lineas/devolver", {}, {
			save: {method: 'POST'}
		});
	}
]).factory("Frente", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "frente/:id", {}, {
			find: {method: 'GET', isArray: true}
		});
	}
]).factory("Demarcacion", [
	"$resource",
	"root",
	function ($resource, root) {
		return $resource(root + "demarcacion/:id", {}, {
			find: {method: 'GET', isArray: true}
		});
	}
])


		.factory("listarUsuarios", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listarusuarios", {}, {
					'query': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET', isArray: false, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}}
				});
			}
		])


		.factory("desactivarUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/desactivarusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])

		.factory("activarUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/activarusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])

		.factory("listarGruposxUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listargruposxusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])

		.factory("listarGruposxIDUsuario", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listargruposxidusuario", {
					'query': {method: 'GET', isArray: false}
				});
			}
		])
		.factory('Nomenclaturax', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {
				function fnError(defered, errorHttp) {
					var msg = 'Error ' + errorHttp.status + ': ';
					switch (errorHttp.status) {
						case 500:
							msg += 'Error interno en el servidor. Intente nuevamente o consulte al administrador.';
							break;
						case 403:
							msg += 'No tiene permisos para acceder.';
							break;
						case 503:
							msg += 'Servicio no disponible temporalmente.';
							break;
						case 401:
							msg += 'No ha sido posible encontrar la ruta.';
							break;
						default:
							msg += errorHttp.statusText;
							break;
					}
					defered.reject({status: errorHttp.status, msg: msg});
				}

				function fnSuccess(defered, response) {
					var data = response.data;
					if (data.success) {
						defered.resolve(data.data);
					} else {
						defered.reject({status: '', msg: data.msg});
					}
				}

				return {
					getDataConsultaCertificadoInterno: function (codigo) {
						var defered = $q.defer();
						$http
								.get(root + 'certificado_nomenclatura/consultar_interno/' + codigo)
								.then(
										function (response) {
											fnSuccess(defered, response)
										},
										function (error) {
											fnError(defered, error);
										}
								);
						return defered.promise;
					},
					/**
					 * Consulta el histórico de una nomenclatura
					 * @param idNomenclatura Id de la nomenclatura
					 */
					getHistorico: function (idNomenclatura) {
						var defered = $q.defer();
						var ruta = root + 'fnomenclatura/historico/' + idNomenclatura;
						$http
								.get(ruta)
								.then(
										function (response) {
											fnSuccess(defered, response)
										}, function (error) {
									fnError(defered, error);
								}
								);

						return defered.promise;
					},
					/**
					 * Devuelve la información de un predio y sus nomenclaturas.
					 * @param npn Número predial nacional que se desea encontrar.
					 */
					getInfoPorNpn: function (npn) {
						var defered = $q.defer();
						var ruta = root + 'fnomenclatura/buscarnpn';
						$http({
							url: ruta,
							method: 'GET',
							params: {
								npn: npn
							}
						})
								.then(
										function (response) {
											fnSuccess(defered, response);
										}, function (error) {
									fnError(defered, error);
								});

						return defered.promise;
					},
					/**
					 * Devuelve la información de un predio y sus nomenclaturas.
					 * @param nomenclatura {idNomenclatura, direccion, informacionadicional, direccionVisual, npn, observacion} Número predial nacional que se desea encontrar.
					 */
					actualizar: function (idNomenclatura, nomenclatura) {
						var defered = $q.defer();
						var ruta = root + 'nomenclatura/actualizar/' + idNomenclatura;
						$http({
							url: ruta,
							method: 'POST',
							params: nomenclatura
						})
								.then(
										function (response) {
											fnSuccess(defered, response);
										}, function (error) {
									fnError(defered, error);
								});

						return defered.promise;
					},
					certificar: function (idNomenclatura) {
						var defered = $q.defer();
						var ruta = root + 'nomenclatura/certificar/' + idNomenclatura;
						$http({
							url: ruta,
							method: 'POST',
							params: {}
						})
								.then(
										function (response) {
											fnSuccess(defered, response);
										},
										function (error) {
											fnError(defered, error);
										}
								);

						return defered.promise;
					},
					anular: function (idNomenclatura) {
						var defered = $q.defer();
						var ruta = root + 'nomenclatura/anular/' + idNomenclatura;
						$http({
							url: ruta,
							method: 'POST',
							params: {}
						})
								.then(
										function (response) {
											fnSuccess(defered, response);
										},
										function (error) {
											fnError(defered, error);
										}
								);

						return defered.promise;
					},
					inactivar: function (idNomenclatura) {
						var defered = $q.defer();
						var ruta = root + 'nomenclatura/inactivar/' + idNomenclatura;
						$http({
							url: ruta,
							method: 'POST',
							params: {}
						})
								.then(
										function (response) {
											fnSuccess(defered, response);
										},
										function (error) {
											fnError(defered, error);
										}
								);

						return defered.promise;
					},
					guardarPrincipal: function (idNomenclatura) {
						var defered = $q.defer();
						var ruta = root + 'nomenclatura/principal/' + idNomenclatura;
						$http({
							url: ruta,
							method: 'POST',
							params: {}
						})
								.then(
										function (response) {
											fnSuccess(defered, response);
										},
										function (error) {
											fnError(defered, error);
										}
								);

						return defered.promise;
					},
					//data = {"direccion": "", "complemento", "principal", "npn"}
					crear: function (data) {
						return MyHttp.myHttp(
								root + 'nomenclatura/crear/',
								'POST',
								data
								);
					}
				};
			}])
		//Servicio para abrir un formulario en otra ventana. Es útil en caso de previsualización de un pdf
		.factory("UtilForm", [function () {
				return {
					/**
					 * Abre una nueva ventana con los parámetros especificados
					 * @param  {String}     url    Url que se va a abrir
					 * @param  {String}     method Puede ser post o get
					 * @param  {Array}      data   Arreglo con objetos {name, value} que serán los datos enviados
					 */
					openWith: function (url, method, data) {
						var f = document.createElement('form');
						f.innerHTML = '';
						f.setAttribute('method', method);
						f.setAttribute('action', url);
						f.setAttribute('style', 'display: none');

						for (var i = data.length - 1; i >= 0; i--) {
							var input = document.createElement("input");
							input.setAttribute('type', "text");
							input.setAttribute('name', data[i].name);
							input.setAttribute('value', data[i].value);
							f.appendChild(input);
						}

						document.body.appendChild(f);

						var win = window.open('', 'ventanaPrevisualizacion');
						f.target = 'ventanaPrevisualizacion';
						f.submit();
						f.parentElement.removeChild(f);
					}
				};
			}])
		.factory("ListarBarrios", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "barrio/", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		])

		.factory("ListarGrupos", [
			"$resource",
			"root",
			function ($resource, root) {
				return $resource(root + "admin/listargrupos", {
					'query': {method: 'GET', isArray: true, transformResponse: function (json, headerGetter) {
							return angular.fromJson(json);
						}},
					'get': {method: 'GET'}
				});
			}
		])
		.factory("PluginNomenclatura", ['urlPlugInNomenclatura', function (urlPlugInNomenclatura) {
				return {
					obtenerModalIngresoDireccion: function ($scope, fnClose, fnError) {

						$('body').append(
								'<div id="__urlPlugInNomenclatura__hiddens_plugin_direccion">' +
								'<input id="__urlPlugInNomenclatura__npn" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__direccion" type="hidden">' +
								'<input id="__urlPlugInNomenclatura__infoAdicional" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__direccionVisual" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__predioId" type="hidden" />' +
								'<input id="__urlPlugInNomenclatura__nomenclaturaId" type="hidden" />' +
								'</div>' +
								'<div id="__urlPlugInNomenclatura__modalIngresoDireccion" class="modal fade modal-change" role="dialog" aria-hidden="true" ></div>'
								);
						var modalDireccion = $('#__urlPlugInNomenclatura__modalIngresoDireccion');
						__cerrarModalPlugInNomenclatura0 = function () {
							modalDireccion.modal('hide');
						};
						__cerrarModalPlugInNomenclatura1 = function () {

							$scope.$apply(function () {
								fnClose(
										{
											npn: document.getElementById('__urlPlugInNomenclatura__npn').value,
											direccion: document.getElementById('__urlPlugInNomenclatura__direccion').value,
											infoAdicional: document.getElementById('__urlPlugInNomenclatura__infoAdicional').value ? document.getElementById('__urlPlugInNomenclatura__infoAdicional').value.trim() : null,
											direccionVisual: document.getElementById('__urlPlugInNomenclatura__direccionVisual').value,
											predioId: document.getElementById('__urlPlugInNomenclatura__predioId').value,
											nomenclaturaId: document.getElementById('__urlPlugInNomenclatura__nomenclaturaId').value,
											cambio: !(document.getElementById('__urlPlugInNomenclatura__npn').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__direccion').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__direccionVisual').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__predioId').value == ''
													&& document.getElementById('__urlPlugInNomenclatura__nomenclaturaId').value == '')
										}
								);
							});

							$('#__urlPlugInNomenclatura__hiddens_plugin_direccion').remove();
							modalDireccion.remove();
						};


						$(".overlap_espera").show();
						$(".overlap_espera_1").show();

						$.ajax({
							url: urlPlugInNomenclatura,
							data: {
								fieldNamecallbackFunction: '__cerrarModalPlugInNomenclatura0',
								fieldNameNPNrequerido: false,
								activarBusqueda: true,
								fieldNameDiv: "__urlPlugInNomenclatura__modalIngresoDireccion",
								fieldNameNumeroUnico: "__urlPlugInNomenclatura__npn",
								fieldNameDireccion: "__urlPlugInNomenclatura__direccion",
								fieldNameDireccionVisual: "__urlPlugInNomenclatura__direccionVisual",
								fieldNameDireccionAdicional: "__urlPlugInNomenclatura__infoAdicional",
								fieldNameIdPredio: "__urlPlugInNomenclatura__predioId",
								fieldNameIdNomenclatura: "__urlPlugInNomenclatura__nomenclaturaId"
							},
							success: function (a) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									modalDireccion.empty();
									modalDireccion.append(a);
									modalDireccion.on('hidden.bs.modal', function (e) {
										__cerrarModalPlugInNomenclatura1();
									})
									modalDireccion.modal("show");
								});
							},
							error: function (jqXHR, textStatus) {
								$(".overlap_espera").fadeOut(500, "linear");
								$(".overlap_espera_1").fadeOut(500, "linear", function () {
									fnError("Ha ocurrido un error. Intente nuevamente o consulte al administrador (Error: " + textStatus + ")")
								});
							}
						});
					}
				}
			}])
		.factory('DevolverSolicitud', ['$q', '$http', 'root', function ($q, $http, root) {
				function fnError(defered, errorHttp) {
					var msg = 'Error: ';
					switch (errorHttp.status) {
						case 500:
							msg += 'Error interno en el servidor. Intente nuevamente o consulte al administrador.';
							break;
						case 403:
							msg += 'No tiene permisos para realizar esta acción.';
							break;
						case 503:
							msg += 'Servicio no disponible temporalmente.';
							break;
						case 401:
							msg += 'No ha sido posible encontrar la ruta.';
							break;
						default:
							msg = 'Error ' + errorHttp.status + ': ' + errorHttp.statusText;
							break;
					}

					defered.reject({status: errorHttp.status, msg: msg, success: false});
				}

				function fnSuccess(defered, response) {
					var data = response.data;
					if (data.success) {
						defered.resolve(data);
					} else {
						defered.reject(data);
					}
				}

				var urls = {
					'certificadonomenclatura': 'certificado_nomenclatura/reset/',
					'asignacion_nomenclatura': 'asignomenclatura/reset/',
				}

				return {
					/**
					 * Devuelve una solicitud de Certificado de nomenclatura a estado Pendiente
					 */
					devolver: function (idSolicitud, codigoTipoSolicitud, observaciones) {
						var defered = $q.defer();
						if (typeof urls[codigoTipoSolicitud] == 'undefined') {
							defered.reject({msg: 'Operación no implementada para este tipo de solicitud.', success: false, data: null});
						} else {
							$http
									.post(root + urls[codigoTipoSolicitud] + idSolicitud, {observaciones: observaciones})
									.then(
											function (response) {
												fnSuccess(defered, response)
											}, function (error) {
										fnError(defered, error);
									}
									);
						}
						return defered.promise;
					}
				};

			}])
		.factory('LoadingOverlap', [function () {
				function show($scope, callback, dataCallback) {
					//Iniciamos a mostrar la cortina
					$(".overlap_espera").show();
					$(".overlap_espera_1").show(function () {
						//Si se pasa un callback se ejecutará al finalizar la animación
						if (callback) {
							$scope.$apply(function () {
								callback(dataCallback);
							});
						}
					});
				}

				function hide($scope, callback, dataCallback) {
					//Iniciamos a mostrar la cortina
					$(".overlap_espera").fadeOut(500, "linear");
					$(".overlap_espera_1").fadeOut(500, function () {
						//Si se pasa un callback se ejecutará al finalizar la animación
						if (callback) {
							$scope.$apply(function () {
								callback(dataCallback);
							});
						}
					});
				}
				return {
					show: show,
					hide: hide
				};
			}])

		.factory('IntegradorCatastro', ['$q', '$http', 'root', 'MyHttp', function ($q, $http, root, MyHttp) {

				return {
					listarEstados: function () {
						return MyHttp.myHttp(
								root + "nomenclatura/integracion/catastro/listarestados",
								'GET',
								{}
						);
					},
					buscar: function ($limit, $page, $campo, $operador, $parametro) {
						return MyHttp.myHttp(
								root + "nomenclatura/integracion/catastro/listarregistros",
								'POST',
								{
									limit: $limit,
									page: $page,
									campo: $campo,
									operador: $operador,
									parametro: $parametro
								}
						);
					},
					actualizar: function ($idRegistro, $idEstado) {
						return MyHttp.myHttp(
								root + "nomenclatura/integracion/catastro/actualizar",
								'GET',
								{
									idRegistro: $idRegistro,
									idEstado: $idEstado
								}
						);
					},
					actualizarTodos: function ($idEstado) {
						return MyHttp.myHttp(
								root + "nomenclatura/integracion/catastro/actualizartodos",
								'GET',
								{
									idEstado: $idEstado
								}
						);
					},
					actualizarSeleccionados: function ($idEstado, $arrayIds) {
						return MyHttp.myHttp(
								root + "nomenclatura/integracion/catastro/actualizarseleccionados",
								'POST',
								{
									idEstado: $idEstado,
									ids: $arrayIds
								}
						);
					},
				};
			}])

		.factory('MyHttp', ['$q', '$http', 'root', function ($q, $http, root) {
				function fnError(defered, errorHttp) {
					var msg = 'Error ' + errorHttp.status + ': ';
					switch (errorHttp.status) {
						case 500:
							msg += 'Error interno en el servidor. Intente nuevamente o consulte al administrador.';
							break;
						case 403:
							msg += 'No tiene permisos para acceder.';
							break;
						case 503:
							msg += 'Servicio no disponible temporalmente.';
							break;
						case 401:
							msg += 'No ha sido posible encontrar la ruta.';
							break;
						case 405:
							msg += 'Método GET o POST no permitido.';
							break;
						default:
							msg += errorHttp.statusText;
							break;
					}
					defered.reject({status: errorHttp.status, msg: msg, success: false});
				}

				function fnSuccess(defered, response) {
					var data = response.data;
					if (data.success) {
						defered.resolve(data);
					} else {
						defered.reject(data);
					}
				}

				function myHttp(ruta, method, params) {
					var defered = $q.defer();
					//var ruta = root + 'fnomenclatura/buscarnpn';
					var config = {
						url: ruta,
						method: method,
						transformResponse: function (data, headersGetter, status) {
							try {
								return angular.fromJson(data);
							} catch (error) {
								return {success: false, msg: 'Error de respuesta, se espera un JSON.'}
							}
						}
					};
					if (method == 'GET') {
						config.params = params;
					} else {
						config.data = params;
					}
					$http(config)
							.then(
									function (response) {
										fnSuccess(defered, response);
									},
									function (error) {
										fnError(defered, error);
									}
							);
					return defered.promise;
				}

				return {
					myHttp: myHttp
				}

			}])

