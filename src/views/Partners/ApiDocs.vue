<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Documentation API Partenaires</h1>
      <p class="text-gray-600 mt-1">Guide complet pour intégrer l'API WAW dans votre application</p>
    </div>

    <!-- Table des matières -->
    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Table des matières</h2>
      <nav class="space-y-2">
        <a href="#authentication" class="block text-primary-600 hover:text-primary-800">1. Authentification</a>
        <a href="#endpoints" class="block text-primary-600 hover:text-primary-800">2. Endpoints</a>
        <a href="#examples" class="block text-primary-600 hover:text-primary-800">3. Exemples de code</a>
        <a href="#errors" class="block text-primary-600 hover:text-primary-800">4. Gestion des erreurs</a>
      </nav>
    </div>

    <!-- Authentification -->
    <section id="authentication" class="card mb-6">
      <h2 class="text-2xl font-bold mb-4">🔐 Authentification</h2>
      <p class="text-gray-700 mb-4">
        Toutes les requêtes à l'API Partenaire nécessitent une authentification via clés API.
        Vous devez inclure vos credentials dans les headers de chaque requête.
      </p>

      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 class="font-semibold mb-2">Headers requis :</h3>
        <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>X-API-Key: waw_votre_api_key
X-API-Secret: votre_api_secret</code></pre>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-yellow-800">
          <strong>⚠️ Important :</strong> Ne partagez jamais vos clés API. Conservez-les en sécurité.
          En cas de compromission, régénérez immédiatement vos clés depuis le dashboard.
        </p>
      </div>
    </section>

    <!-- Endpoints -->
    <section id="endpoints" class="space-y-6">
      <!-- GET Templates -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">📦 Lister les Templates Disponibles</h3>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">GET</span>
        </div>
        <p class="text-gray-700 mb-4">Récupère la liste de tous les templates eSIM disponibles avec leurs prix partenaire.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">URL :</p>
          <code class="text-primary-600">GET /api/partner/templates</code>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">Exemple de requête (cURL) :</p>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>curl -X GET "http://localhost:8000/api/partner/templates" \
  -H "X-API-Key: waw_votre_api_key" \
  -H "X-API-Secret: votre_api_secret"</code></pre>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <p class="font-semibold mb-2">Réponse (200 OK) :</p>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "USA 10GB",
      "country_code": "US",
      "data_mb": 10240,
      "validity_days": 30,
      "partner_price": 5000,
      "standard_price": 6000
    }
  ]
}</code></pre>
        </div>
      </div>

      <!-- GET Prices -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">💰 Lister les Prix</h3>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">GET</span>
        </div>
        <p class="text-gray-700 mb-4">Récupère la liste de tous les prix eSIM avec filtres optionnels.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">URL :</p>
          <code class="text-primary-600">GET /api/partner/prices?country_code=US&data_mb=10240</code>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">Paramètres de requête (optionnels) :</p>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
            <li><code>country_code</code> : Code pays ISO (ex: US, FR)</li>
            <li><code>data_mb</code> : Volume de données en MB</li>
          </ul>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <p class="font-semibold mb-2">Exemple de requête :</p>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>curl -X GET "http://localhost:8000/api/partner/prices?country_code=US" \
  -H "X-API-Key: waw_votre_api_key" \
  -H "X-API-Secret: votre_api_secret"</code></pre>
        </div>
      </div>

      <!-- POST Order -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">🛒 Créer une Commande</h3>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">POST</span>
        </div>
        <p class="text-gray-700 mb-4">Crée une nouvelle commande et active une eSIM pour votre client.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">URL :</p>
          <code class="text-primary-600">POST /api/partner/orders</code>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">Body (JSON) :</p>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>{
  "template_id": 1,
  "customer_email": "client@example.com",
  "customer_name": "John Doe",
  "external_reference": "ORDER-12345",
  "metadata": {
    "custom_field": "value"
  }
}</code></pre>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">Champs requis :</p>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
            <li><code>template_id</code> : ID du template eSIM (obligatoire)</li>
            <li><code>customer_email</code> : Email du client (obligatoire)</li>
            <li><code>customer_name</code> : Nom du client (obligatoire)</li>
            <li><code>external_reference</code> : Référence externe (optionnel)</li>
            <li><code>metadata</code> : Données personnalisées (optionnel)</li>
          </ul>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <p class="font-semibold mb-2">Réponse (201 Created) :</p>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>{
  "success": true,
  "message": "Commande créée et eSIM activée avec succès",
  "data": {
    "order_id": 123,
    "partner_order_id": 456,
    "status": "completed",
    "esim": {
      "iccid": "8910300000016328125",
      "activation_code": "QR_CODE_DATA",
      "qr_code_url": "https://..."
    }
  }
}</code></pre>
        </div>
      </div>

      <!-- GET Orders -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">📋 Lister les Commandes</h3>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">GET</span>
        </div>
        <p class="text-gray-700 mb-4">Récupère la liste de toutes vos commandes avec pagination et filtres.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">URL :</p>
          <code class="text-primary-600">GET /api/partner/orders?page=1&per_page=15&status=completed</code>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">Paramètres de requête :</p>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
            <li><code>page</code> : Numéro de page (défaut: 1)</li>
            <li><code>per_page</code> : Nombre d'éléments par page (défaut: 15)</li>
            <li><code>status</code> : Filtrer par statut (pending, processing, completed, failed)</li>
            <li><code>external_reference</code> : Filtrer par référence externe</li>
          </ul>
        </div>
      </div>

      <!-- GET Order Status -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">🔍 Statut d'une Commande</h3>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">GET</span>
        </div>
        <p class="text-gray-700 mb-4">Récupère le statut détaillé d'une commande spécifique.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="font-semibold mb-2">URL :</p>
          <code class="text-primary-600">GET /api/partner/orders/{order_id}</code>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <p class="font-semibold mb-2">Réponse (200 OK) :</p>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>{
  "success": true,
  "data": {
    "order_id": 123,
    "status": "completed",
    "created_at": "2025-12-29T10:00:00Z",
    "esim": {
      "iccid": "8910300000016328125",
      "activation_code": "QR_CODE_DATA"
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Exemples de code -->
    <section id="examples" class="card mt-6">
      <h2 class="text-2xl font-bold mb-4">💻 Exemples de Code</h2>

      <div class="space-y-6">
        <!-- JavaScript/Node.js -->
        <div>
          <h3 class="text-lg font-semibold mb-2">JavaScript/Node.js (Axios)</h3>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'X-API-Key': 'waw_votre_api_key',
    'X-API-Secret': 'votre_api_secret'
  }
});

// Créer une commande
async function createOrder() {
  try {
    const response = await api.post('/partner/orders', {
      template_id: 1,
      customer_email: 'client@example.com',
      customer_name: 'John Doe',
      external_reference: 'ORDER-12345'
    });
    console.log('Commande créée:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
}</code></pre>
        </div>

        <!-- PHP -->
        <div>
          <h3 class="text-lg font-semibold mb-2">PHP (cURL)</h3>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/partner/orders');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'template_id' => 1,
    'customer_email' => 'client@example.com',
    'customer_name' => 'John Doe'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-Key: waw_votre_api_key',
    'X-API-Secret: votre_api_secret'
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);</code></pre>
        </div>

        <!-- Python -->
        <div>
          <h3 class="text-lg font-semibold mb-2">Python (Requests)</h3>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto"><code>import requests

headers = {
    'X-API-Key': 'waw_votre_api_key',
    'X-API-Secret': 'votre_api_secret',
    'Content-Type': 'application/json'
}

data = {
    'template_id': 1,
    'customer_email': 'client@example.com',
    'customer_name': 'John Doe'
}

response = requests.post(
    'http://localhost:8000/api/partner/orders',
    headers=headers,
    json=data
)

print(response.json())</code></pre>
        </div>
      </div>
    </section>

    <!-- Gestion des erreurs -->
    <section id="errors" class="card mt-6">
      <h2 class="text-2xl font-bold mb-4">❌ Gestion des Erreurs</h2>

      <div class="space-y-4">
        <div>
          <h3 class="font-semibold mb-2">401 - Non authentifié</h3>
          <pre class="bg-gray-800 text-red-400 p-4 rounded overflow-x-auto"><code>{
  "success": false,
  "message": "Clé API invalide ou expirée"
}</code></pre>
        </div>

        <div>
          <h3 class="font-semibold mb-2">400 - Requête invalide</h3>
          <pre class="bg-gray-800 text-red-400 p-4 rounded overflow-x-auto"><code>{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "template_id": ["Le champ template_id est requis."]
  }
}</code></pre>
        </div>

        <div>
          <h3 class="font-semibold mb-2">404 - Ressource non trouvée</h3>
          <pre class="bg-gray-800 text-red-400 p-4 rounded overflow-x-auto"><code>{
  "success": false,
  "message": "Commande introuvable"
}</code></pre>
        </div>

        <div>
          <h3 class="font-semibold mb-2">500 - Erreur serveur</h3>
          <pre class="bg-gray-800 text-red-400 p-4 rounded overflow-x-auto"><code>{
  "success": false,
  "message": "Erreur lors du traitement de la demande",
  "error": "Message d'erreur détaillé"
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Support -->
    <section class="card mt-6 bg-primary-50">
      <h2 class="text-2xl font-bold mb-4">📞 Support</h2>
      <p class="text-gray-700 mb-4">
        Pour toute question ou problème, contactez notre équipe support :
      </p>
      <ul class="list-disc list-inside space-y-2 text-gray-700">
        <li>Email : support@waw.com</li>
        <li>Documentation complète : <a href="#" class="text-primary-600 hover:underline">docs.waw.com</a></li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// Page statique de documentation
</script>

<style scoped>
pre {
  font-size: 0.875rem;
  line-height: 1.5;
}

code {
  font-family: 'Courier New', monospace;
}

section {
  scroll-margin-top: 2rem;
}
</style>

