export const personalityQuestions = [
  // Extraversion vs Introversion (E/I)
  {
    text: "You're planning a weekend. Do you prefer:",
    options: [
      { text: "Going out with friends", dimension: "E", weight: 1 },
      { text: "Having time alone to recharge", dimension: "I", weight: 1 }
    ]
  },
  {
    text: "At a party, you tend to:",
    options: [
      { text: "Talk to as many people as you can", dimension: "E", weight: 1 },
      { text: "Stick with a small group or one-on-one chats", dimension: "I", weight: 1 }
    ]
  },
  {
    text: "When making plans, you:",
    options: [
      { text: "Like to make them quickly and share them with others", dimension: "E", weight: 1 },
      { text: "Prefer to think about them alone first", dimension: "I", weight: 1 }
    ]
  },

  // Sensing vs Intuition (S/N)
  {
    text: "When tackling a problem, you:",
    options: [
      { text: "Look for practical solutions based on facts", dimension: "S", weight: 1 },
      { text: "Explore imaginative or theoretical ideas", dimension: "N", weight: 1 }
    ]
  },
  {
    text: "When reading a book, you:",
    options: [
      { text: "Focus on the concrete details and facts", dimension: "S", weight: 1 },
      { text: "Imagine what could happen beyond the story", dimension: "N", weight: 1 }
    ]
  },
  {
    text: "When making decisions, you:",
    options: [
      { text: "Rely on past experiences and proven methods", dimension: "S", weight: 1 },
      { text: "Consider future possibilities and new approaches", dimension: "N", weight: 1 }
    ]
  },

  // Thinking vs Feeling (T/F)
  {
    text: "When making decisions, you rely on:",
    options: [
      { text: "Objective logic", dimension: "T", weight: 1 },
      { text: "Personal values and feelings", dimension: "F", weight: 1 }
    ]
  },
  {
    text: "When someone asks your opinion, you tend to:",
    options: [
      { text: "Be direct and honest", dimension: "T", weight: 1 },
      { text: "Be considerate of their feelings", dimension: "F", weight: 1 }
    ]
  },
  {
    text: "When evaluating a new idea, you:",
    options: [
      { text: "Analyze its practicality and logic", dimension: "T", weight: 1 },
      { text: "Consider how it will affect people", dimension: "F", weight: 1 }
    ]
  },

  // Judging vs Perceiving (J/P)
  {
    text: "Your schedule is usually:",
    options: [
      { text: "Well-organized and planned", dimension: "J", weight: 1 },
      { text: "Flexible and spontaneous", dimension: "P", weight: 1 }
    ]
  },
  {
    text: "When working on a project, you:",
    options: [
      { text: "Like to complete it as soon as possible", dimension: "J", weight: 1 },
      { text: "Prefer to keep your options open", dimension: "P", weight: 1 }
    ]
  },
  {
    text: "Your workspace is typically:",
    options: [
      { text: "Organized and tidy", dimension: "J", weight: 1 },
      { text: "Flexible and adaptable", dimension: "P", weight: 1 }
    ]
  }
];
