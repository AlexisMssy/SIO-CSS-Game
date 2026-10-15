# Programme B1 — notions vues en cours (BTS SIO 1re année)

Référence pour classer un niveau : une notion listée ici est « vue en cours » ; toute autre notion est un « Approfondissement » (`advanced: true`).
Convention : le nom exact entre backticks est l'identifiant de code (balise sans chevrons, propriété, valeur, sélecteur). Les notions sans backticks sont des concepts.
Source : supports de cours et fiches d'activités étudiants des séances 4 à 10 (aucun corrigé).

## Séance 4 — Bases du Web
- Internet / Web — le Web est un service qui utilise Internet
- client / serveur — modèle d'échange requête → réponse
- URL — protocole, nom de domaine, chemin de la ressource
- DNS / adresse IP — retrouver l'IP d'un nom de domaine
- HTTP(S) — échange requête / réponse, HTTPS chiffré
- HTML / CSS / JavaScript — structure, présentation, comportements

## Séance 5 — Bases HTML & CSS
- `html` — racine du document, attribut `lang`
- `head` — informations pour le navigateur
- `meta` — encodage avec l'attribut `charset`
- `title` — titre de l'onglet
- `link` — lier la feuille CSS (`rel`, `href`)
- `body` — contenu visible
- `h1` — titre principal
- `h2` — sous-titre (hiérarchie des titres)
- `h3` — titre de niveau 3
- `p` — paragraphe
- `ul` — liste à puces
- `li` — élément de liste
- `a` — lien, attribut `href`, lien mail `mailto:`
- `img` — image, attributs `src` et `alt`
- balise ouvrante / fermante, imbrication, attribut
- sélecteur / propriété / valeur — syntaxe d'une règle CSS
- `color` — couleur du texte
- `text-align` — alignement du texte (`center`)
- `font-size` — taille du texte, unité `px`
- `font-family` — police du texte
- `background-color` — couleur de fond
- `text-decoration` — soulignement des liens (`none`, `underline`)
- `margin-top` — marge haute
- CSS externe — fichier `.css` lié dans le `head`

## Séance 6 — TP récapitulatif (S4 + S5)
- CSS commun / CSS spécifique — plusieurs feuilles liées par page
- `nav` — barre de navigation (présente dans le code du TP)
- `font-weight` — texte en gras (`bold`)
- `padding` — espace intérieur
- `margin-right` — marge droite (code du TP)
- `margin-bottom` — marge basse (code du TP)
- `width` — largeur d'un élément
- `div` — conteneur générique (bloc)

## Séance 7 — Structure, sélecteurs, box model
- `header` — en-tête de la page
- `nav` — liens de navigation
- `main` — contenu principal
- `section` — partie cohérente du contenu
- `footer` — pied de page
- `class` — attribut pour réutiliser un style
- `id` — attribut pour un élément unique
- `.classe` — sélecteur de classe
- `#id` — sélecteur d'identifiant
- sélecteur de balise — cible tous les éléments du même type
- `margin` — espace extérieur
- `padding` — espace intérieur
- `border` — bordure (`solid`)
- `border-radius` — coins arrondis
- `font-weight` — texte en gras
- `text-decoration` — retirer le soulignement d'un lien
- `background-color` — couleur de fond d'un bloc
- modèle de boîte — contenu, padding, border, margin

## Séance 8 — Sélecteurs avancés, unités, couleurs, display, position
- `nav a` — sélecteur descendant (espace)
- `>` — sélecteur d'enfant direct
- `,` — groupe de sélecteurs (`h1, h2, h3`)
- `p.important` — combinaison balise + classe
- `px` — unité fixe
- `%` — pourcentage du conteneur
- `rem` — relatif à la taille de texte racine
- `vw` — pourcentage de la largeur de la fenêtre
- `vh` — pourcentage de la hauteur de la fenêtre
- couleur nommée — `navy`, `white`…
- couleur hexadécimale — `#RRGGBB`
- `rgb()` — rouge, vert, bleu de 0 à 255
- `rgba()` — rgb avec transparence
- `style` — CSS inline (attribut) et CSS interne (balise)
- priorité CSS / cascade — quelle règle l'emporte
- `display` — comportement d'affichage
- `block` — élément de type bloc
- `inline` — élément dans le flux du texte
- `inline-block` — sur la ligne mais dimensionnable
- `none` — élément masqué
- `position` — mode de positionnement
- `static` — positionnement normal par défaut
- `relative` — reste dans le flux, sert de repère
- `absolute` — sort du flux, placé selon un ancêtre
- `fixed` — placé par rapport à la fenêtre
- `top` — décalage depuis le haut
- `right` — décalage depuis la droite
- `bottom` — décalage depuis le bas
- `left` — décalage depuis la gauche
- `span` — conteneur en ligne (badge)
- `letter-spacing` — espacement des lettres (code de l'atelier)
- `min-height` — hauteur minimale
- `width` — largeur

## Séance 9 — Flexbox
- `display: flex` — active Flexbox sur le conteneur
- conteneur / enfants directs — Flexbox agit sur les enfants directs
- `flex-direction` — définit l'axe principal
- `row` — en ligne
- `row-reverse` — en ligne, sens inversé
- `column` — en colonne
- `column-reverse` — en colonne, sens inversé
- `justify-content` — alignement sur l'axe principal
- `flex-start` — regroupé au début
- `center` — centré
- `flex-end` — regroupé à la fin
- `space-between` — espace entre les éléments
- `space-around` — espace autour des éléments
- `space-evenly` — espaces tous égaux
- `align-items` — alignement sur l'axe secondaire
- `stretch` — étiré sur l'axe secondaire
- `gap` — espace régulier entre éléments
- `flex-wrap` — retour à la ligne
- `nowrap` — une seule ligne
- `wrap` — autorise le retour à la ligne
- `align-content` — répartition des lignes sur l'axe secondaire
- Flexbox imbriqué — un enfant flex peut être conteneur flex

## Séance 10 — CSS Grid
- `display: grid` — active Grid sur le conteneur
- `grid-template-columns` — définit les colonnes
- `grid-template-rows` — définit les lignes (rangées)
- `fr` — part de l'espace disponible
- `repeat()` — répéter des pistes (`repeat(3, 1fr)`)
- `gap` — espace entre cellules
- `px` / `%` — tailles de colonnes fixes ou proportionnelles
- lignes de grille — numéros des lignes de délimitation
- `grid-column` — placement par lignes verticales (`1 / 3`)
- `grid-row` — placement par lignes horizontales
- placement automatique / explicite
- `grid-template-areas` — dessiner des zones nommées
- `grid-area` — associer un enfant à une zone
- `justify-content` / `align-content` — aussi sur une grille (décision de l'enseignant)
- Grid ou Flexbox — deux dimensions ou un axe

## Hors programme (décisions de l'enseignant)
- `flex-grow`, `order` — exclus explicitement du support de la séance 9
- media queries — exclues explicitement du support de la séance 9
- `strong` — apparaît dans du code à corriger, non enseigné
- `max-width` — seulement en bonus du TP de la séance 7
- `column-gap`, `row-gap`, `justify-items`, `align-items` sur une grille, `minmax()`, `auto-fit` — non vus en Grid
