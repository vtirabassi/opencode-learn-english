module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultAppData",
    ()=>defaultAppData,
    "defaultSettings",
    ()=>defaultSettings,
    "loadAppData",
    ()=>loadAppData,
    "saveAppData",
    ()=>saveAppData,
    "updateSettings",
    ()=>updateSettings
]);
const STORAGE_KEY = "opencode.learnEnglish.v1";
const defaultSettings = {
    locale: "en-US",
    dailyGoalMinutes: 15,
    showTranslationsByDefault: false
};
const defaultAppData = {
    words: [],
    settings: defaultSettings
};
const isBrowser = ("TURBOPACK compile-time value", "undefined") !== "undefined";
const loadAppData = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return defaultAppData;
    //TURBOPACK unreachable
    ;
    const raw = undefined;
};
const saveAppData = (data)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const updateSettings = (data, nextSettings)=>({
        ...data,
        settings: nextSettings
    });
}),
"[project]/lib/spacedRepetition.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInitialReview",
    ()=>createInitialReview,
    "getDuePracticeItems",
    ()=>getDuePracticeItems,
    "updateReviewState",
    ()=>updateReviewState
]);
const STAGES_IN_DAYS = [
    1,
    3,
    7,
    14,
    30
];
const addDays = (date, days)=>{
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};
const createInitialReview = (now)=>({
        stage: 0,
        lastReviewedAt: undefined,
        nextReviewAt: now.toISOString(),
        ease: 2.2,
        streak: 0
    });
const updateReviewState = (state, rating, now)=>{
    if (rating === "known") {
        const nextStage = Math.min(state.stage + 1, STAGES_IN_DAYS.length - 1);
        return {
            ...state,
            stage: nextStage,
            lastReviewedAt: now.toISOString(),
            nextReviewAt: addDays(now, STAGES_IN_DAYS[nextStage]).toISOString(),
            ease: Math.min(state.ease + 0.08, 2.8),
            streak: state.streak + 1
        };
    }
    if (rating === "almost") {
        const nextStage = Math.max(state.stage - 1, 0);
        return {
            ...state,
            stage: nextStage,
            lastReviewedAt: now.toISOString(),
            nextReviewAt: addDays(now, STAGES_IN_DAYS[nextStage]).toISOString(),
            ease: Math.max(state.ease - 0.08, 1.4),
            streak: 0
        };
    }
    return {
        ...state,
        stage: 0,
        lastReviewedAt: now.toISOString(),
        nextReviewAt: addDays(now, STAGES_IN_DAYS[0]).toISOString(),
        ease: Math.max(state.ease - 0.2, 1.2),
        streak: 0
    };
};
const getDuePracticeItems = (words, limit = 12, now = new Date())=>{
    const due = words.flatMap((word)=>word.examples.filter((example)=>new Date(example.review.nextReviewAt) <= now).map((example)=>({
                wordId: word.id,
                wordTerm: word.term,
                wordTranslation: word.translation,
                example
            })));
    const upcoming = words.flatMap((word)=>word.examples.map((example)=>({
                wordId: word.id,
                wordTerm: word.term,
                wordTranslation: word.translation,
                example
            })));
    const sortedUpcoming = upcoming.sort((a, b)=>new Date(a.example.review.nextReviewAt).getTime() - new Date(b.example.review.nextReviewAt).getTime());
    const pool = due.length > 0 ? due : sortedUpcoming;
    return pool.slice(0, limit);
};
}),
"[project]/store/useAppStore.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppStore",
    ()=>useAppStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$spacedRepetition$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/spacedRepetition.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const createId = ()=>typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
const buildExample = (input)=>{
    const now = new Date();
    return {
        id: createId(),
        sentence: input.sentence.trim(),
        translation: input.translation?.trim() || undefined,
        tone: input.tone,
        source: input.source,
        review: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$spacedRepetition$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitialReview"])(now)
    };
};
const useAppStore = ()=>{
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultAppData"] : "TURBOPACK unreachable");
    const [ready] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>("TURBOPACK compile-time value", "undefined") !== "undefined");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!ready) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveAppData"])(data);
    }, [
        data,
        ready
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const handler = undefined;
    }, []);
    const setSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((next)=>{
        setData((prev)=>({
                ...prev,
                settings: next
            }));
    }, []);
    const setLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((locale)=>{
        setSettings({
            ...data.settings,
            locale
        });
    }, [
        data.settings,
        setSettings
    ]);
    const setDailyGoalMinutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((minutes)=>{
        setSettings({
            ...data.settings,
            dailyGoalMinutes: minutes
        });
    }, [
        data.settings,
        setSettings
    ]);
    const setShowTranslationsByDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((value)=>{
        setSettings({
            ...data.settings,
            showTranslationsByDefault: value
        });
    }, [
        data.settings,
        setSettings
    ]);
    const addWord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((wordInput, exampleInput)=>{
        const term = wordInput.term.trim();
        if (!term) return;
        setData((prev)=>{
            const existingIndex = prev.words.findIndex((item)=>item.term.toLowerCase() === term.toLowerCase());
            const example = exampleInput ? buildExample(exampleInput) : undefined;
            if (existingIndex >= 0) {
                const updated = [
                    ...prev.words
                ];
                const existing = updated[existingIndex];
                updated[existingIndex] = {
                    ...existing,
                    translation: wordInput.translation || existing.translation,
                    partOfSpeech: wordInput.partOfSpeech || existing.partOfSpeech,
                    difficulty: wordInput.difficulty || existing.difficulty,
                    examples: example ? [
                        ...existing.examples,
                        example
                    ] : existing.examples
                };
                return {
                    ...prev,
                    words: updated
                };
            }
            const newWord = {
                id: createId(),
                term,
                translation: wordInput.translation?.trim() || undefined,
                partOfSpeech: wordInput.partOfSpeech?.trim() || undefined,
                difficulty: wordInput.difficulty?.trim() || undefined,
                createdAt: new Date().toISOString(),
                examples: example ? [
                    example
                ] : []
            };
            return {
                ...prev,
                words: [
                    newWord,
                    ...prev.words
                ]
            };
        });
    }, []);
    const addExampleToWord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((wordId, input)=>{
        setData((prev)=>({
                ...prev,
                words: prev.words.map((word)=>word.id === wordId ? {
                        ...word,
                        examples: [
                            ...word.examples,
                            buildExample(input)
                        ]
                    } : word)
            }));
    }, []);
    const updateExampleReview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((wordId, exampleId, rating)=>{
        setData((prev)=>({
                ...prev,
                words: prev.words.map((word)=>{
                    if (word.id !== wordId) return word;
                    return {
                        ...word,
                        examples: word.examples.map((example)=>example.id === exampleId ? {
                                ...example,
                                review: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$spacedRepetition$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateReviewState"])(example.review, rating, new Date())
                            } : example)
                    };
                })
            }));
    }, []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            data,
            ready,
            setLocale,
            setDailyGoalMinutes,
            setShowTranslationsByDefault,
            addWord,
            addExampleToWord,
            updateExampleReview,
            reset: ()=>setData({
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultAppData"],
                    settings: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultSettings"]
                })
        }), [
        data,
        ready,
        setLocale,
        setDailyGoalMinutes,
        setShowTranslationsByDefault,
        addWord,
        addExampleToWord,
        updateExampleReview
    ]);
    return value;
};
}),
"[project]/store/AppStoreProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppStoreProvider",
    ()=>AppStoreProvider,
    "useAppStoreContext",
    ()=>useAppStoreContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useAppStore.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const AppStoreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const AppStoreProvider = ({ children })=>{
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppStoreContext.Provider, {
        value: store,
        children: children
    }, void 0, false, {
        fileName: "[project]/store/AppStoreProvider.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const useAppStoreContext = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AppStoreContext);
    if (!context) {
        throw new Error("useAppStoreContext must be used within AppStoreProvider");
    }
    return context;
};
}),
"[project]/components/ServiceWorkerRegister.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceWorkerRegister",
    ()=>ServiceWorkerRegister
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const ServiceWorkerRegister = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(()=>undefined);
        }
    }, []);
    return null;
};
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__712a152c._.js.map