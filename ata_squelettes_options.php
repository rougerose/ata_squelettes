<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

// Zcore
if (!isset($GLOBALS['z_blocs'])) {
	$GLOBALS['z_blocs'] = ['content', 'head_js', 'head', 'header', 'footer', 'overlay'];
}

// Formulaire de recherche de la carte : activer le sélecteur générique
if (!defined('_SELECTEUR_GENERIQUE_ACTIVER_PUBLIC')) {
	define('_SELECTEUR_GENERIQUE_ACTIVER_PUBLIC', true);
}

// intertitres
$GLOBALS['debut_intertitre'] = '<h2 class="spip">';
$GLOBALS['fin_intertitre'] = '</h2>';

// error_reporting(E_ALL ^ E_NOTICE);
// ini_set('display_errors', 'On');
// define('SPIP_ERREUR_REPORT', E_ALL);
// $GLOBALS['taille_des_logs'] = 50000;
// define('_MAX_LOG', 500000);
// define('_LOG_FILELINE', true);
// define('_LOG_FILTRE_GRAVITE', 8);
// define('_DEBUG_AUTORISER', true);
// define('_DEBUG_SLOW_QUERIES', true);
// define('_BOUCLE_PROFILER', 5000);
