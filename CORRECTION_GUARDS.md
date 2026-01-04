# 🔧 Correction Guards - Problème Redirection Infinie

**Date :** 2025-12-29  
**Problème :** Page blanche + redirection infinie

---

## 🐛 Problème Identifié

1. **Rôle non chargé correctement** : Le rôle de l'utilisateur n'était pas correctement récupéré depuis localStorage
2. **Boucle de redirection** : Redirection vers dashboard qui redirige à nouveau vers dashboard
3. **Format rôle incohérent** : Le rôle peut être un objet `{name: 'admin'}` ou une string `'admin'`

---

## ✅ Corrections Appliquées

### 1. Service Auth (`auth.js`)
- ✅ Normalisation du rôle lors du login
- ✅ Conversion string → objet pour cohérence
- ✅ Amélioration `hasRole()` avec comparaison insensible à la casse

### 2. Guards (`guards.js`)
- ✅ `checkRoutePermission` maintenant async pour récupérer le rôle depuis le serveur si nécessaire
- ✅ Évite la boucle infinie en vérifiant `from.name`
- ✅ Si rôle non trouvé, autorise par défaut (backend vérifiera)
- ✅ Si accès refusé au dashboard, redirige vers login (pas vers dashboard)

### 3. Backend (`AuthController.php`)
- ✅ `me()` charge maintenant la relation `role` automatiquement

### 4. Login (`Login.vue`)
- ✅ Logs pour déboguer le rôle après connexion

---

## 🧪 Tests à Effectuer

1. **Se connecter avec admin@waw.com**
   - Vérifier que le dashboard s'affiche
   - Vérifier la console : le rôle doit être "admin"

2. **Vérifier le localStorage**
   ```javascript
   JSON.parse(localStorage.getItem('auth_user'))
   ```
   - Le champ `role` doit exister et être `{name: 'admin'}` ou `'admin'`

3. **Naviguer entre les pages**
   - Dashboard → Templates → Packages
   - Toutes les pages doivent s'afficher

4. **Vérifier les logs console**
   - Ne doit plus y avoir de warnings "Accès refusé" pour le dashboard
   - Ne doit plus y avoir de redirection infinie

---

## 🔍 Debug

Si le problème persiste, vérifier dans la console :

1. **Rôle dans localStorage** :
   ```javascript
   const user = JSON.parse(localStorage.getItem('auth_user'))
   console.log('User role:', user?.role)
   ```

2. **Token présent** :
   ```javascript
   localStorage.getItem('auth_token')
   ```

3. **Réponse API /me** :
   - Ouvrir Network dans DevTools
   - Vérifier la réponse de `GET /api/me`
   - Le champ `role` doit être présent

---

## ✅ Statut

**Corrections appliquées** - À tester

---

**Si le problème persiste, vérifier :**
1. Que l'utilisateur a bien le rôle `admin` en base de données
2. Que la relation `role` est bien chargée dans la réponse `/api/me`
3. Que le token JWT est valide

