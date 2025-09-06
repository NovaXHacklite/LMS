export const subjectsByGrade = {  6: ["Mathematics", "Science", "English"],  7: ["Mathematics", "Science", "English"],  8: ["Mathematics", "Science", "English"],  9: ["Mathematics", "Science", "English"],  10: ["Mathematics", "Science", "English", "ICT"],  11: ["Mathematics", "Science", "English", "ICT"],};export const lessonsData = {  Mathematics: [    {      id: 1,      title: "Algebra Basics",      description:        "Master variables, expressions, and linear equations with step-by-step videos and practice.",      videos: [        {          id: 1,          title: "Introduction to Variables",          url: "https://www.youtube.com/embed/5ST8LXH9l54",          description: "What variables and constants mean in algebra.",        },        {          id: 2,          title: "Understanding Expressions",          url: "https://www.youtube.com/embed/wN1hZFRf4kQ",          description: "How expressions are formed and simplified.",        },        {          id: 3,          title: "Solving Simple Linear Equations",
          url: "https://www.youtube.com/embed/VZIBa4z2tNw",
          description: "Step-by-step solving of one-step and two-step equations.",
        },
        {
          id: 4,
          title: "Word Problems in Algebra",
          url: "https://www.youtube.com/embed/rqQzYMGkY0s",
          description: "Translate word problems into equations and solve.",
        },
        {
          id: 5,
          title: "Practice & Tips",
          url: "https://www.youtube.com/embed/oc2v7ZyUPz8",
          description: "Common mistakes and quick strategies.",
        },
      ],
    },
    {
      id: 2,
      title: "Geometry Fundamentals",
      description:
        "Explore shapes, angles, area, and perimeter with interactive examples and visual explanations.",
      videos: [
        {
          id: 6,
          title: "Types of Angles",
          url: "https://www.youtube.com/embed/3bIc4yGk0aE",
          description: "Learn about acute, obtuse, and right angles.",
        },
        {
          id: 7,
          title: "Calculating Area & Perimeter",
          url: "https://www.youtube.com/embed/1xT4l6y8b9g",
          description: "Find area and perimeter of rectangles and triangles.",
        },
        {
          id: 8,
          title: "Properties of Triangles",
          url: "https://www.youtube.com/embed/2gQ9g1QwK9g",
          description: "Explore different types of triangles and their properties.",
        },
        {
          id: 9,
          title: "Circle Basics",
          url: "https://www.youtube.com/embed/4Fz2zGQH6yE",
          description: "Understand radius, diameter, and circumference.",
        },
      ],
    },
    {
      id: 3,
      title: "Fractions & Decimals",
      description:
        "Learn how to add, subtract, multiply, and divide fractions and decimals.",
      videos: [
        {
          id: 10,
          title: "Introduction to Fractions",
          url: "https://www.youtube.com/embed/2zVv3l7QwGg",
          description: "What are fractions and how are they used?",
        },
        {
          id: 11,
          title: "Adding & Subtracting Fractions",
          url: "https://www.youtube.com/embed/3zQ9g1QwK9g",
          description: "Step-by-step guide to adding and subtracting fractions.",
        },
        {
          id: 12,
          title: "Multiplying & Dividing Fractions",
          url: "https://www.youtube.com/embed/4gQ9g1QwK9g",
          description: "Learn how to multiply and divide fractions.",
        },
        {
          id: 13,
          title: "Decimals: Basics & Operations",
          url: "https://www.youtube.com/embed/5gQ9g1QwK9g",
          description: "Introduction to decimals and basic operations.",
        },
      ],
    },
    {
      id: 4,
      title: "Data Handling & Probability",
      description:
        "Understand data representation, mean, median, mode, and basic probability.",
      videos: [
        {
          id: 14,
          title: "Reading Bar Graphs",
          url: "https://www.youtube.com/embed/6gQ9g1QwK9g",
          description: "How to interpret and create bar graphs.",
        },
        {
          id: 15,
          title: "Mean, Median, and Mode",
          url: "https://www.youtube.com/embed/7gQ9g1QwK9g",
          description: "Learn how to calculate mean, median, and mode.",
        },
        {
          id: 16,
          title: "Introduction to Probability",
          url: "https://www.youtube.com/embed/8gQ9g1QwK9g",
          description: "Basic probability concepts and examples.",
        },
      ],
    },
    {
      id: 5,
      title: "Ratio & Proportion",
      description:
        "Master the concepts of ratio, proportion, and their applications in real life.",
      videos: [
        {
          id: 17,
          title: "Understanding Ratios",
          url: "https://www.youtube.com/embed/9gQ9g1QwK9g",
          description: "What is a ratio and how is it used?",
        },
        {
          id: 18,
          title: "Solving Proportion Problems",
          url: "https://www.youtube.com/embed/10gQ9g1QwK9g",
          description: "How to solve problems involving proportions.",
        },
        {
          id: 19,
          title: "Applications of Ratio & Proportion",
          url: "https://www.youtube.com/embed/11gQ9g1QwK9g",
          description: "Real-life examples and practice.",
        },
      ],
    },
    {
      id: 6,
      title: "Integers & Number Systems",
      description:
        "Explore integers, whole numbers, and their operations.",
      videos: [
        {
          id: 20,
          title: "Introduction to Integers",
          url: "https://www.youtube.com/embed/12gQ9g1QwK9g",
          description: "What are integers and how do we use them?",
        },
        {
          id: 21,
          title: "Operations with Integers",
          url: "https://www.youtube.com/embed/13gQ9g1QwK9g",
          description: "Addition, subtraction, multiplication, and division of integers.",
        },
        {
          id: 22,
          title: "Number Systems Overview",
          url: "https://www.youtube.com/embed/14gQ9g1QwK9g",
          description: "Understanding different number systems.",
        },
      ],
    },
  ],
};

export const preQuizQuestions = [
  { q: "Solve 2x + 3 = 7", options: ["x = 1", "x = 2", "x = 3"], answer: "x = 2" },
  { q: "What is 5x if x = 3?", options: ["8", "10", "15"], answer: "15" },
  { q: "Simplify: 2(a + 3)", options: ["2a + 3", "2a + 6", "a + 6"], answer: "2a + 6" },
  { q: "Solve: x + 4 = 9", options: ["x = 5", "x = 6", "x = 4"], answer: "x = 5" },
  { q: "Find y if 3y = 12", options: ["2", "3", "4"], answer: "4" },
  { q: "Expand: (x + 2)(x + 3)", options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 2x + 3"], answer: "x² + 5x + 6" },
  { q: "What is 7x − 2 when x = 2?", options: ["10", "12", "14"], answer: "12" },
  { q: "Factorize: x² + 5x + 6", options: ["(x + 2)(x + 3)", "(x + 6)(x − 1)", "(x + 5)(x + 1)"], answer: "(x + 2)(x + 3)" },
  { q: "If 2x = 14, x = ?", options: ["5", "6", "7"], answer: "7" },
  { q: "Simplify: 4x + 3x", options: ["4x²", "7x", "12x"], answer: "7x" },
];

export const finalTestQuestions = [
  { q: "Solve: 3x + 6 = 21", options: ["x = 5", "x = 7", "x = 3"], answer: "x = 5" },
  { q: "Simplify: 5(x − 2)", options: ["5x − 2", "5x − 10", "x − 10"], answer: "5x − 10" },
  { q: "If x = 4, evaluate 2x²", options: ["8", "16", "32"], answer: "32" },
  { q: "Factorize: x² − 9", options: ["(x − 3)(x + 3)", "(x − 9)(x + 1)", "(x − 1)(x + 9)"], answer: "(x − 3)(x + 3)" },
  { q: "Solve: x/3 = 6", options: ["x = 18", "x = 9", "x = 3"], answer: "x = 18" },
];