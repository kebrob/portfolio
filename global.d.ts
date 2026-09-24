import type messages from "./messages/en.json";
import type { routing } from "./i18n/routing";

/*
 * Types next-intl against the English messages, so t("some.key") is checked at
 * compile time and a missing key in a component is a type error, not a blank.
 * English is the source of truth: every other locale file mirrors its keys.
 */
declare module "next-intl" {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: typeof messages;
    }
}
