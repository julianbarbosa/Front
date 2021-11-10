<?php

// this check prevents access to debug front controllers that are deployed by accident to production servers.
// feel free to remove this, extend it or make something more sophisticated.
/*if (!in_array(@$_SERVER['REMOTE_ADDR'], array('172.18.22.238','172.18.110.46','172.18.110.45','172.18.110.48', '127.0.0.1','172.18.110.86','172.18.110.222', '172.18.110.247', '172.18.10.120', '172.18.10.122', '172.18.15.238', '172.18.15.235', '172.18.15.231', '172.18.22.235', '::1')))
{
  die('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
}
*/
require_once(dirname(__FILE__).'/../config/ProjectConfiguration.class.php');

$configuration = ProjectConfiguration::getApplicationConfiguration('dapm', 'dev', true);
sfContext::createInstance($configuration)->dispatch();
