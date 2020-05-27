# Installer l'application depuis ce dépot

**Vous allez devoir installer git, node et npm sur votre machine, puis cloner ce dépôt.**

Tout est expliqué dans ce guide, si vous avez un problème ou une question, merci de me contacter par mail : app@amicale-insat.fr

## Table des matières
* [Installation de Git](#installation-de-git)
* [Installation de node](#installation-de-node)
* [Installation de  React Native](#installation-de-react-native)
    * [Configuration de NPM](#configuration-de-npm)
    * [Installation](#installation)
* [Téléchargement du dépot](#téléchargement-du-dépot)
* [Téléchargement des dépendances](#téléchargement-des-dépendances)
* [Lancement de l'appli](#lancement-de-lappli)
* [Tester sur un appareil](#tester-sur-un-appareil)

## Installation de Git

Entrez la commande suivante pour l'installer :
```shell script
sudo apt install git
```

## Installation de node

Vous devez avoir une version de node > 12.0.
Pour cela, vérifiez avec la commande :
```shell script
nodejs -v
```

Si ce n'est pas le cas, entrez les commandes suivantes pour installer la version 12 ([plus d'informations sur ce lien](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)):

```shell script
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Installation de React Native

Merci de suivre les [instructions d'installation](https://reactnative.dev/docs/environment-setup) sur le site officiel.

## Téléchargement du dépôt

Clonez ce dépôt à l'aide de la commande suivante :
````shell script
git clone https://git.etud.insa-toulouse.fr/vergnet/application-amicale.git
````

## Téléchargement des dépendances

Une fois le dépôt sur votre machine, ouvrez le terminal dans le dossier du dépôt cloné et tapez : 
````shell script
npm install
````
Ceci installera toutes les dépendances listées dans le fichier _package.json_. Cette opération peut prendre quelques minutes et utilisera beaucoup d'espace disque (plus de 300Mo).

### Instructions pour iOS

Pour iOS, en plus de la commande précédente, il faut aussi installer les dépendances iOS. Pour cela, allez dans le dossier `ios` et installez les pods :
```shell script
cd ios && pod install
```

## Lancement de l'appli

Il est conseillé d'utiliser un logiciel comme **WebStorm** (logiciel pro gratuit pour les étudiants) pour éditer l'application car ce logiciel est compatible avec les technologies utilisées.

Vous aurez besoin de 2 consoles :
* Une pour lancer le *Bundler*, qui permet de mettre à jour l'application en temps réel (vous pouvez le laisser tout le temps ouvert).
* Une autre pour installer l'application sur votre appareil/simulateur.

Pour lancer le *Bundler*, assurez vous d'être dans le dossier de l'application, et lancez cette commande :
````shell script
npx react-native start
````

### Android
Dans la deuxième console, lancez la commande suivante :
````shell script
npx react-native run-android
````

### iOS
Dans la deuxième console, lancez la commande suivante (valable que sur Mac) :
````shell script
npx react-native run-ios
````

**Ne stoppez pas le Metro Bundler dans la console à chaque changement !** Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer pour des petits changements ! Il est seulement nécessaire de redémarrer le Metro Bundler quand vous changez des librairies ou des fichiers.

## Tester sur un appareil

Assurez vous d'avoir installé et lancé le projet comme expliqué plus haut.

### Android

#### Émulateur

[Suivez la procédure sur ce lien pour installer un émulateur](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/).

Une fois l'emulateur installé et démarré, lancez l'application comme expliqué plus haut.

#### Appareil Physique

Branchez votre appareil, allez dans les options développeurs et activer le *USB Debugging*. Une fois qu'il est activé et branché, lancez l'appli comme expliqué plus haut. 

### iOS

#### Émulateur

Installez le logiciel Xcode et téléchargez l'émulateur de votre choix. Ensuite, lancez la commande suivante pour lancer l'application sur votre émulateur.
````shell script
npx react-native run-ios --simulator="NOM DU SIMULATEUR"
````
En remplaçant `NOM DU SIMULATEUR` par le simulateur que vous voulez.

#### Appareil Physique

Aucune idée je suis pauvre je n'ai pas de Mac.

[reference]: ##Installation de Git