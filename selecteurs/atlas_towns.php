<?php

if (!defined('_ECRIRE_INC_VERSION')) {
  return;
}

function selecteurs_atlas_towns() {
	include_spip('base/objets');
	include_spip('inc/filtres');
	include_spip('inc/texte');

	$search = trim(_request('q'));
	$resultats = array();
	$limite = 15;

	if (!$search) {
		return $resultats;
	}

	// Modifier le nombre de résultats
	if ($request_limite = intval(_request('limite')) and $request_limite > 0) {
		$limite = $request_limite;
	}

	// Chercher les villes de la table spip_adresses liées à une association
	// et à un point GIS
	$requetes = array(
		'ville' => array(
			'cle_objet' => 'id_adresse',
			'titre' => 'ville',
			'select' => array('l1.id_adresse, l1.ville'),
			'from' => array(
				'spip_adresses AS l1',
				'INNER JOIN spip_adresses_liens AS l2 ON (l2.id_adresse = l1.id_adresse)',
				'INNER JOIN spip_associations AS l3 ON (l2.id_objet = l3.id_association AND l2.objet = "association")',
				'INNER JOIN spip_gis_liens AS l4 ON (l4.objet = "association" AND l4.id_objet = l3.id_association)'
			),
			'where_debut' => array(
				'l1.ville LIKE '.sql_quote("${search}%"),
				'l3.statut = "publie"'
			),
			'where_contient' => array(
				'l1.ville LIKE '.sql_quote("%${search}%"),
				'l3.statut = "publie"'
			),
			'groupby' => array('l1.ville'),
			'orderby' => array('l1.ville'),
		),
	);

	foreach ($requetes as $objet => $desc) {
		$from = implode(' ', $desc['from']);

		// Chercher en priorité les occurrences qui commencent
		// par le contenu de la requête (where_debut),
		// sinon les occurrences qui contiennent le contenu
		// de la requête.
		if (
			$rows = sql_allfetsel(
				$desc['select'],
				$from,
				$desc['where_debut'],
				$desc['groupby'],
				$desc['orderby'],
				"0, $limite"
			) or $rows = sql_allfetsel(
				$desc['select'],
				$from,
				$desc['where_contient'],
				$desc['groupby'],
				$desc['orderby'],
				"0, $limite"
			)
		) {
			foreach ($rows as $res) {
				$id_objet = $res[$desc['cle_objet']];
				$label = filtrer_entites($res[$desc['titre']]);
				$resultats[] = array(
					'label' => $label,
					'value' => $desc['cle_objet'] . ':' . $res[$desc['cle_objet']]
				);
			}
		}
	}
	return json_encode($resultats);
}
