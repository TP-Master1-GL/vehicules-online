const axios = require('axios');

// Fonction utilitaire pour attendre
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test de connexion frontend-backend
async function testConnection() {
  console.log('🧪 Test de connexion Frontend ↔ Backend\n');

  const baseURL = 'http://localhost:3000'; // Frontend proxy
  const maxRetries = 3;

  try {
    // Test 1: Inscription
    console.log('1. Test d\'inscription...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      nom: 'Test',
      prenom: 'User',
      telephone: '0123456789',
      numeroPermis: 'TEST123456'
    };

    let registerSuccess = false;
    for (let i = 0; i < maxRetries && !registerSuccess; i++) {
      try {
        const registerResponse = await axios.post(`${baseURL}/api/auth/register`, registerData, { timeout: 5000 });
        console.log('✅ Inscription réussie:', registerResponse.status);
        registerSuccess = true;
      } catch (error) {
        if (i < maxRetries - 1) {
          console.log(`⏳ Tentative ${i + 1}/${maxRetries} échouée, nouvelle tentative dans 2s...`);
          await sleep(2000);
        } else {
          console.log('❌ Inscription échouée après', maxRetries, 'tentatives');
          console.log('   Dernière erreur:', error.response?.status, error.response?.statusText);
          console.log('   Détails:', error.response?.data || error.message);
          if (error.response?.data) {
            console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
          }
        }
      }
    }

    // Test 2: Connexion
    console.log('\n2. Test de connexion...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    let loginSuccess = false;
    let token = null;
    for (let i = 0; i < maxRetries && !loginSuccess; i++) {
      try {
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData, { timeout: 5000 });
        console.log('✅ Connexion réussie:', loginResponse.status);
        token = loginResponse.data.token;
        console.log('   Token reçu:', token ? 'Oui' : 'Non');
        loginSuccess = true;
      } catch (error) {
        if (i < maxRetries - 1) {
          console.log(`⏳ Tentative ${i + 1}/${maxRetries} de connexion échouée, nouvelle tentative dans 2s...`);
          await sleep(2000);
        } else {
          console.log('❌ Connexion échouée après', maxRetries, 'tentatives');
          console.log('   Dernière erreur:', error.response?.status, error.response?.statusText);
        }
      }
    }

    if (token) {
      // Test 3: Catalogue avec token
      console.log('\n3. Test du catalogue...');
      let catalogueSuccess = false;
      for (let i = 0; i < maxRetries && !catalogueSuccess; i++) {
        try {
          const catalogueResponse = await axios.get(`${baseURL}/api/catalogue`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 5000
          });
          console.log('✅ Catalogue accessible:', catalogueResponse.status);
          console.log('   Nombre de véhicules:', catalogueResponse.data?.length || 'N/A');
          catalogueSuccess = true;
        } catch (error) {
          if (i < maxRetries - 1) {
            console.log(`⏳ Tentative ${i + 1}/${maxRetries} du catalogue échouée, nouvelle tentative dans 2s...`);
            await sleep(2000);
          } else {
            console.log('❌ Catalogue inaccessible après', maxRetries, 'tentatives');
            console.log('   Dernière erreur:', error.response?.status, error.response?.statusText);
          }
        }
      }
    }

    // Test 4: Catalogue sans authentification (devrait marcher)
    console.log('\n4. Test du catalogue public...');
    let publicCatalogueSuccess = false;
    for (let i = 0; i < maxRetries && !publicCatalogueSuccess; i++) {
      try {
        const publicCatalogueResponse = await axios.get(`${baseURL}/api/catalogue`, { timeout: 5000 });
        console.log('✅ Catalogue public accessible:', publicCatalogueResponse.status);
        console.log('   Nombre de véhicules:', publicCatalogueResponse.data?.length || 'N/A');
        publicCatalogueSuccess = true;
      } catch (error) {
        if (i < maxRetries - 1) {
          console.log(`⏳ Tentative ${i + 1}/${maxRetries} du catalogue public échouée, nouvelle tentative dans 2s...`);
          await sleep(2000);
        } else {
          console.log('❌ Catalogue public inaccessible après', maxRetries, 'tentatives');
          console.log('   Dernière erreur:', error.response?.status, error.response?.statusText);
        }
      }
    }

  } catch (error) {
    console.log('❌ Erreur générale:', error.message);
  }
}

testConnection();