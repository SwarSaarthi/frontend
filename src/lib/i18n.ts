/**
 * SwarSaarthi — Internationalization (i18n) Strings
 *
 * Bilingual UI text (English + Hindi) for the entire application.
 * The app supports switching between English and Hindi UI languages.
 *
 * Note: The *practice words* are always in Hindi (Devanagari).
 * This file controls the UI chrome/labels, not the practice content.
 */

export const i18n = {
  en: {
    // App-wide
    appName: "SwarSaarthi",
    appNameHindi: "स्वर सारथी",
    tagline: "AI-Powered Speech Assistive System",
    taglineDescription:
      "Helping individuals improve their Hindi pronunciation through personalized practice and real-time feedback.",
    disclaimer: "This is an assistive tool, not a diagnostic system.",

    // Navigation
    navHome: "Home",
    navPractice: "Practice",
    navProfile: "Profile",

    // Home Page
    heroTitle: "Let's Learn to Speak Together",
    heroSubtitle:
      "A kind companion to help you practice and perfect your Hindi pronunciation at your own pace.",
    ctaPractice: "Start Practice",
    ctaProfile: "View Profile",

    howItWorksTitle: "The Speech Therapy Journey",
    howItWorksBadge: "3-Stage Articulation Pipeline",
    howItWorksSubtitle: "From 3D anatomical lip-sync observation to noise-filtered acoustic recording and clinical Mitra guidance.",
    step1Title: "Observe & Listen",
    step1Desc: "Watch the 3D model demonstrate precise tongue and lip movements while listening to natural female Hindi speech at 0.5× to 1.0× speed.",
    step1Label: "Phase 01",
    step2Title: "Articulate & Record",
    step2Desc: "Pronounce the target word or continuous sentence. Native DSP acoustic capture filters background noise for clear phoneme evaluation.",
    step2Label: "Phase 02",
    step3Title: "Mitra Clinical Guidance",
    step3Desc: "Receive Character Error Rate (CER) scores alongside actionable guidance on tongue placement, palate contact, and breath flow.",
    step3Label: "Phase 03",

    // Clinical Methodology Pillars
    pillar1Tag: "01 • Motor Mirroring",
    pillar1Title: "Visual Neurological Priming",
    pillar1Desc: "Observing 3D lip and tongue kinematics primes the motor cortex before vocalization, establishing natural physical readiness for accurate speech.",
    pillar2Tag: "02 • Acoustic DSP",
    pillar2Title: "16kHz Studio Audio Capture",
    pillar2Desc: "Background room noise and reverberation are filtered out to perform spectral analysis purely on vowels and consonants, ensuring precise phoneme evaluation.",
    pillar3Tag: "03 • Physical Prescription",
    pillar3Title: "Actionable Articulation Directives",
    pillar3Desc: "Instead of abstract error scores, Mitra AI provides concrete anatomical directives on tongue placement, lip rounding, and breath flow regulation.",

    // Empathy Section
    empathyBadge: "Safe & Patient Articulation Space",
    empathyTitle: "Designed with Empathy & Clinical Care",
    empathySubtitle: "Speech articulation is an intimate neurological and physical journey. SwarSaarthi provides a calm, pressure-free sanctuary to practice Hindi speech at your own pace.",
    empathyCard1Title: "Zero Judgment, Infinite Retries",
    empathyCard1Desc: "No countdown timers, no social anxiety, and no penalty marks. Practice every sound as many times as you need in total comfort.",
    empathyCard1Tag: "Patient Assistive Pacing",
    empathyCard2Title: "Slow-Motion Acoustic Guidance",
    empathyCard2Desc: "Replay pronunciations at 0.5× or 0.75× speed to isolate subtle dental, retroflex, and aspirated phonetic nuances.",
    empathyCard2Tag: "Phonetic Precision",
    empathyCard3Title: "Compassionate Continuous Growth",
    empathyCard3Desc: "Track your daily word and sentence completions, day streak, and celebrate every small articulation milestone along the way.",
    empathyCard3Tag: "Positive Reinforcement",

    // Features Section
    featuresBadge: "Core Clinical Architecture",
    featuresTitle: "Engineered for Clinical Speech Articulation",
    featuresSubtitle: "State-of-the-art 3D biomechanics, neural ASR, Character Error Rate (CER) analysis, and clinical articulation coaching in one seamless assistive suite.",
    feature1Title: "3D Physiological Lip-Sync Avatar",
    feature1Desc: "Real-time 3D anatomical visualization of jaw elevation, tongue height, palate contact, and lip rounding for Devanagari phonemes.",
    feature2Title: "Words & Continuous Sentences",
    feature2Desc: "500+ curated Hindi vocabulary words and 40+ structured clinical sentences across Basic, Intermediate, and Advanced tiers.",
    feature3Title: "Character Error Rate (CER) Analytics",
    feature3Desc: "Rigorous phoneme and letter-level error analysis calculating precise character distance, substitutions, and accuracy scores.",
    feature4Title: "Mitra AI Articulation Guidance",
    feature4Desc: "Personalized physiological feedback on tongue position, airflow constriction, and vocal tract adjustment in Hindi or English.",
    feature5Title: "Natural Female Neural Voice",
    feature5Desc: "Ultra-clear, soothing Indian Hindi female neural voice (SwaraNeural) with multi-speed slow-motion replay (0.5×–1.25×).",
    feature6Title: "Progress Analytics & Word Mastery",
    feature6Desc: "Track your daily streaks, session accuracy trends, and identify specific sounds that require patient reinforcement.",

    // Student Project Section
    projectBadge: "Final Year Engineering Capstone Project",
    projectTitle: "Built by Students, Powered by Purpose",
    projectDesc: "SwarSaarthi (स्वर सारथी) was created as a final year computer engineering project to bridge the gap in speech assistive technology for Hindi speakers. Our mission is to make speech practice accessible, friendly, and empowering for individuals with speech articulation differences.",

    // Practice Room
    practiceTitle: "Practice Room",
    wordLabel: "Word",
    ofLabel: "of",
    listenCorrect: "Listen to correct pronunciation",
    playbackSpeed: "Speed",
    speedSlow: "Slow",
    speedRelaxed: "Relaxed",
    speedNormal: "Normal",
    speedFast: "Fast",
    tapToRecord: "Tap to record",
    recording: "Recording...",
    processing: "Processing...",
    stopRecording: "Tap to stop",
    tryAgain: "Try Again",
    nextWord: "Next Word",
    prevWord: "Previous",
    skipWord: "Skip",
    meaningLabel: "Meaning",
    transliterationLabel: "Transliteration",

    // Feedback
    feedbackCorrect: "Excellent! Perfect pronunciation.",
    feedbackAlmostThere: "Almost there - listen carefully and try again.",
    feedbackNeedsImprovement: "Needs improvement - listen to the reference audio and try again slowly.",
    feedbackTryAgain: "Try Again",
    feedbackNeutral: "Press the mic button and speak the word shown above.",
    yourPronunciation: "You said",
    expectedPronunciation: "Expected",
    scoreLabel: "Score",

    // Profile
    profileTitle: "My Profile",
    totalPracticed: "Words Practiced",
    accuracy: "Accuracy",
    streak: "Day Streak",
    difficultWordsTitle: "Words to Focus On",
    difficultWordsDesc: "These words need extra practice.",
    recentActivityTitle: "Recent Sessions",
    practiceAgain: "Practice",
    attempts: "attempts",
    bestScore: "best",
    noData: "No data yet. Start practicing!",
    wordsAttempted: "words attempted",
    correct: "correct",
    duration: "minutes",
    date: "Date",

    // Footer
    footerText: "SwarSaarthi, An AI-Powered Speech Assistive System",
    footerNote: "Made with care for better communication",
    langSwitch: "हिन्दी",

    // Before You Begin FAQ Section
    faqEyebrow: "A LITTLE CLARITY",
    faqTitleLine1: "Before you",
    faqTitleLine2: "begin.",
    faqSubtitle: "A few things you might be wondering.",
    faq1Q: "What is SwarSaarthi?",
    faq1A: "SwarSaarthi is a companion for practising Hindi speech. You can listen to a word or sentence, record yourself, and receive pronunciation feedback. It gives your practice a little structure, at a pace you choose.",
    faq2Q: "Do I need to know Hindi already?",
    faq2A: "No prior fluency is required. Every practice item includes Devanagari script, English transliteration, bilingual meanings, and slow-motion audio playback (0.5× to 1.0×) so you can follow along comfortably in either Hindi or English.",
    faq3Q: "How does pronunciation feedback work?",
    faq3A: "When you record, our neural speech model compares your spoken sounds letter-by-letter against the target word using Character Error Rate (CER), and Mitra AI provides gentle, practical tips on tongue placement, lip shape, and breath flow.",
    faq4Q: "Can I practise at my own pace?",
    faq4A: "Completely. There are no countdown timers, penalties, or forced progressions. You can replay reference audio as many times as you like, retry any word freely, or switch between basic words and full sentences whenever you feel ready.",
  },

  hi: {
    // App-wide
    appName: "स्वरसारथी",
    appNameHindi: "स्वर सारथी",
    tagline: "AI संचालित वाक् सहायक प्रणाली",
    taglineDescription:
      "व्यक्तिगत अभ्यास और तत्काल प्रतिक्रिया के माध्यम से हिंदी उच्चारण में सुधार करने में व्यक्तियों की मदद।",
    disclaimer: "यह एक सहायक उपकरण है, निदान प्रणाली नहीं।",

    // Navigation
    navHome: "होम",
    navPractice: "अभ्यास",
    navProfile: "प्रोफ़ाइल",

    // Home Page
    heroTitle: "आइए, साथ मिलकर बोलना सीखें",
    heroSubtitle:
      "अपनी गति से हिंदी उच्चारण का अभ्यास करने और उसे बेहतर बनाने में आपका दयालु सारथी।",
    ctaPractice: "अभ्यास शुरू करें",
    ctaProfile: "प्रोफ़ाइल देखें",

    howItWorksTitle: "वाक् अभ्यास व सुधार यात्रा",
    howItWorksBadge: "3-चरणीय ध्वन्यात्मक यात्रा",
    howItWorksSubtitle: "त्रिविमीय ओष्ठ-निरीक्षण से लेकर 16kHz ऑडियो रिकॉर्डिंग और मित्र क्लिनिकल मार्गदर्शन तक।",
    step1Title: "देखें और सुनें",
    step1Desc: "3D बायोमैकेनिकल मॉडल में जीभ और होंठों की सटीक स्थिति देखें और 0.5× से 1.0× गति पर प्राकृतिक हिंदी उच्चारण सुनें।",
    step1Label: "चरण 01",
    step2Title: "बोलें और रिकॉर्ड करें",
    step2Desc: "लक्ष्य शब्द या पूरे वाक्य का उच्चारण करें। शोर-मुक्त 16kHz ऑडियो रिकॉर्डिंग शुद्ध ध्वन्यात्मक विश्लेषण सुनिश्चित करती है।",
    step2Label: "चरण 02",
    step3Title: "मित्र वाक् परामर्श",
    step3Desc: "कैरेक्टर एरर रेट (CER) स्कोर के साथ जीभ, होंठों और सांस के प्रवाह पर संरचित क्लिनिकल मार्गदर्शन प्राप्त करें।",
    step3Label: "चरण 03",

    // Clinical Methodology Pillars
    pillar1Tag: "01 • मोटर मिररिंग",
    pillar1Title: "दृश्यात्मक तंत्रिका संबलन",
    pillar1Desc: "3D ओष्ठ व जिह्वा संचालन का अवलोकन बोलने से पहले मस्तिष्क के मोटर कॉर्टेक्स को सक्रिय करता है, जिससे उच्चारण की शारीरिक तैयारी सहज हो जाती है।",
    pillar2Tag: "02 • एकॉस्टिक DSP",
    pillar2Title: "16kHz शुद्ध ध्वनि ग्रहण",
    pillar2Desc: "कमरे के शोर और गूंज को फिल्टर कर केवल शुद्ध स्वर और व्यंजन वर्णों का स्पेक्ट्रल विश्लेषण किया जाता है, जिससे सटीक ध्वन्यात्मक परिणाम प्राप्त होते हैं।",
    pillar3Tag: "03 • शारीरिक सुधार मार्गदर्शन",
    pillar3Title: "शारीरिक सुधार मार्गदर्शन",
    pillar3Desc: "अमूर्त अंकों के स्थान पर मित्र AI जीभ के स्थान, होंठों के आकार और सांस छोड़ने के तरीके पर स्पष्ट और व्यावहारिक शारीरिक निर्देश प्रदान करता है।",

    // Empathy Section
    empathyBadge: "सुरक्षित व धैर्यवान वाक् वातावरण",
    empathyTitle: "सहानुभूति और क्लिनिकल संवेदनशीलता से निर्मित",
    empathySubtitle: "वाक् उच्चारण एक व्यक्तिगत शारीरिक और तंत्रिका-संबंधी यात्रा है। स्वरसारथी बिना किसी तनाव या जल्दबाजी के अभ्यास के लिए एक शांत और सुरक्षित वातावरण प्रदान करता है।",
    empathyCard1Title: "शून्य निर्णय, असीमित प्रयास",
    empathyCard1Desc: "कोई टाइमर नहीं, कोई सामाजिक तनाव नहीं और कोई अंक-कटौती नहीं। जितनी बार चाहें उतनी बार बिना किसी दबाव के अभ्यास करें।",
    empathyCard1Tag: "धैर्यवान व सहायक गति",
    empathyCard2Title: "धीमी गति में ध्वन्यात्मक श्रवण",
    empathyCard2Desc: "दन्त्य, मूर्धन्य और महाप्राण ध्वनियों की बारीकियों को समझने के लिए 0.5× या 0.75× गति पर बार-बार उच्चारण सुनें।",
    empathyCard2Tag: "सटीक स्वर संरचना",
    empathyCard3Title: "सहानुभूतिपूर्ण क्रमिक विकास",
    empathyCard3Desc: "दैनिक शब्द व वाक्य अभ्यास, निरंतरता और हर छोटे उच्चारण सुधार को उत्साह के साथ ट्रैक करें।",
    empathyCard3Tag: "सकारात्मक संबलन",

    // Features Section
    featuresBadge: "प्रमुख क्लिनिकल विशेषताएं",
    featuresTitle: "उन्नत वाक् सुधार हेतु समर्पित तकनीक",
    featuresSubtitle: "3D बायोमैकेनिक्स, न्यूरल ASR, कैरेक्टर एरर रेट (CER) और क्लिनिकल वाक् परामर्श का एक संपूर्ण सुलभ मंच।",
    feature1Title: "3D मुखाकृति व ओष्ठ-संचालन मॉडल",
    feature1Desc: "देवनागरी वर्णों के लिए जबड़े की ऊंचाई, जीभ के तालू से स्पर्श और होंठों के फैलाव का सजीव 3D बायोमैकेनिकल प्रदर्शन।",
    feature2Title: "शब्द व सतत वाक्य अभ्यास संग्रह",
    feature2Desc: "500+ हिंदी शब्द और 40+ क्लिनिकल अभ्यास वाक्य, जो सरल, मध्यम और उन्नत तीनों स्तरों में विभाजित हैं।",
    feature3Title: "सटीक कैरेक्टर एरर रेट (CER) विश्लेषण",
    feature3Desc: "अक्षर और वर्ण स्तर पर सटीक तुलना, जो उच्चारण में अक्षरों के बदलाव, विलोपन और वास्तविक शुद्धता का सटीक मापन करती है।",
    feature4Title: "मित्र AI वाक् व ओष्ठ परामर्शदाता",
    feature4Desc: "जीभ की स्थिति, सांस के प्रवाह और ओष्ठ-संचालन पर हिंदी या अंग्रेजी में व्यक्तिगत व संरचित क्लिनिकल मार्गदर्शन।",
    feature5Title: "प्राकृतिक न्यूरल भारतीय स्वर",
    feature5Desc: "अत्यंत स्पष्ट और सौम्य भारतीय हिंदी न्यूरल स्वर (SwaraNeural), जो 0.5× से 1.25× गति पर स्पष्ट ध्वन्यात्मक श्रवण प्रदान करता है।",
    feature6Title: "व्यक्तिगत प्रगति व उच्चारण सातत्य",
    feature6Desc: "दैनिक सत्रों, सटीकता के रुझानों, अभ्यास सातत्य और उन विशिष्ट वर्णों की पहचान करें जिन पर विशेष ध्यान देने की आवश्यकता है।",

    // Student Project Section
    projectBadge: "अंतिम वर्ष इंजीनियरिंग कैपस्टोन प्रोजेक्ट",
    projectTitle: "छात्रों द्वारा निर्मित, उद्देश्य से संचालित",
    projectDesc: "स्वर सारथी (SwarSaarthi) का निर्माण अंतिम वर्ष के कंप्यूटर इंजीनियरिंग प्रोजेक्ट के रूप में किया गया था ताकि हिंदी भाषियों के लिए वाक् सहायक तकनीक के अंतर को कम किया जा सके। हमारा मिशन वाक् उच्चारण संबंधी कठिनाइयों वाले व्यक्तियों के लिए वाक् अभ्यास को सुलभ, अनुकूल और सशक्त बनाना है।",

    // Practice Room
    practiceTitle: "अभ्यास कक्ष",
    wordLabel: "शब्द",
    ofLabel: "में से",
    listenCorrect: "सही उच्चारण सुनें",
    playbackSpeed: "गति",
    speedSlow: "धीमी",
    speedRelaxed: "सहज",
    speedNormal: "सामान्य",
    speedFast: "तेज़",
    tapToRecord: "रिकॉर्ड करने के लिए टैप करें",
    recording: "रिकॉर्ड हो रहा है...",
    processing: "प्रोसेसिंग...",
    stopRecording: "रोकने के लिए टैप करें",
    tryAgain: "फिर से प्रयास करें",
    nextWord: "अगला शब्द",
    prevWord: "पिछला",
    skipWord: "छोड़ें",
    meaningLabel: "अर्थ",
    transliterationLabel: "लिप्यंतरण",

    // Feedback
    feedbackCorrect: "उत्कृष्ट! सटीक उच्चारण।",
    feedbackAlmostThere: "लगभग सही - ध्यान से सुनें और पुनः प्रयास करें।",
    feedbackNeedsImprovement: "सुधार की आवश्यकता है - ऑडियो ध्यान से सुनें और धीरे-धीरे बोलें।",
    feedbackTryAgain: "पुनः प्रयास करें",
    feedbackNeutral: "माइक बटन दबाएँ और ऊपर दिखाया गया शब्द बोलें।",
    yourPronunciation: "आपने कहा",
    expectedPronunciation: "अपेक्षित",
    scoreLabel: "अंक",

    // Profile
    profileTitle: "मेरी प्रोफ़ाइल",
    totalPracticed: "अभ्यास किए शब्द",
    accuracy: "सटीकता",
    streak: "दिन लगातार",
    difficultWordsTitle: "ध्यान देने वाले शब्द",
    difficultWordsDesc: "इन शब्दों को अतिरिक्त अभ्यास की आवश्यकता है।",
    recentActivityTitle: "हाल के सत्र",
    practiceAgain: "अभ्यास करें",
    attempts: "प्रयास",
    bestScore: "सर्वश्रेष्ठ",
    noData: "अभी तक कोई डेटा नहीं। अभ्यास शुरू करें!",
    wordsAttempted: "शब्दों का प्रयास",
    correct: "सही",
    duration: "मिनट",
    date: "तारीख",

    // Footer
    footerText: "स्वरसारथी - AI संचालित वाक् सहायक प्रणाली",
    footerNote: "बेहतर संवाद के लिए देखभाल से बनाया गया",
    langSwitch: "English",

    // Before You Begin FAQ Section
    faqEyebrow: "थोड़ी स्पष्टता",
    faqTitleLine1: "शुरू करने से",
    faqTitleLine2: "पहले।",
    faqSubtitle: "कुछ सामान्य बातें जो आपके मन में हो सकती हैं।",
    faq1Q: "स्वरसारथी (SwarSaarthi) क्या है?",
    faq1A: "स्वरसारथी हिंदी वाक् और उच्चारण अभ्यास के लिए एक सहायक साथी है। इसमें आप किसी शब्द या वाक्य को सुन सकते हैं, अपनी आवाज़ रिकॉर्ड कर सकते हैं और उच्चारण पर स्पष्ट मार्गदर्शन प्राप्त कर सकते हैं—वह भी पूरी तरह अपनी चुनी हुई गति से।",
    faq2Q: "क्या मुझे पहले से हिंदी आना आवश्यक है?",
    faq2A: "धाराप्रवाह हिंदी आना आवश्यक नहीं है। प्रत्येक अभ्यास शब्द के साथ देवनागरी लिपि, अंग्रेजी लिप्यंतरण (Transliteration), दोनों भाषाओं में अर्थ और धीमी गति (0.5× से 1.0×) का ऑडियो उपलब्ध है ताकि आप सहजता से सीख सकें।",
    faq3Q: "उच्चारण फ़ीडबैक कैसे काम करता है?",
    faq3A: "जब आप अपनी आवाज़ रिकॉर्ड करते हैं, तो हमारा न्यूरल वाक् मॉडल कैरेक्टर एरर रेट (CER) के माध्यम से आपके बोले गए अक्षरों की लक्ष्य शब्द से तुलना करता है और मित्र AI जीभ की स्थिति, होंठों के आकार व सांस के प्रवाह पर सरल सुझाव देता है।",
    faq4Q: "क्या मैं अपनी गति से अभ्यास कर सकता हूँ?",
    faq4A: "बिल्कुल। यहाँ कोई टाइमर, अंक कटौती या जल्दबाज़ी नहीं है। आप जितनी बार चाहें सही उच्चारण सुन सकते हैं, बिना किसी दबाव के पुनः प्रयास कर सकते हैं और अपनी सुविधा अनुसार शब्दों या वाक्यों का अभ्यास कर सकते हैं।",
  },
} as const;

export type I18nStrings = (typeof i18n)[keyof typeof i18n];
