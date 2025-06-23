-- 1. Services hospitaliers
INSERT INTO service_hopital (nom, type) VALUES 
('Maternité', 'Obstétrique'),
('Cardiologie', 'Médecine interne'),
('Pédiatrie', 'Pédiatrie'),
('Chirurgie', 'Chirurgie générale'),
('Urgences', 'Urgences médicales');

-- 2. Utilisateurs (employés) – correction en supprimant les colonnes manquantes
INSERT INTO utilisateur (dtype, nom, prenom, specialite, horaires_travail, date_debut_affectation, actif, service_id) VALUES 
('Medecin', 'vivi', 'lolo', 'Cardiologie', '8h-18h', '2015-03-10', true, 2),
('Medecin', 'joie', 'majoie', 'Pédiatrie', '9h-17h', '2010-06-15', true, 3),
('Medecin', 'love', 'coco', 'Chirurgie', '7h-19h', '2018-01-20', true, 4),
('SageFemme', 'riz', 'loiloi', 'Accouchement', '8h-20h', '2017-05-12', true, 1),
('SageFemme', 'bene', 'jojo', 'Suivi grossesse', '9h-17h', '2019-02-28', true, 1),
('Caissier', 'vivu', 'jyce', 'Caissier principal', '8h-16h', '2018-04-05', true, NULL),
('Caissier', 'voie', 'lolo', 'Caissier adjoint', '9h-17h', '2020-07-22', true, NULL);

-- 3. Patients – En s'assurant que l'ID patient soit unique
INSERT INTO patient (nom, prenom, date_naissance) VALUES 
('lili', 'Alice', '1990-02-15'),
('love', 'Paul', '1985-07-22'),
('brave', 'love', '1995-11-30'),
('momo', 'joiejoie', '1988-04-18'),
('loi', 'Lajjjjura', '1992-09-05');

-- 4. Dossiers médicaux
INSERT INTO dossier_medical (dtype, antecedents, allergies, groupe_sanguin, patient_id) VALUES 
('DossierMedical', 'Hypertension', 'Pénicilline', 'A+', 1),
('DossierMedical', 'Diabète type 2', 'Aucune', 'B-', 2),
('DossierMedical', 'Asthme', 'Aspirine', 'O+', 3),
('DossierMedical', 'Aucun', 'Aucune', 'AB+', 4),
('DossierMedical', 'Chirurgie appendicite 2010', 'Iode', 'A-', 5);

-- 5. Rendez-vous
INSERT INTO rendez_vous (date_heure, type, statut, notes, patient_id, medecin_id, sagefemme_id) VALUES 
('2023-05-10 09:30:00', 'Consultation', 'Confirmé', 'Première visite', 1, 1, NULL),
('2023-05-11 10:00:00', 'Echographie', 'Confirmé', 'Echographie du 1er trimestre', 1, NULL, 4),
('2023-05-12 14:30:00', 'Consultation', 'Confirmé', 'Suivi diabète', 2, 2, NULL),
('2023-05-13 11:00:00', 'Consultation prénatale', 'Confirmé', '3ème mois', 3, NULL, 5),
('2023-05-14 16:00:00', 'Consultation', 'Annulé', 'Patient a reporté', 4, 3, NULL);

-- 6. Consultations
INSERT INTO consultation (date, symptomes, diagnostic, medecin_id, patient_id) VALUES 
('2023-05-10', 'Fatigue, maux de tête', 'Hypertension artérielle', 1, 1),
('2023-05-12', 'Soif excessive, perte de poids', 'Diabète type 2 déséquilibré', 2, 2),
('2023-05-13', 'Douleurs abdominales', 'Grossesse normale', 1, 3);




-- 9. Suivi d’état
INSERT INTO suivi_etat (date, temperature, tension, observations, patient_id) VALUES 
('2023-05-10', 37, 14.5, 'Pression légèrement élevée', 1),
('2023-05-12', 36, 12.8, 'État stable', 2),
('2023-05-13', 37, 11.9, 'Aucun symptôme alarmant', 3);

-- 10. Factures (en supprimant "caissier_id" si nécessaire)
INSERT INTO facture (type, montant_total, statut, date) VALUES 
('Consultation', 50.00, 'Payée', '2023-05-10'),
('Echographie', 120.00, 'Payée', '2023-05-11'),
('Hospitalisation', 850.00, 'En attente', '2023-05-15');

-- 11. Paiements
INSERT INTO paiement (montant, date, moyen) VALUES 
(50.00, '2023-05-10', 'Carte bancaire'),
(120.00, '2023-05-11', 'Espèces');

-- 12. Hospitalisations (en supprimant "motif")
INSERT INTO hospitalisation (date_entree, date_sortie, service_id, patient_id) VALUES 
('2023-05-15', '2023-05-20', 2, 1),
('2023-05-10', NULL, 1, 3);
