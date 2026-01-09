// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOrderDocuments, downloadDocument } from '../api/orders'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Alert from '../components/ui/Alert'
import { FileText, Download, Eye } from 'lucide-react'

const Documents = () => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [selectedOrderId])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError('')

      if (selectedOrderId) {
        const docs = await getOrderDocuments(selectedOrderId)
        setDocuments(docs)
      } else {
        // Charger les documents de toutes les commandes si pas de commande sélectionnée
        // Pour l'instant, on simule avec des données
        setDocuments([
          {
            id: 1,
            type: 'BON_COMMANDE',
            nom: 'Bon de commande - Commande #12345',
            dateCreation: '2024-01-15',
            format: 'PDF',
            taille: '245 KB'
          },
          {
            id: 2,
            type: 'IMMATRICULATION',
            nom: 'Demande d\'immatriculation - Commande #12345',
            dateCreation: '2024-01-15',
            format: 'PDF',
            taille: '180 KB'
          },
          {
            id: 3,
            type: 'CESSION',
            nom: 'Certificat de cession - Commande #12345',
            dateCreation: '2024-01-15',
            format: 'PDF',
            taille: '156 KB'
          }
        ])
      }
    } catch (err) {
      setError('Erreur lors du chargement des documents')
      console.error('Erreur chargement documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (documentId, documentName) => {
    try {
      await downloadDocument(documentId)
      // Le téléchargement est géré par l'API
    } catch (err) {
      setError('Erreur lors du téléchargement du document')
      console.error('Erreur téléchargement:', err)
    }
  }

  const getDocumentIcon = (type) => {
    return <FileText className="w-8 h-8 text-blue-600" />
  }

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'BON_COMMANDE': 'Bon de commande',
      'IMMATRICULATION': 'Demande d\'immatriculation',
      'CESSION': 'Certificat de cession',
      'FACTURE': 'Facture',
      'CONTRAT_CREDIT': 'Contrat de crédit'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Chargement de vos documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Documents</h1>
        <p className="text-gray-600">
          Consultez et téléchargez tous vos documents liés aux commandes
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Filtre par commande */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrer par commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les commandes</option>
              <option value="12345">Commande #12345</option>
              <option value="12346">Commande #12346</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <div className="grid gap-4">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-gray-600">
                Vous n'avez encore aucun document généré pour vos commandes.
              </p>
            </CardContent>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getDocumentIcon(doc.type)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {doc.nom}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getDocumentTypeLabel(doc.type)} • {doc.format} • {doc.taille}
                      </p>
                      <p className="text-xs text-gray-500">
                        Créé le {new Date(doc.dateCreation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.id, doc.nom)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownload(doc.id, doc.nom)}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informations complémentaires */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>À propos des documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Documents disponibles</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bon de commande : Confirmation de votre achat</li>
                <li>• Demande d'immatriculation : Pour l'immatriculation du véhicule</li>
                <li>• Certificat de cession : Transfert de propriété</li>
                <li>• Facture : Document comptable</li>
                <li>• Contrat de crédit : Accord de financement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Support</h4>
              <p className="text-sm text-gray-600 mb-3">
                Besoin d'aide avec vos documents ? Contactez notre service client.
              </p>
              <Button variant="outline" size="sm">
                Contacter le support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Documents
