<?php

if (!defined('_ECRIRE_INC_VERSION')) {
  return;
}

function ata_squelettes_recuperer_fond($flux) {
	if ($flux['args']['fond'] == 'javascript/gis.js') {
		$ajouts = "\n" . spip_file_get_contents(find_in_path('lib/leaflet-easybutton/src/easy-button.js'));
		$flux['data']['texte'] .= $ajouts;
	}
	return $flux;
}
