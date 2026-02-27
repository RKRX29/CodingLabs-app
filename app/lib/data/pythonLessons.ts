export const pythonLessons = [
  {
    courseId: 'python',
    lessonNumber: 1,
    title: 'Getting Started with Python',
    description: 'What is Python, why it is useful, and how your first program works.',
    content:
      "## What is Python?\nPython is a **beginner-friendly programming language** used to give instructions to computers.\n\n## Why People Use Python\n- Clean syntax that is easy to read\n- Used in **web development**, **automation**, **data science**, and **AI**\n- Huge ecosystem of libraries\n\n## Your First Program\nThe classic first output in Python is:\n**print('Hello, world!')**\n\n## Important Idea\nCode is simply a list of instructions. Python runs those instructions from top to bottom.",
    codeExample: "print('Hello, world!')",
    exercise: "Write a program that prints: Welcome to CodingLabs",
    expectedOutput: 'Welcome to CodingLabs'
  },
  {
    courseId: 'python',
    lessonNumber: 2,
    title: 'More About Python',
    description: 'Learn how to store values in variables and work with common data types.',
    content:
      "## Variables\nA **variable** is a named container that stores data.\nExample: **score = 10**\n\n## Core Data Types\n- **int**: whole numbers (10, -3)\n- **float**: decimal numbers (3.14)\n- **str**: text ('Python')\n- **bool**: True or False\n\n## Dynamic Typing\nPython is **dynamically typed**, so a variable can hold different types over time.\nExample: value = 10, then value = 'ten'\n\n## Important Distinction\n- **=** assigns a value\n- **==** compares two values",
    codeExample: "name = 'Rahul'\nage = 20\nis_student = True\nprint(name, age, is_student)",
    exercise: "Create variables city='Delhi', temperature=32, and is_raining=False. Print them in one line.",
    expectedOutput: 'Delhi 32 False'
  },
  {
    courseId: 'python',
    lessonNumber: 3,
    title: 'Input and Output',
    description: 'Take input from the user and display formatted output.',
    content:
      "## Output with print()\nUse **print()** to display values on the screen.\n\n## Input with input()\nUse **input()** to take text from the user.\nImportant: input() returns a **string** by default.\n\n## Type Conversion\nConvert user input when needed:\n- int(input()) for whole numbers\n- float(input()) for decimal values\n\n## Formatted Output\nUse **f-strings** for clean output formatting.\nExample: f'Hello, {name}'",
    codeExample: "name = input('Enter your name: ')\nprint(f'Welcome, {name}!')",
    exercise: "Take age as input, convert it to int, and print: Next year you will be <age+1>",
    expectedOutput: 'Next year you will be 21'
  },
  {
    courseId: 'python',
    lessonNumber: 4,
    title: 'Conditions (if, elif, else)',
    description: 'Run different code blocks based on conditions.',
    content:
      "## Decision Making\nConditions let programs choose different paths.\n\n## if Statement\nUse **if** to run code when a condition is true.\n\n## elif and else\n- **elif** checks another condition\n- **else** runs when all previous conditions are false\n\n## Comparison Operators\nCommon operators: **==, !=, >, <, >=, <=**\n\n## Important Tip\nIndentation is mandatory in Python. Incorrect indentation causes errors.",
    codeExample: "marks = 78\nif marks >= 90:\n    print('A')\nelif marks >= 75:\n    print('B')\nelse:\n    print('C')",
    exercise: "Set number=7. Print 'Even' if it is even, otherwise print 'Odd'.",
    expectedOutput: 'Odd'
  },
  {
    courseId: 'python',
    lessonNumber: 5,
    title: 'Loops (for and while)',
    description: 'Repeat tasks efficiently using loops.',
    content:
      "## Why Loops Matter\nLoops repeat actions without writing duplicate code.\n\n## for Loop\nUse **for** when iterating over a sequence or range.\nExample: for i in range(3) gives 0, 1, 2\n\n## while Loop\nUse **while** when repeating until a condition changes.\n\n## Loop Control\n- **break** exits the loop early\n- **continue** skips current iteration\n\n## Important Risk\nA while loop can become an **infinite loop** if condition never becomes false.",
    codeExample: "for i in range(1, 4):\n    print(i)",
    exercise: "Use a for loop with range to print numbers 1 to 3 on separate lines.",
    expectedOutput: '1\n2\n3'
  },
  {
    courseId: 'python',
    lessonNumber: 6,
    title: 'Functions',
    description: 'Group reusable logic into functions with parameters and return values.',
    content:
      "## What is a Function?\nA **function** is a reusable block of code.\n\n## Defining a Function\nUse **def** keyword followed by function name and parentheses.\n\n## Parameters and Arguments\n- **parameters** are variables in function definition\n- **arguments** are actual values passed to the function\n\n## return Value\nUse **return** to send a result back to the caller.\n\n## Why Functions Help\nThey reduce repetition, improve readability, and make testing easier.",
    codeExample: "def add(a, b):\n    return a + b\n\nprint(add(2, 3))",
    exercise: "Create a function square(n) that returns n*n. Call it with 4 and print result.",
    expectedOutput: '16'
  },
  {
    courseId: 'python',
    lessonNumber: 7,
    title: 'Lists and Tuples',
    description: 'Store multiple values, access items, and understand mutable vs immutable sequences.',
    content:
      "## Lists\nA **list** stores multiple values and is **mutable** (changeable).\nExample: nums = [1, 2, 3]\n\n## Tuples\nA **tuple** also stores multiple values but is **immutable** (cannot be changed).\nExample: point = (10, 20)\n\n## Indexing\nBoth lists and tuples use zero-based indexing.\nFirst element is index 0.\n\n## Common List Operations\n- append() to add item\n- remove() to remove item\n- len() to get size",
    codeExample: "fruits = ['apple', 'banana']\nfruits.append('mango')\nprint(fruits)",
    exercise: "Create list colors=['red','blue']; append 'green'; print list.",
    expectedOutput: "['red', 'blue', 'green']"
  },
  {
    courseId: 'python',
    lessonNumber: 8,
    title: 'Dictionaries and Sets',
    description: 'Work with key-value mappings and unique collections.',
    content:
      "## Dictionaries\nA **dictionary** stores data as key-value pairs.\nExample: user = {'name': 'Rahul', 'age': 20}\n\n## Accessing Values\n- user['name']\n- user.get('name')\n\n## Sets\nA **set** stores unique values only. Duplicates are removed automatically.\n\n## Useful When\n- Dictionary: fast lookup by key\n- Set: uniqueness checks and membership testing",
    codeExample: "user = {'name': 'Asha', 'age': 21}\nprint(user['name'])",
    exercise: "Create a dictionary student with keys name and marks; print value of marks.",
    expectedOutput: '95'
  },
  {
    courseId: 'python',
    lessonNumber: 9,
    title: 'String Operations',
    description: 'Format, transform, and analyze text effectively.',
    content:
      "## Strings\nA **string** is text data in quotes.\n\n## Common String Methods\n- lower()\n- upper()\n- strip()\n- replace()\n\n## Slicing\nUse slicing to extract parts of text: text[start:end]\n\n## Modern Formatting\nUse **f-strings** for readable output formatting.\n\n## Important Rule\nStrings are **immutable**, so methods return new strings instead of changing original directly.",
    codeExample: "name = ' codingLabs '\nclean = name.strip().title()\nprint(clean)",
    exercise: "Store text='python'. Print it in uppercase.",
    expectedOutput: 'PYTHON'
  },
  {
    courseId: 'python',
    lessonNumber: 10,
    title: 'Error Handling (try/except)',
    description: 'Prevent crashes and handle runtime errors gracefully.',
    content:
      "## Why Errors Happen\nPrograms can fail due to invalid input or unexpected states.\n\n## try and except\nPut risky code in **try** and error handling in **except**.\n\n## finally Block\nUse **finally** for cleanup that should always run.\n\n## Best Practices\n- Catch specific exceptions when possible\n- Show friendly messages\n- Avoid bare except for everything",
    codeExample: "try:\n    num = int('abc')\nexcept ValueError:\n    print('Invalid number')",
    exercise: "Write code that tries int('x') and prints 'Invalid input' in except block.",
    expectedOutput: 'Invalid input'
  },
  {
    courseId: 'python',
    lessonNumber: 11,
    title: 'File Handling',
    description: 'Read and write files using Python safely.',
    content:
      "## Opening Files\nUse **open()** with modes like r, w, a, x.\n\n## Safe File Handling\nUse **with open(...) as f** so Python auto-closes the file.\n\n## Reading and Writing\n- read() reads file content\n- write() writes text\n\n## File Modes\n- r: read existing file\n- w: write (overwrites)\n- a: append\n- x: create new file\n\n## Important Practice\nAlways handle file operations carefully to avoid accidental data loss.",
    codeExample: "with open('demo.txt', 'w') as f:\n    f.write('Hello file')\nprint('Done')",
    exercise: "Write code that opens a file in append mode and writes 'New line'. Then print Done.",
    expectedOutput: 'Done'
  }
]
