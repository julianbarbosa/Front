<?php

try
        {
            $datos = array(
                '201741320300011872_00003',
                '413230009'
            );
			$clienteWS = new SoapClient('http://172.18.26.3/webServ/wsRadicado2.php?wsdl', array('cache_wsdl'=>WSDL_CACHE_NONE));
            $resultado = $clienteWS->__soapCall('borrarAnexo', $datos);
            return $resultado;
        }
        catch(Exception $e)
        {
            if(sfConfig::get('sf_logging_enabled'))
            {
                sfContext::getInstance()->getLogger()->err($e->getMessage() . $e->getFile() . $e->getTraceAsString() . " Excepcion controlada en Funcion adjuntarDocumentos() de Clase orfeoWS");
            }
            return false;
        }