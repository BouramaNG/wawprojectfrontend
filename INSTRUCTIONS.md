# 🚀 Instructions d'Installation

## 1. Installer les dépendances

```bash
cd waw-admin-dashboard
npm install
```

## 2. Configurer l'API

Créez un fichier `.env` :

```bash
cp .env.example .env
```

Modifiez `.env` si votre API Laravel est sur un autre port.

## 3. Lancer le serveur de développement

```bash
npm run dev
```

Le dashboard sera accessible sur : `http://localhost:3000`

## 4. Build pour production

```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`.

---

## 📝 Notes

- Le backend Laravel doit être lancé sur `http://localhost:8000`
- Les routes API sont déjà configurées dans `src/services/api.js`
- Le design utilise Tailwind CSS + PrimeVue

---

**Bon développement !** 🎨✨

