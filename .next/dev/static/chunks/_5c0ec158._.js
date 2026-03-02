(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const isBrowser = ("TURBOPACK compile-time value", "object") !== "undefined";
const loadAppData = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppData;
    try {
        const parsed = JSON.parse(raw);
        return {
            words: parsed.words ?? [],
            settings: {
                ...defaultSettings,
                ...parsed.settings ?? {}
            }
        };
    } catch  {
        return defaultAppData;
    }
};
const saveAppData = (data)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
const updateSettings = (data, nextSettings)=>({
        ...data,
        settings: nextSettings
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/spacedRepetition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/useAppStore.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppStore",
    ()=>useAppStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$spacedRepetition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/spacedRepetition.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
        review: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$spacedRepetition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInitialReview"])(now)
    };
};
const useAppStore = ()=>{
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useAppStore.useState": ()=>("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadAppData"])()
    }["useAppStore.useState"]);
    const [ready] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useAppStore.useState": ()=>("TURBOPACK compile-time value", "object") !== "undefined"
    }["useAppStore.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAppStore.useEffect": ()=>{
            if (!ready) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAppData"])(data);
        }
    }["useAppStore.useEffect"], [
        data,
        ready
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAppStore.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const handler = {
                "useAppStore.useEffect.handler": (event)=>{
                    if (event.key === "opencode.learnEnglish.v1") {
                        setData((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadAppData"])());
                    }
                }
            }["useAppStore.useEffect.handler"];
            window.addEventListener("storage", handler);
            return ({
                "useAppStore.useEffect": ()=>window.removeEventListener("storage", handler)
            })["useAppStore.useEffect"];
        }
    }["useAppStore.useEffect"], []);
    const setSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[setSettings]": (next)=>{
            setData({
                "useAppStore.useCallback[setSettings]": (prev)=>({
                        ...prev,
                        settings: next
                    })
            }["useAppStore.useCallback[setSettings]"]);
        }
    }["useAppStore.useCallback[setSettings]"], []);
    const setLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[setLocale]": (locale)=>{
            setSettings({
                ...data.settings,
                locale
            });
        }
    }["useAppStore.useCallback[setLocale]"], [
        data.settings,
        setSettings
    ]);
    const setDailyGoalMinutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[setDailyGoalMinutes]": (minutes)=>{
            setSettings({
                ...data.settings,
                dailyGoalMinutes: minutes
            });
        }
    }["useAppStore.useCallback[setDailyGoalMinutes]"], [
        data.settings,
        setSettings
    ]);
    const setShowTranslationsByDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[setShowTranslationsByDefault]": (value)=>{
            setSettings({
                ...data.settings,
                showTranslationsByDefault: value
            });
        }
    }["useAppStore.useCallback[setShowTranslationsByDefault]"], [
        data.settings,
        setSettings
    ]);
    const addWord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[addWord]": (wordInput, exampleInput)=>{
            const term = wordInput.term.trim();
            if (!term) return;
            setData({
                "useAppStore.useCallback[addWord]": (prev)=>{
                    const existingIndex = prev.words.findIndex({
                        "useAppStore.useCallback[addWord].existingIndex": (item)=>item.term.toLowerCase() === term.toLowerCase()
                    }["useAppStore.useCallback[addWord].existingIndex"]);
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
                }
            }["useAppStore.useCallback[addWord]"]);
        }
    }["useAppStore.useCallback[addWord]"], []);
    const addExampleToWord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[addExampleToWord]": (wordId, input)=>{
            setData({
                "useAppStore.useCallback[addExampleToWord]": (prev)=>({
                        ...prev,
                        words: prev.words.map({
                            "useAppStore.useCallback[addExampleToWord]": (word)=>word.id === wordId ? {
                                    ...word,
                                    examples: [
                                        ...word.examples,
                                        buildExample(input)
                                    ]
                                } : word
                        }["useAppStore.useCallback[addExampleToWord]"])
                    })
            }["useAppStore.useCallback[addExampleToWord]"]);
        }
    }["useAppStore.useCallback[addExampleToWord]"], []);
    const updateExampleReview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppStore.useCallback[updateExampleReview]": (wordId, exampleId, rating)=>{
            setData({
                "useAppStore.useCallback[updateExampleReview]": (prev)=>({
                        ...prev,
                        words: prev.words.map({
                            "useAppStore.useCallback[updateExampleReview]": (word)=>{
                                if (word.id !== wordId) return word;
                                return {
                                    ...word,
                                    examples: word.examples.map({
                                        "useAppStore.useCallback[updateExampleReview]": (example)=>example.id === exampleId ? {
                                                ...example,
                                                review: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$spacedRepetition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateReviewState"])(example.review, rating, new Date())
                                            } : example
                                    }["useAppStore.useCallback[updateExampleReview]"])
                                };
                            }
                        }["useAppStore.useCallback[updateExampleReview]"])
                    })
            }["useAppStore.useCallback[updateExampleReview]"]);
        }
    }["useAppStore.useCallback[updateExampleReview]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAppStore.useMemo[value]": ()=>({
                data,
                ready,
                setLocale,
                setDailyGoalMinutes,
                setShowTranslationsByDefault,
                addWord,
                addExampleToWord,
                updateExampleReview,
                reset: ({
                    "useAppStore.useMemo[value]": ()=>setData({
                            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultAppData"],
                            settings: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultSettings"]
                        })
                })["useAppStore.useMemo[value]"]
            })
    }["useAppStore.useMemo[value]"], [
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
_s(useAppStore, "I0HlqpwjisIn8QGNK+gDk0tabuo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/AppStoreProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppStoreProvider",
    ()=>AppStoreProvider,
    "useAppStoreContext",
    ()=>useAppStoreContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useAppStore.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AppStoreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const AppStoreProvider = ({ children })=>{
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppStoreContext.Provider, {
        value: store,
        children: children
    }, void 0, false, {
        fileName: "[project]/store/AppStoreProvider.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AppStoreProvider, "nWb08WFK8AukMi9dgr69802LgEw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = AppStoreProvider;
const useAppStoreContext = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppStoreContext);
    if (!context) {
        throw new Error("useAppStoreContext must be used within AppStoreProvider");
    }
    return context;
};
_s1(useAppStoreContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AppStoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ServiceWorkerRegister.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceWorkerRegister",
    ()=>ServiceWorkerRegister
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const ServiceWorkerRegister = ()=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServiceWorkerRegister.useEffect": ()=>{
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("/sw.js").catch({
                    "ServiceWorkerRegister.useEffect": ()=>undefined
                }["ServiceWorkerRegister.useEffect"]);
            }
        }
    }["ServiceWorkerRegister.useEffect"], []);
    return null;
};
_s(ServiceWorkerRegister, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ServiceWorkerRegister;
var _c;
__turbopack_context__.k.register(_c, "ServiceWorkerRegister");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_5c0ec158._.js.map