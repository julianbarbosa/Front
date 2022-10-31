/* 
 * Script para el manejo de la grilla de listado de solicitudes
 * 
 */
$(document).ready(function()
{
    $("#listaSolicitudes").jqGrid({
            url:'solicitud/index?q=tree',
//            treedatatype: "json",
            width: 'auto',
            height: '461px',
            datatype: "json",
            colNames:['Acciones','Solicitud','Radicado Orfeo', 'Orfeo Respuesta', 'Tipo de Solicitud', 'Estado', 'Fecha Radicación', 'Ultima Actualizacion','Comentario'],
            colModel:[
                    {name:'acciones', width:60, fixed:true, sortable:false, resize:false, align:"center", search: false},
                    {name:'idsolicitud',index:'idsolicitud', width:72, align:"right"},
                    {name:'radicado',index:'radicado', width:110, align:"center"},
                    {name:'radicadohijo',index:'radicadohijo', width:120, align:"center"},
                    {name:'tiposolicitud',index:'idtiposolicitud', width:120, align:"center"},
                    {name:'estado',index:'idestado', width:100, align:"center"},
                    {name:'fechainicial',index:'fechainicial', width:120, align:"center"},
                    {name:'fechafinal',index:'fechafinal', width:135, align:"center"},
                    {name:'comentario',index:'comentario', width:120, align:"left",search: false,sortable:false},
                ],                
            rowNum:15,
            //rowList:[30,45],
            pager: '#pagerSolicitudes',
            sortname: 'idsolicitud',
            viewrecords: true,
            sortorder: "desc",
//            treeGrid: true,
//            ExpandColumn : 'idsolicitud',
    }).jqGrid('filterToolbar',{searchOperators : false})
    .jqGrid('navGrid','#pagerSolicitudes',{edit:false,add:false,del:false, search:false});
});