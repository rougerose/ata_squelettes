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

// Formulaire de recherche de la carte : activer le sélecteur générique
if (!defined('_SELECTEUR_GENERIQUE_ACTIVER_PUBLIC')) {
	define('_SELECTEUR_GENERIQUE_ACTIVER_PUBLIC', true);
}
