<?php

if (!defined('_ECRIRE_INC_VERSION')) {
  return;
}

// Zcore
if (!isset($GLOBALS['z_blocs'])) {
	$GLOBALS['z_blocs'] = array(
		'content',
		'head_js',
		'head',
		'header',
		'footer',
		'overlay'
	);
}
