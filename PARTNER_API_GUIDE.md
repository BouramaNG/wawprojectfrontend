# Guide d'Utilisation de l'API Partenaire WAW

> **Dernière mise à jour** : 2026-01-02  
> **Version** : 1.1

Ce guide explique comment utiliser l'API Partenaire WAW depuis l'espace partenaire.

## 📚 Documentation Complète

Pour la documentation complète de l'API, consultez : `waw1/waw/docs/API_PARTENAIRE.md`

## 🔑 Comprendre les Clés API

Lors de la génération d'une clé API pour un partenaire, vous recevez **deux éléments** :

### 1. API Key (Clé Publique)
**Exemple :** `waw_8mvNPGvdfJGRUV1Bj1aO0jbsY5VaqJ8r`

- **Rôle :** Identifiant unique du partenaire
- **Visibilité :** Peut être partagée publiquement (dans les logs, URLs, etc.)
- **Utilisation :** Permet d'identifier quel partenaire fait la requête

### 2. API Secret (Secret Privé)
**Exemple :** `kqpg6CCYExiLrE6W69b2yDIStjZnUcMeXXpXCRf1UrAzyLHxnIR1hQF7ak5mCY8t`

- **Rôle :** Secret d'authentification (comme un mot de passe)
- **Visibilité :** ⚠️ **JAMAIS** partager publiquement
- **Utilisation :** Utilisé pour signer les requêtes et prouver l'identité
- **Stockage :** Doit être stocké de manière sécurisée (variables d'environnement, gestionnaire de secrets)

## 🔐 Comment Utiliser les Clés

### Authentification des Requêtes

Les partenaires doivent inclure les deux clés dans chaque requête :

```bash
# Exemple avec cURL
curl -X POST https://votre-domaine.com/api/partner/orders \
  -H "X-API-Key: waw_8mvNPGvdfJGRUV1Bj1aO0jbsY5VaqJ8r" \
  -H "X-API-Secret: kqpg6CCYExiLrE6W69b2yDIStjZnUcMeXXpXCRf1UrAzyLHxnIR1hQF7ak5mCY8t" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": 123,
    "quantity": 1
  }'
```

### Sécurité

1. **Ne jamais commiter les secrets dans le code source**
2. **Utiliser des variables d'environnement**
3. **Roter les secrets régulièrement**
4. **Ne jamais les partager par email non chiffré**

## 👥 Gestion des Utilisateurs Partenaires

### Créer des Comptes pour les Développeurs

En tant qu'administrateur, vous pouvez créer des comptes utilisateurs pour chaque partenaire :

1. **Accéder à la page Partenaires**
2. **Sélectionner un partenaire**
3. **Onglet "Utilisateurs"**
4. **Créer un nouvel utilisateur** avec :
   - Nom et Email
   - Rôle (Admin, Developer, Viewer)
   - Permissions spécifiques

### Rôles Disponibles

- **Admin** : Accès complet à toutes les fonctionnalités du partenaire
- **Developer** : Peut créer des packages, voir les eSIMs, gérer les commandes
- **Viewer** : Lecture seule (voir les informations)

### Permissions Granulaires

- `packages.create` : Créer des packages
- `packages.view` : Voir les packages
- `esims.view` : Voir les informations eSIM
- `esims.activate` : Activer des eSIMs
- `orders.create` : Créer des commandes
- `orders.view` : Voir les commandes
- `templates.view` : Voir les templates
- `prices.view` : Voir les prix

## 📊 Monitoring des Activités

### Vue d'Ensemble

La page **"Activités Partenaires"** vous permet de :

1. **Voir toutes les activités** de chaque partenaire
2. **Filtrer par partenaire, utilisateur, action**
3. **Identifier l'origine** des activations (plateforme vs partenaire)
4. **Suivre les eSIMs activées** via chaque partenaire

### Distinguer les Activations

Chaque eSIM activée contient :
- `activation_source` : `"platform"` ou `"partner"`
- `partner_id` : ID du partenaire (si activé via partenaire)
- `partner_user_id` : ID de l'utilisateur partenaire
- `activated_by` : Identifiant de qui a activé

## 🔍 Exemples d'Utilisation

### Exemple 1 : Créer une commande via API Partenaire

```javascript
// Le partenaire fait une requête
const response = await fetch('http://localhost:8000/api/partner/orders', {
  method: 'POST',
  headers: {
    'X-API-Key': 'waw_PDHn8ITp6ybgCqId5qFHI9J8kLbbStSb',
    'X-API-Secret': 'kpQGeyAJzuFmOr0yc47Z76sjnIfJv3hKKqiHfmeakMTQv3TL8PWYs60yY3SqaM38',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    package_template_id: 60,
    customer_email: 'client@example.com',
    customer_phone: '+221771234567',
    external_reference: 'HAYO-2024-001'
  })
});

const result = await response.json();

// Réponse inclut :
// - order_id: ID de la commande
// - esim.iccid: Numéro ICCID
// - esim.activation_code: Code d'activation LPA
// - esim.qr_code_url: URL du QR code
// - status: "activated"

// L'eSIM sera marquée avec :
// - activation_source: "partner"
// - partner_id: ID du partenaire
// - activated_by: "api_key_waw_..."
```

### Exemple 2 : Activer via la Plateforme Directe

```javascript
// Un utilisateur final active via votre plateforme
// L'eSIM sera marquée avec :
// - activation_source: "platform"
// - activated_by: "user_123" (ID de l'utilisateur)
```

## 📝 Notes Importantes

1. **L'API Secret n'est visible qu'une seule fois** lors de la génération
2. **Si le secret est perdu**, il faut générer une nouvelle clé API
3. **Les permissions** peuvent être modifiées à tout moment
4. **Toutes les activités sont loggées** pour audit et sécurité
5. **Le QR code est inclus** dans la réponse de création de commande via `qr_code_url`
6. **Les packages doivent être actifs** dans Telna pour fonctionner

## 🔗 Endpoints Disponibles

### Créer une commande
- **POST** `/api/partner/orders`
- **Permission** : `orders`
- **Réponse** : Inclut `esim.qr_code_url` pour le QR code

### Lister les templates
- **GET** `/api/partner/templates`
- **Permission** : `templates`
- **Note** : Seuls les packages autorisés sont retournés

### Obtenir les prix
- **GET** `/api/partner/prices`
- **Permission** : `prices`

### Lister les commandes
- **GET** `/api/partner/orders`
- **Permission** : `orders`

### Voir une commande
- **GET** `/api/partner/orders/{id}`
- **Permission** : `orders`

Pour plus de détails, consultez la documentation complète : `waw1/waw/docs/API_PARTENAIRE.md`

