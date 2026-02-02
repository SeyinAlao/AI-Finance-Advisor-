import type { FormQuestions } from "../types";

export const FormQuestionsData: FormQuestions[] = [
  {
    id: 1,
    text: "To personalize your plan, how old are you?",
    name: "age",
    options: [{ label: "Enter your age (e.g., 25)", value: "" }],
  },

  {
    id: 2,
    text: "What's your primary goal for this investment?",
    name: "investmentPurpose",
    options: [
      { label: "Grow my capital over time (Capital Growth)", value: "Capital Growth" },
      { label: "Generate income to supplement my lifestyle (Income generation)", value: "Income Generation" },
      { label: "Protect my savings and minimize risk (Capital Preservation)", value: "Capital Preservation" },
      { label: "Retirement", value: "Retirement" },
    ],
  },

  {
    id: 3,
    text: "How long do you plan to hold on to this investment? (in years)",
    name: "investmentHorizon",
    options: [{ label: "Enter number of years (e.g., 5)", value: "" }],
  },

  {
    id: 4,
    text: "How comfortable are you with investing?",
    name: "investmentKnowledge",
    options: [
      { label: '"Investing newbie" (Beginner)', value: "Beginner" },
      { label: '"I\'ve dabbled a bit" (Intermediate)', value: "Intermediate" },
      { label: '"Seasoned investor" (Advanced)', value: "Advanced" },
    ],
  },

  {
    id: 5,
    text: "Imagine you're on a rollercoaster. How will you categorize your risk appetite?",
    name: "riskTolerance",
    options: [
      { label: "Thrill-seeker (High risk)", value: "High" },
      { label: "Moderate ride, please (Moderate risk)", value: "Moderate" },
      { label: "Safety first (Low risk)", value: "Low" },
    ],
  },

  {
    id: 6,
    text: "What currency will you be investing in?",
    name: "currency",
    options: [
      { label: "£ Pound (GBP)", value: "GBP" },
      { label: "$ Dollar (USD)", value: "USD" },
      { label: "₦ Naira (NGN)", value: "NGN" },
      { label: "€ Euro (EUR)", value: "EUR" },
      { label: "₵ Cedi (GHS)", value: "GHS" },
    ],
  },

  {
    id: 7,
    text: "Great. How much represent your initial capital?",
    name: "amount",
    options: [{ label: "Enter amount", value: "" }],
  },

  {
    id: 8,
    text: "Lastly, where are you located? This helps with local regulations.",
    name: "location",
    options: [{ label: "Enter your country/city", value: "" }],
  },
];