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
  },
  {
    courseId: 'python',
    lessonNumber: 7,
    title: 'Lists and Tuples',
    description: 'Store multiple values, access items, and understand mutable vs immutable sequences.',
    content:
      'Lists are ordered and mutable. Tuples are ordered and immutable.\n\nUse indexing to access values and slicing to get parts.',
    codeExample:
      'fruits = ["apple", "banana", "cherry"]\nprint(fruits[1])\nfruits.append("mango")\nprint(fruits)\n\npoint = (10, 20)\nprint(point[0])',
    exercise: 'Create a list of 3 numbers and print their sum.',
    expectedOutput: 'Sum of all list numbers'
  },
  {
    courseId: 'python',
    lessonNumber: 8,
    title: 'Dictionaries and Sets',
    description: 'Work with key-value mappings and unique collections.',
    content:
      'Dictionaries store data as key-value pairs. Sets store unique values only.\n\nBoth are very useful for fast lookups.',
    codeExample:
      'student = {"name": "Rahul", "age": 21}\nprint(student["name"])\nstudent["city"] = "Delhi"\n\nnums = {1, 2, 2, 3}\nprint(nums)',
    exercise: 'Create a dictionary for a book with title and price, then print the title.',
    expectedOutput: 'Book title printed'
  },
  {
    courseId: 'python',
    lessonNumber: 9,
    title: 'String Operations',
    description: 'Format, transform, and analyze text effectively.',
    content:
      'Strings support many methods like lower(), upper(), split(), replace(), and strip().\n\nf-strings are the recommended way to format text.',
    codeExample:
      'name = "codinglabs"\nprint(name.upper())\nmsg = f"Welcome, {name.title()}!"\nprint(msg)\nprint("python,js,java".split(","))',
    exercise: 'Take a name and print: Hello, <Name>! using an f-string.',
    expectedOutput: 'Hello, Rahul!'
  },
  {
    courseId: 'python',
    lessonNumber: 10,
    title: 'Error Handling (try/except)',
    description: 'Prevent crashes and handle runtime errors gracefully.',
    content:
      'Use try/except to catch errors and continue execution.\n\nYou can handle specific exception types like ValueError or ZeroDivisionError.',
    codeExample:
      'try:\n    num = int("abc")\nexcept ValueError:\n    print("Invalid number input")',
    exercise: 'Write code that divides two numbers and handles division by zero.',
    expectedOutput: 'Friendly error message for zero division'
  },
  {
    courseId: 'python',
    lessonNumber: 11,
    title: 'File Handling',
    description: 'Read and write files using Python safely.',
    content:
      'Use open() with modes like "r", "w", and "a".\n\nPrefer "with open(...)" so files close automatically.',
    codeExample:
      'with open("notes.txt", "w") as f:\n    f.write("Hello from CodingLabs")\n\nwith open("notes.txt", "r") as f:\n    print(f.read())',
    exercise: 'Write "Python Practice" to a file and then read it back.',
    expectedOutput: 'Python Practice'
  }
]
