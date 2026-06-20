export type Sentiment = "positive" | "negative" | "neutral";

export function analyzeSentiment(text: string): Sentiment {
  const positiveWords = [
    "good",
    "great",
    "awesome",
    "excellent",
    "happy",
    "excited",
    "love",
    "thanks",
    "thank you",
    "better",
    "improve",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "sad",
    "angry",
    "frustrated",
    "hate",
    "worse",
    "fail",
    "hard",
    "difficult",
    "sucks",
  ];

  const lowerText = text.toLowerCase();

  let score = 0;
  for (const word of positiveWords) {
    if (lowerText.includes(word)) score++;
  }
  for (const word of negativeWords) {
    if (lowerText.includes(word)) score--;
  }

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}
