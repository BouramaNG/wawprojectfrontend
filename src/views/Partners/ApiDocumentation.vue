<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">📚 Documentation API</h1>
            <p class="text-gray-600 mt-1">Guide complet pour intégrer l'API WAW dans votre application</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="copyApiCredentials"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              📋 Copier les credentials
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24 p-4">
            <nav class="space-y-2">
              <a
                v-for="section in sections"
                :key="section.id"
                @click="scrollToSection(section.id)"
                :class="[
                  'block px-4 py-2 rounded-lg transition-colors cursor-pointer',
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ section.label }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- Content -->
        <main class="flex-1 space-y-8">
          <!-- Quick Start -->
          <section id="quick-start" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">🚀 Démarrage Rapide</h2>
            </div>

            <div class="space-y-6">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 class="font-semibold text-blue-900 mb-3">Base URL</h3>
                <div class="flex items-center justify-between bg-white rounded-lg p-4">
                  <code class="text-blue-600 font-mono">{{ baseUrl }}</code>
                  <button
                    @click="copyToClipboard(baseUrl)"
                    class="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 class="font-semibold text-green-900 mb-3">Authentification</h3>
                <p class="text-gray-700 mb-4">
                  Toutes les requêtes nécessitent vos credentials API dans les headers :
                </p>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre class="text-green-400 text-sm"><code>X-API-Key: {{ apiKey || 'votre_api_key' }}
X-API-Secret: {{ apiSecret ? '••••••••' : 'votre_api_secret' }}</code></pre>
                </div>
                <div v-if="!apiKey" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p class="text-blue-800 text-sm">
                    ⚠️ Connectez-vous en tant que partenaire pour voir vos credentials API automatiquement.
                  </p>
                </div>
              </div>

              <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 class="font-semibold text-purple-900 mb-3">Exemple Minimal</h3>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 text-sm"><code>{{ getExampleCurl() }}</code></pre>
                </div>
                <button
                  @click="copyExampleCurl"
                  class="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  📋 Copier l'exemple
                </button>
              </div>
            </div>
          </section>

          <!-- Endpoints -->
          <section id="endpoints" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">📡 Endpoints Disponibles</h2>
            </div>

            <div class="space-y-6">
              <div
                v-for="endpoint in endpoints"
                :key="endpoint.id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <span
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-semibold',
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ endpoint.method }}
                      </span>
                      <code class="text-gray-900 font-mono text-lg">{{ endpoint.path }}</code>
                    </div>
                    <span
                      v-if="endpoint.permission"
                      class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                    >
                      Permission: {{ endpoint.permission }}
                    </span>
                  </div>
                </div>

                <div class="p-6 space-y-4">
                  <p class="text-gray-700">{{ endpoint.description }}</p>

                  <div v-if="endpoint.params && endpoint.params.length > 0">
                    <h4 class="font-semibold text-gray-900 mb-2">Paramètres</h4>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <table class="w-full text-sm">
                        <thead>
                          <tr class="border-b border-gray-200">
                            <th class="text-left py-2 px-3 text-gray-700">Nom</th>
                            <th class="text-left py-2 px-3 text-gray-700">Type</th>
                            <th class="text-left py-2 px-3 text-gray-700">Requis</th>
                            <th class="text-left py-2 px-3 text-gray-700">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="param in endpoint.params"
                            :key="param.name"
                            class="border-b border-gray-200"
                          >
                            <td class="py-2 px-3"><code class="text-primary-600">{{ param.name }}</code></td>
                            <td class="py-2 px-3 text-gray-600">{{ param.type }}</td>
                            <td class="py-2 px-3">
                              <span
                                :class="[
                                  'px-2 py-0.5 rounded text-xs',
                                  param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                                ]"
                              >
                                {{ param.required ? 'Oui' : 'Non' }}
                              </span>
                            </td>
                            <td class="py-2 px-3 text-gray-600">{{ param.description }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Exemple de requête</h4>
                      <div class="flex space-x-2">
                        <button
                          v-for="lang in ['curl', 'php', 'javascript', 'python']"
                          :key="lang"
                          @click="selectedLanguage = lang"
                          :class="[
                            'px-3 py-1 rounded text-sm transition-colors',
                            selectedLanguage === lang
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          ]"
                        >
                          {{ lang }}
                        </button>
                      </div>
                    </div>
                    <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre class="text-green-400 text-sm"><code>{{ getCodeExample(endpoint, selectedLanguage) }}</code></pre>
                    </div>
                    <button
                      @click="copyCodeExample(getCodeExample(endpoint, selectedLanguage))"
                      class="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      📋 Copier
                    </button>
                  </div>

                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">Exemple de réponse</h4>
                    <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                      <pre class="text-gray-800 text-sm"><code>{{ JSON.stringify(endpoint.exampleResponse, null, 2) }}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Code Examples -->
          <section id="examples" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">💻 Exemples de Code Complets</h2>
            </div>

            <div class="space-y-6">
              <div
                v-for="example in codeExamples"
                :key="example.language"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900">{{ example.title }}</h3>
                  <button
                    @click="copyCodeExample(example.code)"
                    class="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                  >
                    📋 Copier
                  </button>
                </div>
                <div class="bg-gray-900 p-6 overflow-x-auto">
                  <pre class="text-green-400 text-sm"><code>{{ example.code }}</code></pre>
                </div>
              </div>
            </div>
          </section>

          <!-- Error Handling -->
          <section id="errors" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">❌ Gestion des Erreurs</h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="error in errorCodes"
                :key="error.code"
                class="border border-gray-200 rounded-lg p-6"
              >
                <div class="flex items-center space-x-3 mb-3">
                  <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                    {{ error.code }}
                  </span>
                  <h3 class="font-semibold text-gray-900">{{ error.title }}</h3>
                </div>
                <p class="text-gray-700 mb-3">{{ error.description }}</p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <pre class="text-gray-800 text-sm"><code>{{ JSON.stringify(error.example, null, 2) }}</code></pre>
                </div>
              </div>
            </div>
          </section>

          <!-- Support -->
          <section id="support" class="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-8">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">📞 Support & Aide</h2>
            </div>
            <p class="text-gray-700 mb-4">
              Besoin d'aide ? Notre équipe est là pour vous accompagner dans l'intégration de l'API.
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-2">📧 Email</h3>
                <a href="mailto:si@wawtelecom.com" class="text-primary-600 hover:underline">
                  si@wawtelecom.com
                </a>
              </div>
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-2">💬 WhatsApp</h3>
                <a href="https://wa.me/221783718472" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:underline">
                  +221 78 371 84 72
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { authService } from '@/services/auth'

const baseUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
const apiKey = ref('')
const apiSecret = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const activeSection = ref('quick-start')
const selectedLanguage = ref('curl')

const sections = [
  { id: 'quick-start', label: '🚀 Démarrage Rapide' },
  { id: 'endpoints', label: '📡 Endpoints' },
  { id: 'examples', label: '💻 Exemples' },
  { id: 'errors', label: '❌ Erreurs' },
  { id: 'support', label: '📞 Support' },
]

const endpoints = [
  {
    id: 'templates',
    method: 'GET',
    path: '/templates',
    description: 'Récupère la liste des packages disponibles pour votre partenaire.',
    permission: 'templates',
    params: [
      { name: 'country', type: 'string', required: false, description: 'Code pays (ISO 3166-1 alpha-2, ex: FR, US)' },
    ],
    exampleResponse: {
      success: true,
      data: [
        {
          id: 1,
          plan_name: 'France 1GB',
          country_name: 'France',
          data_limit: 1,
          validity_days: 7,
          price: 9.99,
        },
      ],
    },
  },
  {
    id: 'prices',
    method: 'GET',
    path: '/prices',
    description: 'Récupère les prix des packages par pays.',
    permission: 'prices',
    params: [
      { name: 'country', type: 'string', required: false, description: 'Code pays (ISO 3166-1 alpha-2)' },
    ],
    exampleResponse: {
      success: true,
      data: {
        FR: [
          { template_id: 1, price: 9.99, currency: 'EUR' },
        ],
      },
    },
  },
  {
    id: 'orders',
    method: 'POST',
    path: '/orders',
    description: 'Crée une nouvelle commande eSIM pour un client.',
    permission: 'orders',
    params: [
      { name: 'package_template_id', type: 'integer', required: true, description: 'ID du package template' },
      { name: 'customer_email', type: 'string', required: true, description: 'Email du client' },
      { name: 'external_reference', type: 'string', required: false, description: 'Référence externe de votre système' },
    ],
    exampleResponse: {
      success: true,
      data: {
        order_id: 123,
        partner_order_id: 456,
        external_reference: 'REF-2024-001',
        esim: {
          iccid: '89012345678901234567',
          activation_code: 'LPA:1$consumer.e-sim.global$ABC123...',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...',
        },
        status: 'activated',
      },
    },
  },
  {
    id: 'esims',
    method: 'GET',
    path: '/esims',
    description: 'Liste tous les eSIMs alloués à votre partenaire.',
    permission: 'esims',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Numéro de page (par défaut: 1)' },
      { name: 'per_page', type: 'integer', required: false, description: 'Nombre d\'éléments par page (par défaut: 15)' },
    ],
    exampleResponse: {
      success: true,
      data: [
        {
          id: 1,
          iccid: '89012345678901234567',
          status: 'activated',
          order_id: 123,
        },
      ],
      pagination: {
        current_page: 1,
        total: 10,
        per_page: 15,
      },
    },
  },
  {
    id: 'esim-detail',
    method: 'GET',
    path: '/esims/{id}',
    description: 'Récupère les détails d\'un eSIM spécifique, y compris le QR code.',
    permission: 'esims',
    params: [
      { name: 'id', type: 'integer', required: true, description: 'ID de l\'eSIM' },
    ],
    exampleResponse: {
      success: true,
      esim: {
        local: {
          id: 1,
          iccid: '89012345678901234567',
          activation_code: 'LPA:1$consumer.e-sim.global$ABC123...',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...',
          status: 'activated',
        },
      },
    },
  },
]

const codeExamples = [
  {
    language: 'php',
    title: 'PHP - Exemple Complet',
    code: `<?php
$apiKey = '${apiKey.value || 'votre_api_key'}';
$apiSecret = '${apiSecret.value ? '••••••••' : 'votre_api_secret'}';
$baseUrl = '${baseUrl}';

// Créer une commande
$ch = curl_init($baseUrl . '/orders');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: ' . $apiKey,
    'X-API-Secret: ' . $apiSecret,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'package_template_id' => 1,
    'customer_email' => 'client@example.com',
    'external_reference' => 'REF-2024-001',
]));

$response = curl_exec($ch);
$result = json_decode($response, true);
curl_close($ch);

if ($result['success']) {
    echo "Commande créée: " . $result['data']['order_id'];
    echo "QR Code: " . $result['data']['esim']['qr_code_url'];
}`,
  },
  {
    language: 'javascript',
    title: 'JavaScript (Node.js) - Exemple Complet',
    code: `const axios = require('axios');

const apiKey = '${apiKey.value || 'votre_api_key'}';
const apiSecret = '${apiSecret.value ? '••••••••' : 'votre_api_secret'}';
const baseUrl = '${baseUrl}';

async function createOrder() {
  try {
    const response = await axios.post(
      \`\${baseUrl}/orders\`,
      {
        package_template_id: 1,
        customer_email: 'client@example.com',
        external_reference: 'REF-2024-001',
      },
      {
        headers: {
          'X-API-Key': apiKey,
          'X-API-Secret': apiSecret,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
    }
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

createOrder();`,
  },
  {
    language: 'python',
    title: 'Python - Exemple Complet',
    code: `import requests
import json

api_key = '${apiKey.value || 'votre_api_key'}'
api_secret = '${apiSecret.value ? '••••••••' : 'votre_api_secret'}'
base_url = '${baseUrl}'

headers = {
    'X-API-Key': api_key,
    'X-API-Secret': api_secret,
    'Content-Type': 'application/json',
}

data = {
    'package_template_id': 1,
    'customer_email': 'client@example.com',
    'external_reference': 'REF-2024-001',
}

response = requests.post(f'{base_url}/orders', headers=headers, json=data)
result = response.json()

if result['success']:
    print(f"Commande créée: {result['data']['order_id']}")
    print(f"QR Code: {result['data']['esim']['qr_code_url']}")`,
  },
]

const errorCodes = [
  {
    code: 401,
    title: 'Non autorisé',
    description: 'Vos credentials API sont invalides ou manquants.',
    example: {
      success: false,
      message: 'Authentification échouée',
    },
  },
  {
    code: 403,
    title: 'Accès refusé',
    description: 'Votre clé API n\'a pas la permission nécessaire pour cette action.',
    example: {
      success: false,
      message: 'Permission refusée: orders',
    },
  },
  {
    code: 404,
    title: 'Ressource non trouvée',
    description: 'La ressource demandée n\'existe pas.',
    example: {
      success: false,
      message: 'Template non trouvé',
    },
  },
  {
    code: 422,
    title: 'Erreur de validation',
    description: 'Les données fournies sont invalides.',
    example: {
      success: false,
      message: 'Erreur de validation',
      errors: {
        customer_email: ['Le champ email est requis'],
      },
    },
  },
  {
    code: 500,
    title: 'Erreur serveur',
    description: 'Une erreur interne s\'est produite. Contactez le support.',
    example: {
      success: false,
      message: 'Erreur serveur',
    },
  },
]

const getExampleCurl = () => {
  return `curl -X GET "${baseUrl}/templates" \\
  -H "X-API-Key: ${apiKey.value || 'votre_api_key'}" \\
  -H "X-API-Secret: ${apiSecret.value ? '••••••••' : 'votre_api_secret'}"`
}

const getCodeExample = (endpoint, lang) => {
  const endpointPath = endpoint.path.replace('{id}', '1')
  
  if (lang === 'curl') {
    if (endpoint.method === 'GET') {
      return `curl -X GET "${baseUrl}${endpointPath}" \\
  -H "X-API-Key: ${apiKey.value || 'votre_api_key'}" \\
  -H "X-API-Secret: ${apiSecret.value ? '••••••••' : 'votre_api_secret'}"`
    } else if (endpoint.method === 'POST') {
      return `curl -X POST "${baseUrl}${endpointPath}" \\
  -H "X-API-Key: ${apiKey.value || 'votre_api_key'}" \\
  -H "X-API-Secret: ${apiSecret.value ? '••••••••' : 'votre_api_secret'}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.exampleResponse.data || {}, null, 2)}'`
    }
  } else if (lang === 'php') {
    return `<?php
$ch = curl_init('${baseUrl}${endpointPath}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: ${apiKey.value || 'votre_api_key'}',
    'X-API-Secret: ${apiSecret.value ? '••••••••' : 'votre_api_secret'}',
]);
${endpoint.method === 'POST' ? `curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([/* vos données */]));` : ''}
$response = curl_exec($ch);
$result = json_decode($response, true);`
  } else if (lang === 'javascript') {
    return `const axios = require('axios');

const response = await axios.${endpoint.method.toLowerCase()}('${baseUrl}${endpointPath}', {
  headers: {
    'X-API-Key': '${apiKey.value || 'votre_api_key'}',
    'X-API-Secret': '${apiSecret.value ? '••••••••' : 'votre_api_secret'}',
  },
  ${endpoint.method === 'POST' ? `data: {/* vos données */},` : ''}
});
const result = response.data;`
  } else if (lang === 'python') {
    return `import requests

headers = {
    'X-API-Key': '${apiKey.value || 'votre_api_key'}',
    'X-API-Secret': '${apiSecret.value ? '••••••••' : 'votre_api_secret'}',
}
${endpoint.method === 'POST' ? `data = {/* vos données */}
response = requests.post('${baseUrl}${endpointPath}', headers=headers, json=data)` : `response = requests.get('${baseUrl}${endpointPath}', headers=headers)`}
result = response.json()`
  }
  
  return ''
}

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToastMessage('Copié dans le presse-papiers !')
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

const copyCodeExample = (code) => {
  copyToClipboard(code)
}

const copyExampleCurl = () => {
  const example = `curl -X GET "${baseUrl}/templates" \\
  -H "X-API-Key: ${apiKey.value || 'votre_api_key'}" \\
  -H "X-API-Secret: ${apiSecret.value ? '••••••••' : 'votre_api_secret'}"`
  copyToClipboard(example)
}

const copyApiCredentials = async () => {
  const credentials = `API Key: ${apiKey.value || 'Non disponible'}
API Secret: ${apiSecret.value ? '••••••••' : 'Non disponible'}
Base URL: ${baseUrl}`
  await copyToClipboard(credentials)
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handleScroll = () => {
  const sections = document.querySelectorAll('section[id]')
  const scrollPosition = window.scrollY + 200

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      activeSection.value = section.id
    }
  })
}

onMounted(async () => {
  // Charger les credentials API depuis l'API si c'est un partenaire
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  
  if (userType === 'partner') {
    try {
      // Récupérer les informations du partenaire actuel
      const user = authService.getCurrentUser()
      if (user && user.partner_id) {
        // Essayer de récupérer les clés API du partenaire
        // Note: Le secret n'est jamais retourné par l'API pour des raisons de sécurité
        // Il faut le récupérer lors de la génération
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/partner-auth/me`, {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.partner && data.partner.api_keys && data.partner.api_keys.length > 0) {
            // Prendre la première clé API active
            const activeKey = data.partner.api_keys.find(k => k.is_active) || data.partner.api_keys[0]
            if (activeKey) {
              apiKey.value = activeKey.api_key || ''
              // Le secret n'est jamais retourné, on affiche juste un placeholder
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des credentials:', error)
    }
  } else {
    // Pour les admins, essayer de récupérer depuis le localStorage si disponible
    const savedApiKey = localStorage.getItem('demo_api_key')
    if (savedApiKey) {
      apiKey.value = savedApiKey
    }
  }

  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

code {
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
}
</style>
