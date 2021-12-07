# LambdaDrop-API-Server

Le serveur qui va établir les communications entre le gérant de stream et la preview.

Ce serveur nécessite d'être connecté à la base de données du serveur de gestion des accès.

### 💻 Pré-requis :

* Connexion à la base de données MyAperistream
* Node.js 14+
* 512Mo RAM

### 🔧 Installation :

Pour installer le serveur, une simple commande est suffisante.

```bash
cd installdir && npm i
```

### ⚙️ Configuration :

Vous pouvez personaliser le port de connexion ainsi que les identifiants de la base de données dans le fichier `.env` dans le dossier racine du serveur comme dans l'exemple ci-dessous :

```.env
PORT=40469
DB="USER:PASSWORD@SERVER:PORT/DATABASE"
```

### 📌 Mise en Production :

```bash
npm run start
```

