export const pythonLessons = [
  {
    courseId: 'python',
    lessonNumber: 1,
    title: 'Getting Started with Python',
    description: 'Install Python, run your first program, and understand how Python executes code.',
    content:
      "Python is a beginner-friendly programming language used for web development, automation, data science, and AI.\n\nYour first Python program:\nprint('Hello, world!')",
    codeExample: "print('Hello, world!')",
    exercise: "Write a program that prints: Welcome to CodingLabs",
    expectedOutput: 'Welcome to CodingLabs'
  },
  {
    courseId: 'python',
    lessonNumber: 2,
    title: 'Variables and Data Types',
    description: 'Learn how to store values in variables and work with common data types.',
    content:
      'Python supports numbers, strings, booleans, lists, and more.\n\nExamples:\nname = "Rahul"\nage = 21\nis_student = True',
    codeExample: 'name = "Rahul"\nage = 21\nis_student = True\nprint(name, age, is_student)',
    exercise: 'Create variables city, temperature, and is_raining, then print them.',
    expectedOutput: 'Your values printed in one line'
  },
  {
    courseId: 'python',
    lessonNumber: 3,
    title: 'Input and Output',
    description: 'Take input from the user and display formatted output.',
    content:
      'Use input() to read text from the user. Convert numeric input using int() or float().',
    codeExample: 'name = input("Enter your name: ")\nprint("Hello,", name)',
    exercise: 'Ask for user age and print: You are <age> years old.',
    expectedOutput: 'You are 18 years old'
  },
  {
    courseId: 'python',
    lessonNumber: 4,
    title: 'Conditions (if, elif, else)',
    description: 'Run different code blocks based on conditions.',
    content:
      'Conditional statements help make decisions.\n\nif score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelse:\n    print("C")',
    codeExample:
      'num = 7\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
    exercise: 'Check whether a number is positive, negative, or zero.',
    expectedOutput: 'Positive'
  },
  {
    courseId: 'python',
    lessonNumber: 5,
    title: 'Loops (for and while)',
    description: 'Repeat tasks efficiently using loops.',
    content:
      'for loops are great for known ranges; while loops run while a condition is true.',
    codeExample: 'for i in range(1, 6):\n    print(i)',
    exercise: 'Print numbers from 10 to 1 using a while loop.',
    expectedOutput: '10 9 8 7 6 5 4 3 2 1'
  },
  {
    courseId: 'python',
    lessonNumber: 6,
    title: 'Functions',
    description: 'Group reusable logic into functions with parameters and return values.',
    content:
      'Functions help you write cleaner and reusable code.\n\nUse def to define a function.',
    codeExample: 'def add(a, b):\n    return a + b\n\nprint(add(3, 4))',
    exercise: 'Write a function square(n) that returns n*n.',
    expectedOutput: 'square(5) => 25'
  }
]
