/**
 * i18nService.js — Simple internationalisation for True Angel
 *
 * Supports: English (en), Hindi (hi), Spanish (es), French (fr)
 * Usage:
 *   import { t, setLanguage } from '@/services/i18nService';
 *   t('greeting')  // → "Hello!"
 */

// ── Translations ────────────────────────────────────────────

const translations = {
  // ──────────────────── ENGLISH ─────────────────────────────
  en: {
    // General
    greeting: 'Hello!',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    appName: 'True Angel',
    tagline: 'Your Personal Health Assistant',
    loading: 'Loading…',
    error: 'Something went wrong',
    retry: 'Retry',
    success: 'Success!',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    done: 'Done',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    search: 'Search',
    noResults: 'No results found',

    // Navigation / Sections
    dashboard: 'Dashboard',
    medicines: 'Medicines',
    alarms: 'Alarms',
    reminders: 'Reminders',
    family: 'Family Care',
    reports: 'Reports',
    profile: 'Profile',
    settings: 'Settings',
    health: 'Health',
    habits: 'Habits',

    // Medicine
    addMedicine: 'Add Medicine',
    editMedicine: 'Edit Medicine',
    medicineName: 'Medicine Name',
    dosage: 'Dosage',
    frequency: 'Frequency',
    times: 'Times',
    startDate: 'Start Date',
    endDate: 'End Date',
    notes: 'Notes',
    history: 'History',
    taken: 'Taken',
    missed: 'Missed',
    delayed: 'Delayed',
    adherence: 'Adherence',
    adherenceRate: 'Adherence Rate',
    noMedicines: 'No medicines added yet',
    markAsTaken: 'Mark as Taken',
    markAsMissed: 'Mark as Missed',

    // Alarms
    addAlarm: 'Add Alarm',
    editAlarm: 'Edit Alarm',
    alarmLabel: 'Label',
    alarmTime: 'Time',
    alarmType: 'Type',
    daily: 'Daily',
    weekly: 'Weekly',
    oneTime: 'One Time',
    custom: 'Custom',
    snooze: 'Snooze',
    noAlarms: 'No alarms set',

    // Reminders
    addReminder: 'Add Reminder',
    editReminder: 'Edit Reminder',
    upcoming: 'Upcoming',
    overdue: 'Overdue',
    completed: 'Completed',
    pending: 'Pending',
    priority: 'Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    task: 'Task',
    appointment: 'Appointment',
    note: 'Note',
    noReminders: 'No reminders yet',

    // Family
    addMember: 'Add Member',
    editMember: 'Edit Member',
    familyMembers: 'Family Members',
    relationship: 'Relationship',
    emergencyContact: 'Emergency Contact',
    alerts: 'Alerts',
    noAlerts: 'No alerts',
    noMembers: 'No family members added',

    // Health
    waterIntake: 'Water Intake',
    glasses: 'glasses',
    goal: 'Goal',
    sleepTracker: 'Sleep Tracker',
    bedtime: 'Bedtime',
    wakeTime: 'Wake Time',
    sleepQuality: 'Sleep Quality',
    hoursSlept: 'Hours Slept',
    dailyHabits: 'Daily Habits',
    streak: 'Streak',

    // Settings
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    fontSize: 'Font Size',
    normal: 'Normal',
    large: 'Large',
    contrast: 'Contrast',
    highContrast: 'High Contrast',
    voice: 'Voice',
    voiceSpeed: 'Voice Speed',
    notifications: 'Notifications',
    sound: 'Sound',
    vibration: 'Vibration',

    // Auth
    login: 'Log In',
    logout: 'Log Out',
    signup: 'Sign Up',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    age: 'Age',

    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    update: 'Update',
    remove: 'Remove',

    // Data states
    noData: 'No data available',
    empty: 'Nothing here yet',

    // Voice
    voiceHint: 'Tap the mic and speak your command',
    listening: 'Listening…',
    processing: 'Processing…',
    voiceNotSupported: 'Voice is not supported in this browser',

    // Misc
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    all: 'All',
    total: 'Total',
    average: 'Average',
    percentage: 'Percentage',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    category: 'Category',
    description: 'Description',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    getStarted: 'Get Started',
    letsGo: "Let's Go!",
    aboutApp: 'About True Angel',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    helpSupport: 'Help & Support',
    rateApp: 'Rate App',
    shareApp: 'Share App',
    exportData: 'Export Data',
    importData: 'Import Data',
    resetData: 'Reset All Data',
    confirmDelete: 'Are you sure you want to delete this?',
    confirmReset: 'This will erase all your data. Continue?',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    goodNight: 'Good Night',
  },

  // ──────────────────── HINDI ───────────────────────────────
  hi: {
    greeting: 'नमस्ते!',
    welcome: 'स्वागत है',
    welcomeBack: 'वापसी पर स्वागत है',
    appName: 'True Angel',
    tagline: 'आपका व्यक्तिगत स्वास्थ्य सहायक',
    loading: 'लोड हो रहा है…',
    error: 'कुछ गलत हो गया',
    retry: 'पुनः प्रयास करें',
    success: 'सफल!',
    confirm: 'पुष्टि करें',
    yes: 'हाँ',
    no: 'नहीं',
    ok: 'ठीक है',
    done: 'हो गया',
    close: 'बंद करें',
    back: 'वापस',
    next: 'अगला',
    skip: 'छोड़ें',
    search: 'खोजें',
    noResults: 'कोई परिणाम नहीं मिला',

    dashboard: 'डैशबोर्ड',
    medicines: 'दवाइयाँ',
    alarms: 'अलार्म',
    reminders: 'अनुस्मारक',
    family: 'परिवार देखभाल',
    reports: 'रिपोर्ट',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    health: 'स्वास्थ्य',
    habits: 'आदतें',

    addMedicine: 'दवाई जोड़ें',
    editMedicine: 'दवाई संपादित करें',
    medicineName: 'दवाई का नाम',
    dosage: 'खुराक',
    frequency: 'आवृत्ति',
    times: 'समय',
    startDate: 'शुरू की तारीख',
    endDate: 'अंतिम तारीख',
    notes: 'नोट्स',
    history: 'इतिहास',
    taken: 'ली गई',
    missed: 'छूट गई',
    delayed: 'देरी से',
    adherence: 'पालन',
    adherenceRate: 'पालन दर',
    noMedicines: 'अभी कोई दवाई नहीं जोड़ी गई',
    markAsTaken: 'ली गई के रूप में चिह्नित करें',
    markAsMissed: 'छूट गई के रूप में चिह्नित करें',

    addAlarm: 'अलार्म जोड़ें',
    editAlarm: 'अलार्म संपादित करें',
    alarmLabel: 'लेबल',
    alarmTime: 'समय',
    alarmType: 'प्रकार',
    daily: 'रोज़ाना',
    weekly: 'साप्ताहिक',
    oneTime: 'एक बार',
    custom: 'कस्टम',
    snooze: 'स्नूज़',
    noAlarms: 'कोई अलार्म सेट नहीं',

    addReminder: 'अनुस्मारक जोड़ें',
    editReminder: 'अनुस्मारक संपादित करें',
    upcoming: 'आगामी',
    overdue: 'अतिदेय',
    completed: 'पूर्ण',
    pending: 'लंबित',
    priority: 'प्राथमिकता',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    task: 'कार्य',
    appointment: 'अपॉइंटमेंट',
    note: 'नोट',
    noReminders: 'अभी कोई अनुस्मारक नहीं',

    addMember: 'सदस्य जोड़ें',
    editMember: 'सदस्य संपादित करें',
    familyMembers: 'परिवार के सदस्य',
    relationship: 'संबंध',
    emergencyContact: 'आपातकालीन संपर्क',
    alerts: 'अलर्ट',
    noAlerts: 'कोई अलर्ट नहीं',
    noMembers: 'कोई परिवार का सदस्य नहीं जोड़ा गया',

    waterIntake: 'पानी की मात्रा',
    glasses: 'गिलास',
    goal: 'लक्ष्य',
    sleepTracker: 'नींद ट्रैकर',
    bedtime: 'सोने का समय',
    wakeTime: 'जागने का समय',
    sleepQuality: 'नींद की गुणवत्ता',
    hoursSlept: 'सोने के घंटे',
    dailyHabits: 'दैनिक आदतें',
    streak: 'लगातार दिन',

    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    language: 'भाषा',
    fontSize: 'फ़ॉन्ट साइज़',
    normal: 'सामान्य',
    large: 'बड़ा',
    contrast: 'कंट्रास्ट',
    highContrast: 'उच्च कंट्रास्ट',
    voice: 'आवाज़',
    voiceSpeed: 'आवाज़ की गति',
    notifications: 'सूचनाएँ',
    sound: 'ध्वनि',
    vibration: 'कंपन',

    login: 'लॉग इन',
    logout: 'लॉग आउट',
    signup: 'साइन अप',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फ़ोन',
    age: 'उम्र',

    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएँ',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    update: 'अपडेट करें',
    remove: 'हटाएँ',

    noData: 'कोई डेटा उपलब्ध नहीं',
    empty: 'यहाँ अभी कुछ नहीं है',

    voiceHint: 'माइक दबाएँ और बोलें',
    listening: 'सुन रहा है…',
    processing: 'प्रोसेस हो रहा है…',
    voiceNotSupported: 'इस ब्राउज़र में आवाज़ समर्थित नहीं है',

    today: 'आज',
    tomorrow: 'कल',
    yesterday: 'कल (बीता)',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    all: 'सभी',
    total: 'कुल',
    average: 'औसत',
    percentage: 'प्रतिशत',
    date: 'तारीख',
    time: 'समय',
    status: 'स्थिति',
    category: 'श्रेणी',
    description: 'विवरण',
    selectDate: 'तारीख चुनें',
    selectTime: 'समय चुनें',
    getStarted: 'शुरू करें',
    letsGo: 'चलिए शुरू करें!',
    aboutApp: 'True Angel के बारे में',
    version: 'संस्करण',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    helpSupport: 'सहायता और समर्थन',
    rateApp: 'ऐप रेट करें',
    shareApp: 'ऐप शेयर करें',
    exportData: 'डेटा निर्यात करें',
    importData: 'डेटा आयात करें',
    resetData: 'सभी डेटा रीसेट करें',
    confirmDelete: 'क्या आप वाकई इसे हटाना चाहते हैं?',
    confirmReset: 'इससे आपका सारा डेटा मिट जाएगा। जारी रखें?',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    goodNight: 'शुभ रात्रि',
  },

  // ──────────────────── SPANISH ─────────────────────────────
  es: {
    greeting: '¡Hola!',
    welcome: 'Bienvenido',
    welcomeBack: 'Bienvenido de nuevo',
    appName: 'True Angel',
    tagline: 'Tu Asistente Personal de Salud',
    loading: 'Cargando…',
    error: 'Algo salió mal',
    retry: 'Reintentar',
    success: '¡Éxito!',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    ok: 'Aceptar',
    done: 'Hecho',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    skip: 'Omitir',
    search: 'Buscar',
    noResults: 'No se encontraron resultados',

    dashboard: 'Panel',
    medicines: 'Medicamentos',
    alarms: 'Alarmas',
    reminders: 'Recordatorios',
    family: 'Cuidado Familiar',
    reports: 'Informes',
    profile: 'Perfil',
    settings: 'Configuración',
    health: 'Salud',
    habits: 'Hábitos',

    addMedicine: 'Añadir Medicamento',
    editMedicine: 'Editar Medicamento',
    medicineName: 'Nombre del Medicamento',
    dosage: 'Dosis',
    frequency: 'Frecuencia',
    times: 'Horarios',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    notes: 'Notas',
    history: 'Historial',
    taken: 'Tomado',
    missed: 'Perdido',
    delayed: 'Retrasado',
    adherence: 'Adherencia',
    adherenceRate: 'Tasa de Adherencia',
    noMedicines: 'No hay medicamentos añadidos',
    markAsTaken: 'Marcar como Tomado',
    markAsMissed: 'Marcar como Perdido',

    addAlarm: 'Añadir Alarma',
    editAlarm: 'Editar Alarma',
    alarmLabel: 'Etiqueta',
    alarmTime: 'Hora',
    alarmType: 'Tipo',
    daily: 'Diario',
    weekly: 'Semanal',
    oneTime: 'Una Vez',
    custom: 'Personalizado',
    snooze: 'Posponer',
    noAlarms: 'No hay alarmas configuradas',

    addReminder: 'Añadir Recordatorio',
    editReminder: 'Editar Recordatorio',
    upcoming: 'Próximos',
    overdue: 'Vencidos',
    completed: 'Completados',
    pending: 'Pendientes',
    priority: 'Prioridad',
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    task: 'Tarea',
    appointment: 'Cita',
    note: 'Nota',
    noReminders: 'No hay recordatorios',

    addMember: 'Añadir Miembro',
    editMember: 'Editar Miembro',
    familyMembers: 'Miembros de la Familia',
    relationship: 'Relación',
    emergencyContact: 'Contacto de Emergencia',
    alerts: 'Alertas',
    noAlerts: 'Sin alertas',
    noMembers: 'No hay miembros de familia añadidos',

    waterIntake: 'Consumo de Agua',
    glasses: 'vasos',
    goal: 'Meta',
    sleepTracker: 'Rastreador de Sueño',
    bedtime: 'Hora de Dormir',
    wakeTime: 'Hora de Despertar',
    sleepQuality: 'Calidad del Sueño',
    hoursSlept: 'Horas Dormidas',
    dailyHabits: 'Hábitos Diarios',
    streak: 'Racha',

    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    language: 'Idioma',
    fontSize: 'Tamaño de Fuente',
    normal: 'Normal',
    large: 'Grande',
    contrast: 'Contraste',
    highContrast: 'Alto Contraste',
    voice: 'Voz',
    voiceSpeed: 'Velocidad de Voz',
    notifications: 'Notificaciones',
    sound: 'Sonido',
    vibration: 'Vibración',

    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    signup: 'Registrarse',
    name: 'Nombre',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    age: 'Edad',

    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Añadir',
    update: 'Actualizar',
    remove: 'Eliminar',

    noData: 'No hay datos disponibles',
    empty: 'Nada aquí todavía',

    voiceHint: 'Toca el micrófono y habla tu comando',
    listening: 'Escuchando…',
    processing: 'Procesando…',
    voiceNotSupported: 'La voz no es compatible en este navegador',

    today: 'Hoy',
    tomorrow: 'Mañana',
    yesterday: 'Ayer',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    all: 'Todos',
    total: 'Total',
    average: 'Promedio',
    percentage: 'Porcentaje',
    date: 'Fecha',
    time: 'Hora',
    status: 'Estado',
    category: 'Categoría',
    description: 'Descripción',
    selectDate: 'Seleccionar Fecha',
    selectTime: 'Seleccionar Hora',
    getStarted: 'Comenzar',
    letsGo: '¡Vamos!',
    aboutApp: 'Acerca de True Angel',
    version: 'Versión',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    helpSupport: 'Ayuda y Soporte',
    rateApp: 'Calificar App',
    shareApp: 'Compartir App',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    resetData: 'Restablecer Todos los Datos',
    confirmDelete: '¿Estás seguro de que deseas eliminarlo?',
    confirmReset: 'Esto borrará todos tus datos. ¿Continuar?',
    goodMorning: 'Buenos Días',
    goodAfternoon: 'Buenas Tardes',
    goodEvening: 'Buenas Noches',
    goodNight: 'Buenas Noches',
  },

  // ──────────────────── FRENCH ──────────────────────────────
  fr: {
    greeting: 'Bonjour !',
    welcome: 'Bienvenue',
    welcomeBack: 'Bon retour',
    appName: 'True Angel',
    tagline: 'Votre Assistant Santé Personnel',
    loading: 'Chargement…',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    success: 'Succès !',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    ok: "D'accord",
    done: 'Terminé',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    skip: 'Passer',
    search: 'Rechercher',
    noResults: 'Aucun résultat trouvé',

    dashboard: 'Tableau de Bord',
    medicines: 'Médicaments',
    alarms: 'Alarmes',
    reminders: 'Rappels',
    family: 'Soins Familiaux',
    reports: 'Rapports',
    profile: 'Profil',
    settings: 'Paramètres',
    health: 'Santé',
    habits: 'Habitudes',

    addMedicine: 'Ajouter un Médicament',
    editMedicine: 'Modifier le Médicament',
    medicineName: 'Nom du Médicament',
    dosage: 'Dosage',
    frequency: 'Fréquence',
    times: 'Horaires',
    startDate: 'Date de Début',
    endDate: 'Date de Fin',
    notes: 'Notes',
    history: 'Historique',
    taken: 'Pris',
    missed: 'Manqué',
    delayed: 'Retardé',
    adherence: 'Observance',
    adherenceRate: "Taux d'Observance",
    noMedicines: 'Aucun médicament ajouté',
    markAsTaken: 'Marquer comme Pris',
    markAsMissed: 'Marquer comme Manqué',

    addAlarm: 'Ajouter une Alarme',
    editAlarm: "Modifier l'Alarme",
    alarmLabel: 'Libellé',
    alarmTime: 'Heure',
    alarmType: 'Type',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    oneTime: 'Une Fois',
    custom: 'Personnalisé',
    snooze: 'Reporter',
    noAlarms: "Aucune alarme configurée",

    addReminder: 'Ajouter un Rappel',
    editReminder: 'Modifier le Rappel',
    upcoming: 'À Venir',
    overdue: 'En Retard',
    completed: 'Terminés',
    pending: 'En Attente',
    priority: 'Priorité',
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
    task: 'Tâche',
    appointment: 'Rendez-vous',
    note: 'Note',
    noReminders: 'Aucun rappel',

    addMember: 'Ajouter un Membre',
    editMember: 'Modifier le Membre',
    familyMembers: 'Membres de la Famille',
    relationship: 'Relation',
    emergencyContact: "Contact d'Urgence",
    alerts: 'Alertes',
    noAlerts: "Aucune alerte",
    noMembers: 'Aucun membre de famille ajouté',

    waterIntake: "Consommation d'Eau",
    glasses: 'verres',
    goal: 'Objectif',
    sleepTracker: 'Suivi du Sommeil',
    bedtime: 'Heure du Coucher',
    wakeTime: 'Heure du Réveil',
    sleepQuality: 'Qualité du Sommeil',
    hoursSlept: 'Heures Dormies',
    dailyHabits: 'Habitudes Quotidiennes',
    streak: 'Série',

    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    language: 'Langue',
    fontSize: 'Taille de Police',
    normal: 'Normal',
    large: 'Grand',
    contrast: 'Contraste',
    highContrast: 'Contraste Élevé',
    voice: 'Voix',
    voiceSpeed: 'Vitesse de la Voix',
    notifications: 'Notifications',
    sound: 'Son',
    vibration: 'Vibration',

    login: 'Connexion',
    logout: 'Déconnexion',
    signup: "S'inscrire",
    name: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    age: 'Âge',

    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    update: 'Mettre à Jour',
    remove: 'Retirer',

    noData: 'Aucune donnée disponible',
    empty: 'Rien ici pour le moment',

    voiceHint: 'Appuyez sur le micro et parlez',
    listening: 'Écoute en cours…',
    processing: 'Traitement…',
    voiceNotSupported: "La voix n'est pas supportée dans ce navigateur",

    today: "Aujourd'hui",
    tomorrow: 'Demain',
    yesterday: 'Hier',
    thisWeek: 'Cette Semaine',
    thisMonth: 'Ce Mois',
    all: 'Tous',
    total: 'Total',
    average: 'Moyenne',
    percentage: 'Pourcentage',
    date: 'Date',
    time: 'Heure',
    status: 'Statut',
    category: 'Catégorie',
    description: 'Description',
    selectDate: 'Sélectionner la Date',
    selectTime: "Sélectionner l'Heure",
    getStarted: 'Commencer',
    letsGo: "C'est parti !",
    aboutApp: 'À propos de True Angel',
    version: 'Version',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: "Conditions d'Utilisation",
    helpSupport: 'Aide et Support',
    rateApp: "Noter l'Application",
    shareApp: "Partager l'Application",
    exportData: 'Exporter les Données',
    importData: 'Importer les Données',
    resetData: 'Réinitialiser Toutes les Données',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci ?',
    confirmReset: 'Cela effacera toutes vos données. Continuer ?',
    goodMorning: 'Bonjour',
    goodAfternoon: 'Bon Après-midi',
    goodEvening: 'Bonsoir',
    goodNight: 'Bonne Nuit',
  },
};

// ── State ───────────────────────────────────────────────────

let currentLanguage = 'en';

// Try to restore from localStorage
try {
  const stored = localStorage.getItem('true-angel-language');
  if (stored && translations[stored]) {
    currentLanguage = stored;
  }
} catch {
  // localStorage not available
}

// ── Public API ──────────────────────────────────────────────

/**
 * Translate a key using the current language.
 * Falls back to English, then to the raw key.
 * Supports nested keys with dot notation (e.g., 'nav.dashboard').
 *
 * @param {string} key
 * @param {Object} params — optional interpolation: t('hello', {name: 'Sam'}) → "Hello, Sam"
 * @returns {string}
 */
export function t(key, params = {}) {
  let value =
    translations[currentLanguage]?.[key] ??
    translations.en?.[key] ??
    key;

  // Simple interpolation: replace {{param}} with values
  if (params && typeof value === 'string') {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
  }

  return value;
}

/**
 * Set the active language.
 * @param {'en'|'hi'|'es'|'fr'} lang
 */
export function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`i18n: unsupported language "${lang}", falling back to "en".`);
    lang = 'en';
  }
  currentLanguage = lang;
  try {
    localStorage.setItem('true-angel-language', lang);
  } catch {
    // localStorage not available
  }
}

/**
 * Get the current language code.
 * @returns {string}
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Get all supported languages with labels.
 * @returns {Array<{code: string, label: string}>}
 */
export function getSupportedLanguages() {
  return [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'fr', label: 'Français (French)' },
  ];
}

/**
 * Check if a language is supported.
 * @param {string} lang
 * @returns {boolean}
 */
export function isLanguageSupported(lang) {
  return !!translations[lang];
}
