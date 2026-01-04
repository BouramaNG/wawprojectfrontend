# 🔧 Correction Rapide - PrimeVue

## Problème
```
Failed to resolve import "@primevue/themes/aura"
```

## Solution Appliquée ✅

J'ai simplifié la configuration PrimeVue dans `src/main.js` pour ne plus utiliser le thème Aura.

**Changement :**
- ❌ Avant : `import Aura from '@primevue/themes/aura'`
- ✅ Maintenant : Configuration simplifiée sans thème personnalisé

## Alternative (Optionnel)

Si vous voulez vraiment utiliser le thème Aura, installez :
```bash
npm install @primevue/themes
```

Mais ce n'est pas nécessaire car on utilise principalement Tailwind CSS pour le design.

---

**Le dashboard devrait maintenant fonctionner !** ✅

Relancez `npm run dev` après cette correction.

