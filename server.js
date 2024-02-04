// Importer les bibliothèques nécessaires
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Stocker l'URI de la base de données MongoDB Atlas dans une variable
const urlDatabase = process.env.MONGO_URI;

// Se connecter à la base de données en utilisant mongoose
mongoose.connect(urlDatabase);

// Définir le schéma pour le modèle Personne
const { Schema } = mongoose;
const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: null
    },
    favoriteFoods: {
        type: [String],
        default: []
    }
});

// Créer le modèle Personne
const Personne = mongoose.model('Personne', personSchema);

// Créer et enregistrer un enregistrement du modèle
const personne = new Personne({
    name: "Moussa Sarré",
    age: 25,
    favoriteFoods: ["Yassa Poulet", "Thiakri", "Thieboudienne"]
});
let id;

personne.save()
    .then(data => {
        console.log('Personne enregistrée avec succès :', data);
        id = data._id;
    })
    .catch(err => {
        console.error('Erreur lors de l\'enregistrement de la personne :', err.message);
    });

// Créer plusieurs enregistrements avec model.create()
const arraydePersonnes = [
    {
        name: "Amina Diop",
        age: 25,
        favoriteFoods: ["Thieboudienne", "lakh"]
    },
    {
        name: "Simon Diouf",
        age: 30,
        favoriteFoods: ["Burger", "Pizza"]
    },
    {
        name: "Abdoulaye Sarré",
        age: 22,
        favoriteFoods: ["Soupe Kandjia","Thieboudienne"]
    },
    {
        name: "Aliou Sarré",
        age: 18,
        favoriteFoods: ["Couscous", "Thieboudienne", "Bissap"]
    },
    {
        name: "Fatoumata Barry",
        age: 35,
        favoriteFoods: ["Domoda", "Thieboudienne", "Plasas"]
    }
];

Personne.create(arraydePersonnes)
    .then(data => {
        console.log('Personnes créées avec succès :', data);

        // Opérations sur la base de données après l'ajout du tableau
        // Utiliser model.findById() pour rechercher dans la base de données par _id
        Personne.findById(id)
            .then(personne => {
                console.log('Personne trouvée par ID :', personne);

                // Effectuer des mises à jour classiques en exécutant Find, Edit, puis Save
                personne.favoriteFoods.push('Hamburger');
                return personne.save();
            })
            .then(personneMiseAJour => {
                console.log('Personne mise à jour avec succès :', personneMiseAJour);

                // Effectuer de nouvelles mises à jour sur un document en utilisant model.findOneAndUpdate()
                const personNameToUpdate = 'Moussa Sarré';
                return Personne.findOneAndUpdate({ name: {$regex : new RegExp(personNameToUpdate, 'i')} }, { age: 20 }, { new: true });
            })
            .then(personneMiseAJour => {
                console.log('Personne mise à jour avec la nouvelle mise à jour :', personneMiseAJour);

                // Supprimer un document en utilisant model.findByIdAndDelete
                return Personne.findByIdAndDelete(id);
            })
            .then(personneSupprimee => {
                console.log('Personne supprimée avec succès :', personneSupprimee);

                // MongoDB et Mongoose - Supprimer plusieurs documents avec model.deleteMany()
                return Personne.deleteMany({ name: { $regex : /Sarré/i } });
            })
            .then(result => {
                console.log(`Supprimé ${result.deletedCount} personnes avec le nom Sarré`);

                // Chainer les aides de requête de recherche pour affiner les résultats
                return Personne.find({ favoriteFoods: { $regex: /Thieboudienne/i } })
                    .sort('name')
                    .limit(2)
                    .select('-age');
            })
            .then(data => {
                console.log('Résultat du chaînage des aides de requête de recherche :', data);
            })
            .catch(err => {
                console.error('Erreur lors des opérations avancées :', err.message);
            })
            .finally(() => {
                // Fermer la connexion à la base de données après avoir terminé toutes les opérations
                mongoose.connection.close();
            });
    })
    .catch(err => {
        console.error('Erreur lors de la création des personnes :', err.message);
    });