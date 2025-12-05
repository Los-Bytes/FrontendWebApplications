import {createI18n} from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, es},
    missing: (locale, key) => {
        console.warn(`[i18n] Missing translation: ${key} in ${locale}`);
    }
})

export default i18n;