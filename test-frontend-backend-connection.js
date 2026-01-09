#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion entre le frontend et le backend
 * Utilise les mêmes appels API que le frontend
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

// Fonction pour tester un endpoint
async function testEndpoint(name, method, url, data = null) {
  try {
    console.log(`\n🧪 Test ${name}:`);
    console.log(`   ${method.toUpperCase()} ${url}`);

    const config = {
      method,
      url: API_BASE_URL + url,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }

    const response = await axios(config);

    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📄 Data keys: ${Object.keys(response.data || {}).join(', ')}`);

    return { success: true, data: response.data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.response?.status || error.code}`);
    console.log(`   💬 Message: ${error.response?.data?.message || error.message}`);
    return { success: false, error };
  }
}

// Tests principaux
async function runTests() {
  console.log('🚗 Test de connexion Frontend ↔ Backend Véhicules Online');
  console.log('='.repeat(60));

  const results = [];

  // Test 1: Endpoint catalogue (GET /catalogue)
  const catalogueTest = await testEndpoint(
    'Catalogue',
    'get',
    '/catalogue'
  );
  results.push(catalogueTest);

  // Test 2: Endpoint catalogue une ligne (GET /catalogue/une-ligne)
  const catalogueUneLigneTest = await testEndpoint(
    'Catalogue une ligne',
    'get',
    '/catalogue/une-ligne'
  );
  results.push(catalogueUneLigneTest);

  // Test 3: Endpoint soldes (GET /catalogue/soldes)
  const soldesTest = await testEndpoint(
    'Véhicules soldés',
    'get',
    '/catalogue/soldes'
  );
  results.push(soldesTest);

  // Test 4: Tentative d'authentification (devrait échouer sans token)
  const authTest = await testEndpoint(
    'Authentification (sans token)',
    'get',
    '/auth/profile'
  );
  results.push(authTest);

  // Test 5: Tentative de panier (devrait échouer sans token)
  const panierTest = await testEndpoint(
    'Panier (sans token)',
    'get',
    '/panier'
  );
  results.push(panierTest);

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS:');

  const successfulTests = results.filter(r => r.success).length;
  const totalTests = results.length;

  console.log(`✅ Tests réussis: ${successfulTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - successfulTests}/${totalTests}`);

  if (successfulTests > 0) {
    console.log('\n🎉 Le backend répond aux requêtes du frontend !');
    console.log('💡 Les endpoints GET publics fonctionnent correctement.');
  } else {
    console.log('\n❌ Le backend ne répond pas. Vérifiez:');
    console.log('   - Le backend est-il démarré ? (./run.sh)');
    console.log('   - Le port 8080 est-il disponible ?');
    console.log('   - Y a-t-il des erreurs de compilation ?');
  }

  // Tests d'authentification attendus
  console.log('\n🔐 Tests d\'authentification attendus:');
  console.log('   - Les endpoints /auth/* et /panier/* nécessitent un token JWT');
  console.log('   - Utilisez l\'application frontend pour tester l\'authentification complète');
}

// Exécution des tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };
