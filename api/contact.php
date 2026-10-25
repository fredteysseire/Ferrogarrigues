<?php
// Réception du formulaire de contact (contact.html) et envoi par email via la fonction
// mail() de l'hébergement OVH, sans service tiers : la requête reste sur ferrogarrigues.fr.
// Succès -> redirection vers merci.html ; échec -> retour sur contact.html?envoi=erreur.
// Si l'envoi du mail échoue, la demande est conservée dans data/messages-non-envoyes.txt
// (dossier protégé par data/.htaccess) pour ne jamais perdre un contact.

const DESTINATAIRE = 'contact@ferrogarrigues.fr';
const EXPEDITEUR = 'contact@ferrogarrigues.fr';
const MAX_ENVOIS_PAR_HEURE = 10;
// Délai minimal (ms) entre l'affichage de la page et l'envoi, mesuré par js/main.js (champ « verif »).
const DELAI_MIN_MS = 3000;
// Taille max du journal des envois écartés, pour ne jamais remplir l'hébergement.
const MAX_JOURNAL_SUSPECTS = 2000000;

$dataDir = __DIR__ . '/data';

function retour($page) {
    header('Location: https://ferrogarrigues.fr/' . $page, true, 303);
    exit;
}

// Supprime les retours à la ligne (empêche l'injection d'en-têtes email) et les espaces superflus.
function ligne($value, $max) {
    $value = trim(preg_replace('/[\r\n\t]+/', ' ', (string) $value));
    return mb_substr($value, 0, $max, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    retour('contact.html');
}

// Piège à robots : champ invisible pour un humain. Rempli -> on fait comme si tout allait bien.
if (!empty($_POST['site_web'])) {
    retour('merci.html');
}

$prenom = ligne($_POST['prenom'] ?? '', 60);
$nom = ligne($_POST['nom'] ?? '', 60);
$email = ligne($_POST['email'] ?? '', 160);
$telephone = ligne($_POST['telephone'] ?? '', 40);
$lieu = ligne($_POST['lieu'] ?? '', 160);
$projet = ligne($_POST['projet'] ?? '', 120);
$message = trim(mb_substr((string) ($_POST['message'] ?? ''), 0, 5000, 'UTF-8'));

// Champs obligatoires : prénom, nom, email valide, téléphone et message (aussi exigés par le
// formulaire lui-même, cette vérification couvre les envois qui contournent la page).
if ($prenom === '' || $nom === '' || $telephone === '' || $message === ''
    || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    retour('contact.html?envoi=erreur#contact-form');
}

$corps = "Nouvelle demande depuis le site ferrogarrigues.fr\n\n"
    . "Prénom : $prenom\n"
    . "Nom : $nom\n"
    . "Email : $email\n"
    . "Téléphone : $telephone\n"
    . "Lieu du chantier : " . ($lieu !== '' ? $lieu : 'non renseigné') . "\n"
    . "Type de projet : $projet\n\n"
    . "Message :\n$message\n";

// Robots : le champ « verif » n'est rempli que par le JavaScript de la page, après un délai
// humainement plausible. Les robots de spam postent directement sur ce script, sans exécuter
// la page. Ces envois ne sont pas transmis par email mais conservés dans
// data/messages-suspects.txt (une vraie demande écartée par erreur reste récupérable).
$verif = $_POST['verif'] ?? '';
if (!ctype_digit((string) $verif) || (int) $verif < DELAI_MIN_MS) {
    $journal = $dataDir . '/messages-suspects.txt';
    if (@filesize($journal) < MAX_JOURNAL_SUSPECTS) {
        @file_put_contents(
            $journal,
            '=== ' . date('Y-m-d H:i:s') . ' (verif=' . ligne($verif, 20) . ")\n" . $corps . "\n",
            FILE_APPEND | LOCK_EX
        );
    }
    retour('merci.html');
}

// Contenu typique du spam (lien dans le message, téléphone impossible, alphabet cyrillique ou
// asiatique) : la demande est quand même envoyée, mais l'objet est préfixé « [SPAM ?] » pour
// pouvoir la trier avec une règle de la messagerie.
$chiffres = preg_replace('/\D+/', '', $telephone);
$telephoneValide = preg_match('/^0\d{9}$/', $chiffres) || (preg_match('/^\s*(\+|00)/', $telephone) && strlen($chiffres) >= 8 && strlen($chiffres) <= 15);
$suspect = preg_match('~https?://|www\.~i', $message . ' ' . $prenom . ' ' . $nom . ' ' . $lieu)
    || preg_match('/[\p{Cyrillic}\p{Han}\p{Hangul}]/u', $prenom . ' ' . $nom . ' ' . $message)
    || !$telephoneValide;

// Limite le nombre d'envois par adresse IP (anti-spam), stocké hors base de données.
$limiteFile = $dataDir . '/limite-contact.json';
$ipKey = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
$now = time();
$fp = @fopen($limiteFile, 'c+');
if ($fp) {
    flock($fp, LOCK_EX);
    $size = filesize($limiteFile) ?: 0;
    $limites = json_decode($size > 0 ? fread($fp, $size) : '', true);
    if (!is_array($limites)) {
        $limites = [];
    }
    foreach ($limites as $key => $times) {
        $limites[$key] = array_values(array_filter($times, fn($t) => $t > $now - 3600));
        if (!$limites[$key]) {
            unset($limites[$key]);
        }
    }
    $trop = count($limites[$ipKey] ?? []) >= MAX_ENVOIS_PAR_HEURE;
    if (!$trop) {
        $limites[$ipKey][] = $now;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($limites));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    if ($trop) {
        retour('contact.html?envoi=erreur#contact-form');
    }
}

$sujet = mb_encode_mimeheader(($suspect ? '[SPAM ?] ' : '') . "Nouvelle demande, site FMG Metal Studio : $prenom $nom", 'UTF-8');
$entetes = implode("\r\n", [
    'From: ' . mb_encode_mimeheader('Site FMG Metal Studio', 'UTF-8') . ' <' . EXPEDITEUR . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$envoye = mail(DESTINATAIRE, $sujet, $corps, $entetes, '-f' . EXPEDITEUR);

if (!$envoye) {
    @file_put_contents(
        $dataDir . '/messages-non-envoyes.txt',
        '=== ' . date('Y-m-d H:i:s') . "\n" . $corps . "\n",
        FILE_APPEND | LOCK_EX
    );
    retour('contact.html?envoi=erreur#contact-form');
}

retour('merci.html');
