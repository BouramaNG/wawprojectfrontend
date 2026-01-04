# 🚀 Guide de Démarrage - Dashboard Admin

**Date :** 2025-12-29

---

## 📋 Prérequis

1. Backend Laravel démarré (`php artisan serve`)
2. Frontend Vue.js démarré (`npm run dev`)
3. Base de données configurée et migrée

---

## 👤 Créer l'Utilisateur Admin

### Option 1 : Seeder (Recommandé)

```bash
cd waw1/waw
php artisan db:seed --class=AdminUserSeeder
```

**Identifiants créés :**
- Email: `admin@waw.com`
- Password: `admin123`

### Option 2 : Seeder Complet

```bash
cd waw1/waw
php artisan db:seed
```

Cela créera :
- Les rôles (admin, user)
- L'utilisateur admin
- Les pays/destinations
- Les prix

---

## 🔐 Connexion au Dashboard

1. **Ouvrir le navigateur** : `http://localhost:3000` (ou votre URL frontend)
2. **Vous serez redirigé vers** `/login` si non connecté
3. **Entrer les identifiants** :
   ```
   Email: admin@waw.com
   Password: admin123
   ```
4. **Cliquer sur "Se connecter"**
5. **Vous serez redirigé vers** le Dashboard

---

## ✅ Vérifier l'Accès

### Vérifier que l'utilisateur existe

```bash
cd waw1/waw
php artisan tinker
```

```php
$user = \App\Models\User::where('email', 'admin@waw.com')->first();
$user->role->name; // Doit retourner "admin"
```

### Vérifier les rôles

```php
\App\Models\Role::all();
// Doit retourner admin (id: 1) et user (id: 2)
```

---

## 🎨 Fonctionnalités Dashboard

### Statistiques
- ✅ Total eSIMs
- ✅ Packages actifs
- ✅ Revenus mensuels
- ✅ Partenaires actifs

### Graphiques
- ✅ Ventes (7 derniers jours) - Graphique linéaire
- ✅ eSIMs par statut - Graphique en donut
- ✅ Export CSV des ventes

### Activités Récentes
- ✅ 10 activités les plus récentes
- ✅ Commandes, Packages, Templates
- ✅ Export CSV des activités

---

## 🛠️ Commandes Utiles

### Créer un nouvel admin

```bash
php artisan tinker
```

```php
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

$adminRole = Role::where('name', 'admin')->first();
$user = User::create([
    'name' => 'Nouvel Admin',
    'email' => 'nouveladmin@waw.com',
    'phone' => '+221771234568',
    'password' => Hash::make('votre_mot_de_passe'),
    'role_id' => $adminRole->id,
]);
```

### Réinitialiser le mot de passe admin

```php
$user = User::where('email', 'admin@waw.com')->first();
$user->password = Hash::make('nouveau_mot_de_passe');
$user->save();
```

---

## ⚠️ Sécurité

1. **Changez le mot de passe** après la première connexion
2. **Ne partagez jamais** les identifiants admin
3. **Utilisez des mots de passe forts** en production
4. **Limitez l'accès** au dashboard (IP, VPN, etc.)

---

## 🐛 Dépannage

### "Invalid credentials"
- Vérifiez que l'utilisateur existe
- Vérifiez le mot de passe avec `Hash::check()`
- Réinitialisez le mot de passe si nécessaire

### "Accès refusé" après connexion
- Vérifiez le rôle : `$user->role->name` doit être `'admin'`
- Vérifiez que les rôles existent : `Role::all()`

### Graphiques ne s'affichent pas
- Vérifiez que Chart.js est installé : `npm list chart.js`
- Vérifiez la console navigateur pour erreurs
- Vérifiez que l'API retourne les données `charts`

### Activités vides
- Vérifiez qu'il y a des commandes/packages en base
- Vérifiez la réponse API : `response.data.activities`

---

## 📚 Documentation Complète

- `ACCES_ADMIN.md` - Guide accès admin
- `AUTHENTIFICATION_COMPLETE.md` - Système d'authentification
- `AMELIORATIONS_DASHBOARD_COMPLETE.md` - Graphiques et export
- `RECAP_FINAL.md` - Récapitulatif complet

---

**Bon test !** 🎉

