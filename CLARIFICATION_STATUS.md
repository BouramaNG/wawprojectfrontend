# 📋 Clarification : Champ Status vs Sim_Status

## Réponse à votre question

**J'utilise le champ `sim_status`** ✅

## Explication

Il y a **deux champs** dans la table `esims` :

### 1. `status` (ancien champ)
- Créé dans la migration : `2025_07_07_151845_add_status_to_esims_table.php`
- Valeur par défaut : `'PRE-SERVICE'`
- Format : `PRE-SERVICE`, `IN-SERVICE`, etc. (majuscules)

### 2. `sim_status` (nouveau champ - Phase 2)
- Créé dans la migration : `2025_12_28_183128_improve_esims_table_for_phase2.php`
- Vient de Telna lors de la synchronisation
- Format : `pre-service`, `in-service`, `terminated` (minuscules)
- **C'est celui que j'utilise** ✅

## Où j'utilise `sim_status` :

1. **Contrôleur** (`EsimAdminController.php`) :
   - Ligne 48 : `$query->where('sim_status', $request->status);`
   - Ligne 65 : `'sim_status' => $esim->sim_status ?? null,`
   - Ligne 81-85 : Statistiques par `sim_status`

2. **Frontend** (`Esims/Index.vue`) :
   - Ligne 145 : Colonne `{ key: 'sim_status', label: 'Statut', sortable: true }`
   - Ligne 122-133 : Template pour afficher `item.sim_status`

## Note

Il y a une incohérence dans la méthode `getStockStats()` qui utilise encore `status` au lieu de `sim_status`. Je peux corriger cela si vous voulez.

---

**Conclusion : J'utilise `sim_status` (le champ Telna) et non `status` (l'ancien champ).** ✅

