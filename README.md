# FMG Metal Studio (Ferro Garrigues), site internet

Site vitrine de FMG Metal Studio, atelier d'architecture métallique à Nîmes (Gard), publié sur
**https://ferrogarrigues.fr**. Site statique HTML/CSS/JS + scripts PHP (`api/`), hébergé chez OVH
(hébergement mutualisé Apache/PHP).

## Déploiement

Mise en ligne automatique par l'intégration Git d'OVH : la branche
`claude/ferrogarrigues-site-modernization-vu6bqv` (branche par défaut de ce dépôt) est publiée dans
le dossier racine du site sur l'hébergement OVH (onglet Multisite, « Associer Git »). Toute
modification fusionnée dans cette branche part en ligne. `README.md` et `.git*` sont publiés avec
le dépôt mais renvoient une 404 (règle du `.htaccess`).

Le dossier `api/data/` doit être accessible en écriture par PHP ; il est protégé de l'accès public
par son `.htaccess` et contient les fichiers générés sur le serveur (non versionnés, voir
`.gitignore`) : compteur de vues (`views.json`), limite anti-spam du formulaire, demandes dont
l'email n'a pas pu partir (`messages-non-envoyes.txt`) et envois écartés comme robots
(`messages-suspects.txt`).
