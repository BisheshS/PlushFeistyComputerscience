// Source of truth: Flip/Features/You/Legal/LegalDocument.swift in the app repo.
// Text must match the in-app copy word for word. Do not paraphrase.
import { FLIP_SUPPORT_EMAIL } from './flip'

export type LegalDoc = {
  title: string
  lastUpdated: string
  intro: string
  sections: { heading: string; body: string[] }[]
}

export const flipPrivacy: LegalDoc = {
  title: "Privacy Policy",
  lastUpdated: "Last updated: 28 September 2026",
  intro: "Flip is built so your urges never leave your phone. We don't run servers, we don't have accounts, and we don't collect your data. Here's exactly what that means.",
  sections: [
    {
      heading: "WHAT WE COLLECT",
      body: [
        "Nothing. Flip has no sign-up, no analytics, no advertising, no tracking and no third-party code. The app makes no network requests of its own.",
      ],
    },
    {
      heading: "WHAT'S STORED ON YOUR IPHONE",
      body: [
        "To work, Flip saves the following on this device only: the habits you add and their cost, daily count and time settings; each urge you log (when it started, how strong it felt before and after, what set it off, which card you did, reps or time completed, and the outcome); your answers from setup (fitness level, where you usually are, goals, danger-zone times and triggers); your missions, XP and streak settings.",
        "This data sits in Flip's private storage on your iPhone. Flip's widgets read the same storage so they can show your stats. Nobody else, including us, can see it.",
        "If you back up your iPhone to iCloud or a computer, Apple includes app data like this in that backup, under your control and Apple's backup terms.",
      ],
    },
    {
      heading: "PURCHASES",
      body: [
        "Flip Pro is bought through Apple. Apple handles your payment details; we never see them. The app only receives a yes/no confirmation from Apple that your purchase is active, and checks it on your device.",
      ],
    },
    {
      heading: "PERMISSIONS FLIP MAY ASK FOR",
      body: [
        "Notifications — to remind you before your danger zone. Reminders are scheduled on your iPhone; nothing is sent from a server.",
        "Motion & Fitness — to count steps during walking challenges. Step counts are read on your device and only the total for that challenge is saved.",
        "Photos (add only) — to save a share card when you tap Save. Flip can't see your photo library.",
        "You can change any of these in the Settings app at any time.",
      ],
    },
    {
      heading: "SHARING",
      body: [
        "Flip only shares something when you tap Share. You choose the app and the people. Share cards contain the stats shown on the card; exported data files contain everything listed above.",
      ],
    },
    {
      heading: "CRASH REPORTS",
      body: [
        "If you've chosen to share analytics with app developers in your iPhone's Settings, Apple may send us anonymous crash reports. They don't include your Flip data. You can turn this off in Settings › Privacy & Security › Analytics & Improvements.",
      ],
    },
    {
      heading: "YOUR CONTROL",
      body: [
        "Export: You › Export my data gives you a complete copy as a JSON file.",
        "Delete: You › Delete all data permanently erases everything Flip has stored. Deleting the app does the same.",
      ],
    },
    {
      heading: "CHILDREN",
      body: [
        "Flip isn't directed at children under 13 and we don't knowingly collect anyone's data — including theirs.",
      ],
    },
    {
      heading: "CHANGES",
      body: [
        "If this policy changes, the new version will appear here with a new date. We'll never start collecting your data without asking first.",
      ],
    },
    {
      heading: "CONTACT",
      body: [
        `Questions? Email ${FLIP_SUPPORT_EMAIL}.`,
      ],
    },
  ],
}

export const flipTerms: LegalDoc = {
  title: "Terms of Use",
  lastUpdated: "Last updated: 28 September 2026",
  intro: "These terms cover your use of Flip. By using the app you agree to them. They sit alongside Apple's Standard Licensed Application End User License Agreement, which also applies.",
  sections: [
    {
      heading: "NOT MEDICAL ADVICE",
      body: [
        "Flip is a self-help and fitness tool. It is not a medical device and doesn't diagnose, treat or cure any condition, including addiction or dependence.",
        "Nothing in Flip is medical, psychological or financial advice.",
        "If you're trying to quit a substance such as nicotine or alcohol, talk to a doctor or pharmacist — some substances, especially alcohol, can be dangerous to stop suddenly. If you're in crisis or feel unsafe, contact your local emergency number.",
      ],
    },
    {
      heading: "EXERCISE SAFELY",
      body: [
        "Challenge cards include physical exercise, breathing exercises and cold water. Only do what's safe for you. Check with a doctor before starting if you have a heart, lung, joint or blood-pressure condition, are pregnant, or haven't exercised in a while.",
        "Stop straight away if you feel pain, dizziness, faintness or shortness of breath. Skip any card that doesn't suit where you are or how you feel — you can always reroll.",
      ],
    },
    {
      heading: "NUMBERS ARE ESTIMATES",
      body: [
        "Money kept, time reclaimed, projections and urge-drop figures are estimates calculated from what you enter and log. They're there to motivate you, not to be exact. Projections are labelled as projected.",
      ],
    },
    {
      heading: "FLIP PRO SUBSCRIPTIONS",
      body: [
        "Flip Pro is available as a monthly or yearly subscription, or a one-time lifetime purchase. Prices are shown in the app before you buy.",
        "Payment is charged to your Apple Account when you confirm. Subscriptions renew automatically unless you cancel at least 24 hours before the end of the current period; renewal is charged within 24 hours before the period ends.",
        "If you start a free trial, you'll be charged when it ends unless you cancel before then. Any unused part of a trial is forfeited when you buy a subscription.",
        "Manage or cancel any time in Settings › Apple Account › Subscriptions. Refunds are handled by Apple under its policies.",
      ],
    },
    {
      heading: "YOUR DATA",
      body: [
        "Your data stays on your device (see the Privacy Policy). Because we don't keep a copy, we can't recover it if you delete the app or your data. Use Export my data to keep a backup.",
      ],
    },
    {
      heading: "FAIR USE",
      body: [
        "Don't reverse-engineer, resell or misuse the app. The Flip name, design and content belong to the developer.",
      ],
    },
    {
      heading: "NO WARRANTY; LIMITATION OF LIABILITY",
      body: [
        "Flip is provided \"as is\". To the extent the law allows, we don't guarantee it will be error-free or produce any particular result, and we aren't liable for any injury, loss or damage arising from your use of the app or its challenges. Nothing here limits rights you have under consumer law that can't be excluded.",
      ],
    },
    {
      heading: "CHANGES",
      body: [
        "We may update these terms; the new version will appear here with a new date. Continuing to use Flip means you accept them.",
      ],
    },
    {
      heading: "CONTACT",
      body: [
        `Questions? Email ${FLIP_SUPPORT_EMAIL}.`,
      ],
    },
  ],
}
