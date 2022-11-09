saul.
	factory("PerfilVial", [
		"$resource",
		"root",
		function ($resource, root) {
			return $resource(root + "perfilvial/:id", {
				'query': {method: 'GET', isArray: false},
				'save': {method: 'POST', isArray: false}
			});
		}
	])
	.factory("ItemPorTipo", [
		"$resource",
		"root",
		function ($resource, root) {
			return $resource(root + "pnitem/tipo/:tipo", {
				'query': {method: 'GET', isArray: false},
				'save': {method: 'POST', isArray: false}
			});
		}
	]);