# Guide de Connexion Admin - Vehicules Online

## 🚀 Démarrage du Backend

### Option 1 : Script automatique (Recommandé)
./run.sh





## 👤 Comptes Administrateur

Le système crée automatiquement les comptes suivants au démarrage :

### Admin
- **Email** : `admin@vehicules-online.com`
- **Mot de passe** : `admin123`
- **Rôle** : `ADMIN`
- **Accès** : Toutes les fonctionnalités admin

### Manager
- **Email** : `manager@vehicules-online.com`
- **Mot de passe** : `manager123`
- **Rôle** : `MANAGER`
- **Accès** : Fonctionnalités manager

### User (Test)
- **Email** : `user@vehicules-online.com`
- **Mot de passe** : `user123`
- **Rôle** : `USER`
- **Accès** : Fonctionnalités utilisateur standard

## 🔐 Connexion Admin

1. **Démarrer le backend** (voir ci-dessus)
2. **Démarrer le frontend** :
  
   cd zamba-auto-frontend
   npm run dev
   
3. **Accéder à la page de connexion** : http://localhost:3000/login
4. **Se connecter avec** :
   - Email : `admin@vehicules-online.com`
   - Mot de passe : `admin123`
5. **Accéder au dashboard admin** : Cliquer sur "Administration" dans la navbar

## ✅ Vérification

### Tester la connexion admin via curl :
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@vehicules-online.com","password":"admin123"}' \
  http://localhost:8080/api/auth/login
```

### Vérifier que le backend fonctionne :
```bash
curl http://localhost:8080/api/test
```

## 🐛 Résolution de problèmes

### Erreur : "connect ECONNREFUSED 127.0.0.1:8080"
**Solution** : Le backend n'est pas démarré. Utilisez `./run.sh` ou démarrez-le manuellement.

### Erreur : "Bad credentials" (400)
**Solutions** :
1. Vérifiez que vous utilisez les bons identifiants
2. Vérifiez que le backend a bien créé l'admin (regardez les logs)
3. Vérifiez que l'admin est activé (`enabled=true`)

### Erreur : "Utilisateur non trouvé"
**Solution** : L'admin n'a pas été créé. Redémarrez le backend pour forcer la création.

## 📝 Logs

Les logs du backend sont disponibles dans :
- `backend/backend.log` (si démarré avec le script)
- Console (si démarré avec Maven)

Recherchez dans les logs :
```
✅ Utilisateur admin créé: admin@vehicules-online.com / admin123
```

## 🔧 Configuration

### Ports par défaut
- **Backend** : 8080
- **Frontend** : 3000

### Base de données
- **MySQL**  : Utiliser le profil `mysql`

## 📞 Support

Si les problèmes persistent :
1. Vérifiez les logs du backend
2. Vérifiez que le port 8080 n'est pas utilisé par un autre processus
3. Vérifiez que Java et Maven sont installés

