/* 
 * Script para el manejo de la grilla de listado de solicitudes
 * 
 */
$(document).ready(function()
{
    $("#listaUsos").jqGrid({
            url:'usosuelo/index',
//            treedatatype: "json",
            width: 'auto',
            height: '361px',
            datatype: "json",
            colNames:['Acciones', 'Solicitud', 'Radicado', 'Radicado Orfeo', 'Número Predio', 'Dirección', 'Estado', 'Fecha'],
            colModel:[
                    {name:'acciones', width:60, fixed:true, sortable:false, resize:false, align:"center", search: false},
                    {name:'idsolicitud',index:'idsolicitud', width:80, align:"center", search: false},
                    {name:'registro',index:'registro', width:130, align:"center"},
                    {name:'radicado',index:'radicado', width:130, align:"center"},
                    {name:'numeropredio',index:'numeropredio', width:150, align:"center"},
                    {name:'direccion',index:'direccion', width:150, align:"left"},                    
                    {name:'estado',index:'estado', width:100, align:"left"},
                    {name:'fecha',index:'fecha', width:120, align:"center"},
                ],                
            rowNum:15,
            //rowList:[30,45],
            pager: '#pagerlistaUsos',
            sortname: 'idsolicitud',
            viewrecords: true,
            sortorder: "desc",
//            treeGrid: true,
//            ExpandColumn : 'idsolicitud',
    }).jqGrid('filterToolbar',{searchOperators : false})
    .jqGrid('navGrid','#pagerlistaUsos',{edit:false,add:false,del:false, search:false});
});