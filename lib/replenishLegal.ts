// Source of truth: Replenish/Features/Legal/LegalDocument.swift in the app repo (quitsmoke).
// Text must match the in-app copy word for word. Do not paraphrase.
// Check after every change: npm run build && npm run check:replenish-legal -- <path to quitsmoke repo>
import type { LegalDoc } from './flipLegal'
import { REPLENISH_SUPPORT_EMAIL } from './replenish'

export const replenishPrivacy: LegalDoc = {
  title: "Privacy Policy",
  lastUpdated: "Last updated: 13 November 2026",
  intro: "Your smoking data and your Health data stay on your iPhone. We run no servers of our own and there are no accounts. Replenish uses two outside services for anonymous numbers only: RevenueCat for purchases and TelemetryDeck for usage counts. This page says exactly what each one gets, and how to switch it off.",
  sections: [
    {
      heading: "WHAT WE COLLECT",
      body: [
        "Nothing that identifies you. There is no sign-up, no name, no email, no advertising and no tracking across other apps or websites. Replenish does not use the advertising identifier and does not ask to track you.",
        "Two things leave your iPhone, and both are anonymous: usage events (sent to TelemetryDeck) and purchase information (sent to RevenueCat). The next two sections list them in full.",
      ],
    },
    {
      heading: "ANONYMOUS USAGE EVENTS (TELEMETRYDECK)",
      body: [
        "TelemetryDeck is a privacy-focused analytics service. It helps us see where people stop in setup, whether the screens work, and which features get used, so we can fix problems.",
        "Each event is a short name and, at most, one fixed label. Examples: setup step viewed (the step name only), paywall shown (which button opened it), plan selected (yearly, monthly or lifetime), purchase succeeded or cancelled, restore tapped, a feature was used (logging a smoke, One more, SOS, Journey, a look change, a source opened), and problems (prices did not load, the 3D chest did not load, an error code).",
        "Events never include how many cigarettes you smoked, when, your quit date, your plan, your answers in setup, your heart rate or any Health data, your pack price or any money figure, or anything you type.",
        "Along with each event, TelemetryDeck receives the usual technical details: app version, iPhone model, iOS version, language, region, time zone, screen size, the time of the event, and a random ID made by scrambling an Apple identifier for this app on this iPhone (a salted hash, so it cannot be turned back into the original). The ID is not your name, your Apple Account or your advertising ID. It cannot be used to find you. As with any internet connection, TelemetryDeck's servers also see the connection itself, which includes the IP address. The app does not add the IP address to any event.",
      ],
    },
    {
      heading: "PURCHASES (APPLE AND REVENUECAT)",
      body: [
        "Replenish Pro is bought through Apple. Apple handles your payment details and we never see them. The app checks on your iPhone that your purchase is active.",
        "We use RevenueCat to see purchases and revenue. When you buy or restore Pro, the app tells RevenueCat about that purchase: the product, the price, the dates and Apple's purchase receipt. RevenueCat gives you a random anonymous ID. It receives no name, no email and no Health or smoking data. As with any internet connection, RevenueCat also sees your IP address, which it uses for things like your country.",
      ],
    },
    {
      heading: "TURN IT OFF",
      body: [
        "In You > Privacy, switch off Share anonymous usage. Replenish then sends no usage events. It also stops telling RevenueCat about your purchases and does not start RevenueCat the next time you open the app. If RevenueCat was already running in this session, it stops when you close and reopen the app.",
        "Your purchases still work with the switch off, because the app checks them with Apple on your iPhone. The switch is on by default and the choice stays on your iPhone.",
      ],
    },
    {
      heading: "WHAT IS STORED ON YOUR IPHONE",
      body: [
        "To work, Replenish saves this on your iPhone only: your answers from setup (cigarettes a day, years smoking, wake and bed times, your chosen look); each smoke you log (time, amount, the trigger you pick); each craving you finish with SOS (time, how it ended); your quit plan and the milestones you reached; your pack price and currency.",
        "If you turn on Apple Health, Replenish also keeps a small cache of daily numbers (resting heart rate, heart rate variability, average heart rate) so it can draw your charts.",
        "This data sits in the app's private storage. Nobody else can see it, including us. If you back up your iPhone to iCloud or a computer, Apple includes app data like this in that backup, under your control and Apple's backup terms.",
      ],
    },
    {
      heading: "APPLE HEALTH",
      body: [
        "Apple Health is optional and read-only. If you allow it, Replenish reads your resting heart rate, heart rate variability and heart rate. It shows your own numbers before and after your quit date, and it sets the resting speed of the 3D heart.",
        "Replenish never writes to Apple Health. Health data never leaves your iPhone: it is not sent to us, to TelemetryDeck, to RevenueCat or to anyone else, it is not used for advertising and it is not shared. You can turn it off in You, which also clears the cache. To remove access fully, use Settings > Health > Data Access.",
      ],
    },
    {
      heading: "WIDGETS AND LIVE ACTIVITY",
      body: [
        "Widgets and the Live Activity are drawn by small parts of the app. To work, they read a summary the app saves in a storage area shared only with Replenish on your iPhone: your recent smoke times, your wake and bed times, your quit date and your resting heart rate. Nothing leaves your phone.",
      ],
    },
    {
      heading: "PERMISSIONS REPLENISH MAY ASK FOR",
      body: [
        "Apple Health: to read the numbers above, only if you connect it.",
        "Notifications: for the optional bedtime summary. It is scheduled on your iPhone and nothing is sent from a server.",
        "You can change any of these in the Settings app at any time.",
      ],
    },
    {
      heading: "SHARING",
      body: [
        "Replenish shares something only when you tap Share. You choose the app and the people. A share card shows the figures printed on the card.",
      ],
    },
    {
      heading: "CRASH REPORTS",
      body: [
        "If you chose to share analytics with app developers in your iPhone's Settings, Apple may send us anonymous crash reports. They do not include your Replenish data. You can turn this off in Settings > Privacy & Security > Analytics & Improvements.",
      ],
    },
    {
      heading: "YOUR CONTROL",
      body: [
        "Switch off: You > Privacy > Share anonymous usage.",
        `Delete: You > Delete all data erases everything Replenish has stored on this iPhone. Deleting the app does the same. The anonymous usage and purchase records that were already sent carry no name or email. To ask us to delete them, email ${REPLENISH_SUPPORT_EMAIL} and tell us when you installed the app.`,
      ],
    },
    {
      heading: "CHILDREN",
      body: [
        "Replenish is for adults who smoke. It is not directed at children, and we do not knowingly collect anyone's data, including theirs.",
      ],
    },
    {
      heading: "CHANGES",
      body: [
        "If this policy changes, the new version appears here with a new date. We will never start collecting your data without asking first.",
      ],
    },
    {
      heading: "CONTACT",
      body: [
        `Questions? Email ${REPLENISH_SUPPORT_EMAIL}.`,
      ],
    },
  ],
}

export const replenishTerms: LegalDoc = {
  title: "Terms of Use",
  lastUpdated: "Last updated: 9 October 2026",
  intro: "These terms cover your use of Replenish. By using the app you agree to them. They sit alongside Apple's Standard Licensed Application End User License Agreement, which also applies.",
  sections: [
    {
      heading: "NOT MEDICAL ADVICE",
      body: [
        "Replenish is a self-help tool. It is not a medical device. It does not diagnose, treat or cure any condition, including nicotine dependence.",
        "Nothing in Replenish is medical or financial advice. The 3D lungs and heart are illustrations, not scans of your body.",
        "If you want help to quit, talk to a doctor, pharmacist or your local stop-smoking service. If you feel unwell, or you are in crisis, contact your local emergency number.",
      ],
    },
    {
      heading: "NUMBERS ARE ESTIMATES",
      body: [
        "Every figure in Replenish is an estimate built from what you enter and log and from published averages, such as how long smoke stays in the air you breathe and how the body recovers after quitting. Real people differ. Figures are labelled estimate or about, and each has a source one tap away.",
        "Money and cigarettes not smoked are calculated from your own pack price and daily habit. They are not a promise of savings.",
        "Replenish never shows a personal risk percentage and never says that a number of cigarettes causes a set amount of damage.",
      ],
    },
    {
      heading: "REPLENISH PRO",
      body: [
        "Replenish Pro unlocks the lungs a year ahead, full history, Apple Health trends, share cards, widgets and the Live Activity. Logging, SOS, your quit plan and milestones stay free.",
        "Yearly and monthly plans are auto-renewing subscriptions. A yearly plan may start with a free trial. Payment is charged to your Apple Account at confirmation of purchase, or at the end of the trial. The subscription renews automatically unless you cancel at least 24 hours before the end of the current period. Your account is charged for renewal within 24 hours before the end of the period.",
        "You can manage or cancel a subscription any time in Settings > your name > Subscriptions. Deleting the app does not cancel it. The price and period are shown before you buy.",
        "Lifetime is a single payment with no renewal. Restore purchases in You or on the Pro screen brings your purchase back on a new iPhone with the same Apple Account.",
        "Refunds are handled by Apple under its own terms.",
      ],
    },
    {
      heading: "USING THE APP",
      body: [
        "Use Replenish for your own personal use. Do not copy, resell or reverse-engineer it. Replenish and its artwork belong to puchka.",
        "Haptics and smoke effects are part of the app. Reduce Motion in Settings turns the movement down.",
      ],
    },
    {
      heading: "LIABILITY",
      body: [
        "Replenish is provided as it is. To the extent the law allows, puchka is not liable for any loss from using the app or from relying on its estimates. Nothing in these terms limits rights you have by law that cannot be limited.",
      ],
    },
    {
      heading: "CHANGES",
      body: [
        "If these terms change, the new version appears here with a new date. Continuing to use Replenish after a change means you accept it.",
      ],
    },
    {
      heading: "CONTACT",
      body: [
        `Questions? Email ${REPLENISH_SUPPORT_EMAIL}.`,
      ],
    },
  ],
}
