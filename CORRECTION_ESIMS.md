# ✅ Correction Erreur eSIMs - 500 Internal Server Error

## Problème
```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'inventory_id' in 'field list'
```

## Cause
Le contrôleur utilisait `inventory_id` alors que la colonne dans la base de données s'appelle `telna_inventory_id`.

## Solution Appliquée ✅
- Remplacé `inventory_id` par `telna_inventory_id` dans le `select()`
- Remplacé `inventory_id` par `telna_inventory_id` dans le filtre `where()`

## Fichier Modifié
- `waw1/waw/app/Http/Controllers/Admin/EsimAdminController.php`

---

**L'erreur est maintenant corrigée !** ✅

Les eSIMs devraient maintenant s'afficher correctement avec tous les champs :
- ID
- ICCID
- IMSI (mapped_imsi)
- Statut (sim_status)
- Pays (country_code)
- Inventaire (telna_inventory_id)
- Date de création

