# 🔍 Guide de Debug - Guards et Permissions

**Problème :** Page blanche + redirection infinie

---

## 🐛 Symptômes

- Page blanche au chargement
- Console : "Accès refusé à la route 'dashboard'"
- Console : "Infinite redirect in navigation guard"

---

## ✅ Solutions Appliquées

### 1. Normalisation du Rôle
- Le rôle est maintenant normalisé lors du login
- Support objet `{name: 'admin'}` et string `'admin'`
- Comparaison insensible à la casse

### 2. Éviter la Boucle Infinie
- Si accès refusé au dashboard → redirection vers login (pas dashboard)
- Vérification `from.name` pour éviter les redirections circulaires
- Si rôle non trouvé → autorisation par défaut (backend vérifiera)

### 3. Chargement du Rôle
- Le backend `/api/me` charge maintenant automatiquement la relation `role`
- Le login stocke le rôle correctement dans localStorage

---

## 🧪 Tests de Vérification

### 1. Vérifier le localStorage

Ouvrir la console du navigateur et exécuter :

```javascript
// Vérifier le token
console.log('Token:', localStorage.getItem('auth_token'))

// Vérifier l'utilisateur
const user = JSON.parse(localStorage.getItem('auth_user'))
console.log('User:', user)
console.log('Role:', user?.role)
console.log('Role name:', user?.role?.name || user?.role)
```

**Résultat attendu :**
- Token : présent (string JWT)
- User : objet avec id, email, name
- Role : `{name: 'admin'}` ou `'admin'`

### 2. Vérifier la Réponse API

Dans l'onglet Network :
- Faire une requête vers `/api/me`
- Vérifier la réponse JSON
- Le champ `role` doit être présent

### 3. Vérifier en Base de Données

```bash
php artisan tinker
```

```php
$user = \App\Models\User::where('email', 'admin@waw.com')->with('role')->first();
echo "User ID: " . $user->id . "\n";
echo "Role ID: " . $user->role_id . "\n";
echo "Role Name: " . $user->role->name . "\n";
```

**Résultat attendu :**
- Role ID : 1
- Role Name : admin

---

## 🔧 Actions Correctives

### Si le rôle n'est pas dans localStorage

1. **Se déconnecter et se reconnecter**
2. **Vérifier la réponse du login** dans Network
3. **Vérifier que `/api/me` retourne le rôle**

### Si la boucle infinie persiste

1. **Vider le localStorage** :
   ```javascript
   localStorage.clear()
   ```
2. **Se reconnecter**
3. **Vérifier les logs console**

### Si l'utilisateur n'a pas le rôle admin

```bash
php artisan tinker
```

```php
use App\Models\User;
use App\Models\Role;

$user = User::where('email', 'admin@waw.com')->first();
$adminRole = Role::where('name', 'admin')->first();
$user->role_id = $adminRole->id;
$user->save();
```

---

## 📝 Logs à Surveiller

Après connexion, la console doit afficher :

```
✅ Utilisateur connecté: {id: X, email: 'admin@waw.com', role: 'admin'}
✅ Utilisateur dans localStorage: {role: {name: 'admin'}, role_name: 'admin'}
```

Si vous voyez :
- `role: null` → Le rôle n'est pas chargé
- `role: undefined` → L'utilisateur n'est pas stocké correctement

---

## ✅ Statut

**Corrections appliquées** - Rechargez la page et testez

---

**Si le problème persiste après ces corrections, vérifiez :**
1. Que l'utilisateur existe en base avec `role_id = 1`
2. Que le rôle `admin` existe (id = 1)
3. Que la relation `User->role` fonctionne

