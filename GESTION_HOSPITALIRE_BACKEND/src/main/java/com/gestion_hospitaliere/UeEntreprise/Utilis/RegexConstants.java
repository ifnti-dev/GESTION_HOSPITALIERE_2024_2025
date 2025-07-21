package com.gestion_hospitaliere.UeEntreprise.Utilis;

public final class RegexConstants {

    private RegexConstants() {
        // empêche l'instanciation
    }

    public static final String LETTRES_SEULEMENT = "^[A-Za-zÀ-ÖØ-öø-ÿ'\\-\\s]+$";
    public static final String EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String ADRESSE = "^[A-Za-zÀ-ÖØ-öø-ÿ0-9'\\-\\s,]+$";
    public static final String TELEPHONE = "^(\\+\\d{1,3})?[-.\\s]?\\d{8,15}$";
    public static final String SEXE = "^(Homme|homme|HOMME|Femme|femme|FEMME|Autre|autre|AUTRE|H|h|F|f|Masculin|masculin|MASCULIN|Féminin|féminin|MALE|Male|male|m|M|FEMELLE|Femelle|femelle|f)$";
    public static final String DATE = "^\\d{4}-\\d{2}-\\d{2}$";
    public static final String MOT_DE_PASSE_SIMPLE = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
    public static final String MOT_DE_PASSE_FORT = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=\\-{};:'\",.<>?]).{8,}$";
    public static final String NUM_ORDRE = "^[A-Z0-9-]+$";
    public static final String HEURE_PLAGE = "^([01]\\d|2[0-3]):[0-5]\\d-([01]\\d|2[0-3]):[0-5]\\d$";
}
