module.exports = [
"[project]/lib/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOCALES",
    ()=>LOCALES
]);
const LOCALES = [
    "en-US",
    "pt-BR"
];
}),
"[project]/lib/translations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTranslations",
    ()=>getTranslations,
    "translations",
    ()=>translations
]);
const translations = {
    "en-US": {
        appName: "OpenCode Learn English",
        tagline: "Context-first vocabulary practice",
        heroTitle: "Build vocabulary with real context",
        heroSubtitle: "Capture new words, practice with spaced repetition, and hear pronunciation in short daily sessions.",
        ctaPractice: "Start Daily Practice",
        ctaAddWord: "Add New Word",
        navPractice: "Daily Practice",
        navWords: "Word Library",
        navSettings: "Settings",
        languageLabel: "Interface language",
        languageHelper: "Choose how the app speaks to you.",
        landingFocusTitle: "What you get",
        landingFocus1: "AI-generated or manual contextual sentences",
        landingFocus2: "Simple spaced repetition tuned for 15-minute sessions",
        landingFocus3: "Audio to reinforce pronunciation",
        wordsTitle: "Word Library",
        wordsSubtitle: "Grow your personal English vocabulary and examples.",
        addWordTitle: "Add a word",
        wordField: "English word",
        translationField: "Translation (optional)",
        partOfSpeechField: "Part of speech (optional)",
        difficultyField: "Difficulty (optional)",
        difficultyEasy: "Easy",
        difficultyMedium: "Medium",
        difficultyHard: "Hard",
        exampleField: "Example sentence (optional)",
        exampleTranslationField: "Example translation (optional)",
        exampleToneLabel: "Tone",
        exampleToneNeutral: "Neutral",
        exampleToneFormal: "Formal",
        exampleToneInformal: "Informal",
        sourceManual: "Manual",
        sourceAi: "AI-generated",
        generateWithAi: "Generate with AI",
        aiOptionsTitle: "AI options",
        aiVariations: "How many variations?",
        aiIncludeTranslation: "Include translation",
        aiGenerateButton: "Generate examples",
        aiGeneratedTitle: "AI suggestions",
        aiUseExample: "Use this example",
        saveWordButton: "Save word",
        wordListTitle: "Your words",
        emptyWords: "No words added yet.",
        practiceTitle: "Daily Practice",
        practiceSubtitle: "Review your due examples in a focused session.",
        practiceReady: "Session ready",
        practiceReveal: "Reveal translation",
        practiceHide: "Hide translation",
        practiceListenWord: "Listen to the word",
        practiceListenSentence: "Listen to the sentence",
        practiceKnown: "I knew",
        practiceAlmost: "Almost",
        practiceNot: "Didn't know",
        practiceDoneTitle: "All caught up",
        practiceDoneSubtitle: "Add more words or wait for the next review window.",
        practiceNextReview: "Next review",
        practiceSource: "Source",
        practiceProgress: "Practice progress",
        settingsTitle: "Settings",
        settingsSubtitle: "Tune the experience for your routine.",
        settingsDailyGoal: "Daily goal (minutes)",
        settingsShowTranslations: "Show translations by default",
        settingsLocalData: "All data is stored locally on this device.",
        formRequired: "This field is required."
    },
    "pt-BR": {
        appName: "OpenCode Learn English",
        tagline: "Vocabulário com contexto primeiro",
        heroTitle: "Construa vocabulário com contexto real",
        heroSubtitle: "Capture novas palavras, pratique com repetição espaçada e ouça pronúncias em sessões diárias curtas.",
        ctaPractice: "Iniciar Prática Diária",
        ctaAddWord: "Adicionar Palavra",
        navPractice: "Prática Diária",
        navWords: "Biblioteca de Palavras",
        navSettings: "Configurações",
        languageLabel: "Idioma da interface",
        languageHelper: "Escolha como o app fala com você.",
        landingFocusTitle: "O que você ganha",
        landingFocus1: "Frases contextualizadas manuais ou com IA",
        landingFocus2: "Repetição espaçada simples para sessões de 15 minutos",
        landingFocus3: "Áudio para reforçar pronúncia",
        wordsTitle: "Biblioteca de Palavras",
        wordsSubtitle: "Cresça seu vocabulário pessoal com exemplos.",
        addWordTitle: "Adicionar palavra",
        wordField: "Palavra em inglês",
        translationField: "Tradução (opcional)",
        partOfSpeechField: "Classe gramatical (opcional)",
        difficultyField: "Dificuldade (opcional)",
        difficultyEasy: "Fácil",
        difficultyMedium: "Médio",
        difficultyHard: "Difícil",
        exampleField: "Frase de exemplo (opcional)",
        exampleTranslationField: "Tradução da frase (opcional)",
        exampleToneLabel: "Tom",
        exampleToneNeutral: "Neutro",
        exampleToneFormal: "Formal",
        exampleToneInformal: "Informal",
        sourceManual: "Manual",
        sourceAi: "Gerado por IA",
        generateWithAi: "Gerar com IA",
        aiOptionsTitle: "Opções da IA",
        aiVariations: "Quantas variações?",
        aiIncludeTranslation: "Incluir tradução",
        aiGenerateButton: "Gerar exemplos",
        aiGeneratedTitle: "Sugestões da IA",
        aiUseExample: "Usar este exemplo",
        saveWordButton: "Salvar palavra",
        wordListTitle: "Suas palavras",
        emptyWords: "Nenhuma palavra adicionada ainda.",
        practiceTitle: "Prática Diária",
        practiceSubtitle: "Revise os exemplos pendentes em uma sessão focada.",
        practiceReady: "Sessão pronta",
        practiceReveal: "Revelar tradução",
        practiceHide: "Ocultar tradução",
        practiceListenWord: "Ouvir a palavra",
        practiceListenSentence: "Ouvir a frase",
        practiceKnown: "Eu sabia",
        practiceAlmost: "Quase",
        practiceNot: "Não sabia",
        practiceDoneTitle: "Tudo em dia",
        practiceDoneSubtitle: "Adicione mais palavras ou aguarde a próxima revisão.",
        practiceNextReview: "Próxima revisão",
        practiceSource: "Origem",
        practiceProgress: "Progresso da prática",
        settingsTitle: "Configurações",
        settingsSubtitle: "Ajuste a experiência ao seu ritmo.",
        settingsDailyGoal: "Meta diária (minutos)",
        settingsShowTranslations: "Mostrar traduções por padrão",
        settingsLocalData: "Todos os dados ficam armazenados localmente neste dispositivo.",
        formRequired: "Este campo é obrigatório."
    }
};
const getTranslations = (locale)=>translations[locale] ?? translations["en-US"];
}),
"[project]/store/useTranslations.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTranslations",
    ()=>useTranslations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppStoreProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/AppStoreProvider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useTranslations = ()=>{
    const { data } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppStoreProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppStoreContext"])();
    const dictionary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTranslations"])(data.settings.locale);
    const t = (key)=>dictionary[key] ?? key;
    return {
        t,
        locale: data.settings.locale,
        locales: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCALES"]
    };
};
}),
"[project]/components/LanguageSelect.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageSelect",
    ()=>LanguageSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppStoreProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/AppStoreProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useTranslations$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useTranslations.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const LanguageSelect = ({ compact })=>{
    const { data, setLocale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppStoreProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppStoreContext"])();
    const { t, locales } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useTranslations$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])();
    const fieldId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
        children: [
            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: t("languageLabel")
            }, void 0, false, {
                fileName: "[project]/components/LanguageSelect.tsx",
                lineNumber: 18,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                id: fieldId,
                className: `rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 ${compact ? "min-w-[120px]" : "min-w-[200px]"}`,
                value: data.settings.locale,
                onChange: (event)=>setLocale(event.target.value),
                children: locales.map((locale)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: locale,
                        children: locale
                    }, locale, false, {
                        fileName: "[project]/components/LanguageSelect.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/components/LanguageSelect.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[11px] font-normal uppercase tracking-[0.18em] text-slate-400",
                children: t("languageHelper")
            }, void 0, false, {
                fileName: "[project]/components/LanguageSelect.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/LanguageSelect.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/components/AppHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppHeader",
    ()=>AppHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useTranslations$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useTranslations.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSelect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LanguageSelect.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AppHeader = ()=>{
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useTranslations$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "flex flex-col gap-4 border-b border-slate-200/70 px-6 py-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs uppercase tracking-[0.2em] text-slate-500",
                        children: t("tagline")
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "text-2xl font-semibold text-slate-900",
                        href: "/",
                        children: t("appName")
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppHeader.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "hover:text-slate-900",
                        href: "/practice",
                        children: t("navPractice")
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "hover:text-slate-900",
                        href: "/words",
                        children: t("navWords")
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "hover:text-slate-900",
                        href: "/settings",
                        children: t("navSettings")
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSelect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LanguageSelect"], {
                        compact: true
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppHeader.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppHeader.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/settings/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSelect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LanguageSelect.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppStoreProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/AppStoreProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useTranslations$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useTranslations.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function SettingsPage() {
    const { data, setDailyGoalMinutes, setShowTranslationsByDefault } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppStoreProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppStoreContext"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useTranslations$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppHeader"], {}, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.3em] text-slate-500",
                                children: t("settingsSubtitle")
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 17,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-semibold text-slate-900",
                                children: t("settingsTitle")
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LanguageSelect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LanguageSelect"], {}, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-sm font-semibold text-slate-700",
                                children: [
                                    t("settingsDailyGoal"),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 5,
                                        max: 60,
                                        value: data.settings.dailyGoalMinutes,
                                        onChange: (event)=>{
                                            const next = Number(event.target.value);
                                            if (!Number.isNaN(next)) {
                                                setDailyGoalMinutes(next);
                                            }
                                        },
                                        className: "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 27,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-3 text-sm font-semibold text-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: data.settings.showTranslationsByDefault,
                                        onChange: (event)=>setShowTranslationsByDefault(event.target.checked)
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, this),
                                    t("settingsShowTranslations")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500",
                                children: t("settingsLocalData")
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/settings/page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_1f122faf._.js.map