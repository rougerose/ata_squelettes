<?php

if (!defined('_ECRIRE_INC_VERSION')) {
  return;
}

function selecteurs_atlas_fulltext() {
	include_spip('inc/filtres');
	include_spip('inc/texte');

	$search = trim(_request('q'));
	$resultats = array();
	$limite = 5;

	if (!$search) {
		return $resultats;
	}

	// Modifier le nombre de résultats
	if ($request_limite = intval(_request('limite')) and $request_limite > 0) {
		$limite = $request_limite;
	}

	// Décrire dans un tableau les requêtes sql qui nécessitent des jointures.
	// Les tables concernées sont associations, mots et adresses.
	$requetes = array(
		'associations' => array(
			'cle_objet' => 'id_association',
			'titre' => 'nom',
			'complement' => '',
			'select' => array('l1.id_association', 'l1.nom'),
			'from' => array(
				'spip_associations AS l1',
				'INNER JOIN spip_gis_liens AS l2 ON (l2.id_objet = l1.id_association AND l2.objet = "association")',
				'INNER JOIN spip_gis AS l3 ON (l3.id_gis = l2.id_gis)'
			),
			'where_debut' => array(
				'l1.nom LIKE '.sql_quote("${search}%"),
				'l1.statut = "publie"'
			),
			'where_contient' => array(
				'l1.nom LIKE '.sql_quote("%${search}%"),
				'l1.statut = "publie"'
			),
			'groupby' => '',
			'orderby' => array('l1.nom'),
		),
		'mots' => array(
			'cle_objet' => 'id_mot',
			'titre' => 'titre',
			'complement' => 'descriptif',
			'select' => array('l1.id_mot', 'l1.titre', 'l1.descriptif'),
			'from' => array(
				'spip_mots AS l1',
				'INNER JOIN spip_mots_liens AS l2 ON (l2.id_mot = l1.id_mot)',
				'INNER JOIN spip_associations AS l3 ON (l3.id_association = l2.id_objet AND l2.objet="association")',
				'INNER JOIN spip_gis_liens AS l4 ON (l3.id_association = l4.id_objet AND l4.objet="association")'
			),
			'where_debut' => array(
				'l1.titre LIKE '.sql_quote("${search}%").' OR l1.descriptif LIKE '.sql_quote("${search}%"),
				'l3.statut = "publie"',
				'l1.id_groupe_racine=1',
			),
			'where_contient' => array(
				'l1.titre LIKE '.sql_quote("%${search}%").' OR l1.descriptif LIKE '.sql_quote("%${search}%"),
				'l3.statut = "publie"',
				'l1.id_groupe_racine=1',
			),
			'groupby' => array('l1.id_mot'),
			'orderby' => array('l1.titre'),
		),
		'villes' => array(
			'cle_objet' => 'id_adresse',
			'titre' => 'ville',
			'complement' => '',
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
				if ($desc['complement']) {
					$label .= ' ' . filtrer_entites($res[$desc['complement']]);
				}
				$resultats[] = array(
					'label' => $label,
					'value' => $cle . ':' . $res[$desc['cle_objet']]
				);
			}
		}
	}
	return json_encode($resultats);
}
