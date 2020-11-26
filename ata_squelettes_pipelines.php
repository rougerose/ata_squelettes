<?php

if (!defined('_ECRIRE_INC_VERSION')) {
  return;
}

function ata_squelettes_recuperer_fond($flux) {
	// if ($flux['args']['fond'] == 'javascript/gis.js') {
	// 	$js = spip_file_get_contents(find_in_path('dist/js/vendor/L.Control.Sidebar.js'));
	// 	$flux['data']['texte'] .= "\n" . $js;
	// }
	return $flux;
}
