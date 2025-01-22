# POC Chili Pepper Quiz !
## Pré requis
- Un navigateur web récent.
- Un serveur web (potentiellement optionnel).
## Installation
Cloner ce dépôt\
Créer un répertoire video à la racine du projet et y ajouter les jingles\
Les jingles doivent être nommé comme suit :
- 1.mp4 => Jingle lancement
- 2.mp4 => Jingle Harissa ou Tabasco
- 3.mp4 => Jingle Hot wings
- 4.mp4 => Jingle Menu
- 5.mp4 => Jingle L'échel de scoville
- 6.mp4 => Jingle Le piment de la mort
## Comment ça marche
- screen.html : A afficher en plein écran, affiche le tableau des scores et les jingle
- game-master.html : Permet d'interragir avec la page screen.html et de gérer les buzzers, c'est la page à afficher pour le maître de jeu

Important : Il y a une sécurité navigateur qui force une interaction utilisateur pour que ça fonctionne correctement. Il suffit juste de cliquer n'importe où sur la page screen.html avant de tenter de lancer un jingle depuis la page du maitre de jeu.
## Les boutons de la page game master
Les boutons jingles sont explicites, détaillons plutôt les boutons de contrôle
### Contrôle de la game
Il y a un bouton pour verrouiller et un autre pour déverrouiller tous les buzzers. Attention, aucune information sur la page indique l'état de l'ensemble des buzzers, ça peut être une amélioration à apporter.
### Statut en direct
L'input "Nombre de points" permet de définir le nombre de points que rapporte une bonne réponse\
\
Lorsqu'une équipe prend la main, trois boutons apparaissent :
- Bonne réponse ! => Valide la réponse, ajoute le nombre de points défini à l'équipe qui a la main
- Mauvaise réponse ! => Rend la main aux équipes
- Mauvaise réponse et tu perds des points => Rend la main aux équipes et soustrait au score de l'équipe qui avait pris la main le nombre de point qu'elle aurait gagné en cas de bonne réponse
Il pourrait être intéressant d'ajouter une option qui lock le buzzer de l'équipe qui a mal répondu jusqu'à la prochaine question
### Gestion des équipe
Le bouton "Charger les Buzzers Connectés" charge la liste de buzzers reconnus et affiche les équipes sur la page screen.html\
Le bouton nouvelle partie reset les score et recharge la liste des équipes par rapport aux équipes connectées
## A savoir
Les informations de la partie, équipes et leur score, sont enregistré dans le localStorage. Cela veut dire que fermer le navigateur/onglet ou recharger la page ne lance pas une nouvelle partie. Pour lancer une nouvelle partie il faut cliquer sur le bouton qui va bien :)