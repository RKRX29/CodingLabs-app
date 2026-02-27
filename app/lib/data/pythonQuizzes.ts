export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export const pythonQuizzes: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: 'Python is mainly used to ____ to computers.',
      options: ['draw icons only', 'give instructions', 'repair hardware', 'design networks only'],
      correctIndex: 1,
      explanation: 'Correct. Python is a language used to give instructions to a computer.',
      difficulty: 'Easy'
    },
    {
      question: 'Which line correctly prints text in Python?',
      options: ['echo("Hello")', 'print("Hello")', 'show("Hello")', 'output("Hello")'],
      correctIndex: 1,
      explanation: 'Correct. print() is the standard way to show output on screen.',
      difficulty: 'Medium'
    },
    {
      question: 'Which option is NOT a common use of Python?',
      options: ['Data analysis', 'Automation scripts', 'Web development', 'Physical keyboard repair'],
      correctIndex: 3,
      explanation: 'Correct. Python can automate software tasks, not physically repair hardware.',
      difficulty: 'Hard'
    }
  ],
  2: [
    {
      question: 'A variable is best described as:',
      options: ['A fixed value forever', 'A named storage for data', 'A Python file type', 'A loop condition'],
      correctIndex: 1,
      explanation: 'Correct. Variables store data with a readable name.',
      difficulty: 'Easy'
    },
    {
      question: 'Which assignment is valid in Python?',
      options: ['score == 10', 'score := 10', 'score = 10', 'int score = 10'],
      correctIndex: 2,
      explanation: 'Correct. = assigns a value; == compares two values.',
      difficulty: 'Medium'
    },
    {
      question: 'Which statement is NOT correct?',
      options: ['Strings are written with quotes', 'Booleans are True/False', 'Python variable types never change', 'Integers store whole numbers'],
      correctIndex: 2,
      explanation: 'Correct. Python variables are dynamically typed and can hold different types over time.',
      difficulty: 'Hard'
    }
  ],
  3: [
    {
      question: 'By default, input() returns:',
      options: ['int', 'float', 'str', 'bool'],
      correctIndex: 2,
      explanation: 'Correct. input() returns text (string) unless you convert it.',
      difficulty: 'Easy'
    },
    {
      question: 'Which code converts user input age to an integer?',
      options: ['age = number(input())', 'age = int(input())', 'age = input(int)', 'age = str(input())'],
      correctIndex: 1,
      explanation: 'Correct. Wrap input() with int() to convert numeric text.',
      difficulty: 'Medium'
    },
    {
      question: 'Which output statement is the cleanest modern style?',
      options: ['print("Name:" + name)', 'print("Name:", name)', 'print(f"Name: {name}")', 'All are valid output styles'],
      correctIndex: 3,
      explanation: 'Correct. All work; f-strings are often most readable for formatting.',
      difficulty: 'Hard'
    }
  ],
  4: [
    {
      question: 'Which keyword checks another condition after if?',
      options: ['elseif', 'else if', 'elif', 'otherwise'],
      correctIndex: 2,
      explanation: 'Correct. Python uses elif.',
      difficulty: 'Easy'
    },
    {
      question: 'What runs when all if/elif conditions are false?',
      options: ['default', 'fallback', 'else', 'none'],
      correctIndex: 2,
      explanation: 'Correct. else handles the final fallback case.',
      difficulty: 'Medium'
    },
    {
      question: 'Which is NOT a valid Python comparison operator?',
      options: ['==', '!=', '<=', '=<'],
      correctIndex: 3,
      explanation: 'Correct. =< is invalid; <= is valid.',
      difficulty: 'Hard'
    }
  ],
  5: [
    {
      question: 'Which loop is commonly used with a known range?',
      options: ['while', 'for', 'repeat', 'loop'],
      correctIndex: 1,
      explanation: 'Correct. for is ideal when iterating a range or collection.',
      difficulty: 'Easy'
    },
    {
      question: 'What does range(3) produce in a for loop?',
      options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3 only'],
      correctIndex: 1,
      explanation: 'Correct. range(3) gives 0, 1, 2.',
      difficulty: 'Medium'
    },
    {
      question: 'Which statement about while loops is NOT correct?',
      options: ['Condition is checked before each iteration', 'They can run forever if condition never becomes false', 'They are required for all loops in Python', 'They are useful when stop condition is dynamic'],
      correctIndex: 2,
      explanation: 'Correct. Python supports both for and while loops.',
      difficulty: 'Hard'
    }
  ],
  6: [
    {
      question: 'Functions are mainly used to:',
      options: ['Store files', 'Reuse logic', 'Create loops only', 'Replace variables'],
      correctIndex: 1,
      explanation: 'Correct. Functions let you reuse and organize code.',
      difficulty: 'Easy'
    },
    {
      question: 'Which keyword returns a value from a function?',
      options: ['yield', 'result', 'return', 'break'],
      correctIndex: 2,
      explanation: 'Correct. return sends a value back to the caller.',
      difficulty: 'Medium'
    },
    {
      question: 'Which is NOT true about function parameters?',
      options: ['They receive input values', 'You can define defaults', 'They are always optional', 'They improve function flexibility'],
      correctIndex: 2,
      explanation: 'Correct. Parameters are not always optional unless default values are defined.',
      difficulty: 'Hard'
    }
  ],
  7: [
    {
      question: 'Which structure is mutable?',
      options: ['tuple', 'list', 'string', 'int'],
      correctIndex: 1,
      explanation: 'Correct. Lists can be changed after creation.',
      difficulty: 'Easy'
    },
    {
      question: 'Which code creates a tuple?',
      options: ['items = [1, 2, 3]', 'items = (1, 2, 3)', 'items = {1, 2, 3}', 'items = <1, 2, 3>'],
      correctIndex: 1,
      explanation: 'Correct. Parentheses are used for tuple literals.',
      difficulty: 'Medium'
    },
    {
      question: 'Which is NOT a correct statement?',
      options: ['Lists support append()', 'Tuples preserve order', 'Tuples can be changed with append()', 'Both can store mixed data types'],
      correctIndex: 2,
      explanation: 'Correct. Tuples are immutable and do not support append().',
      difficulty: 'Hard'
    }
  ],
  8: [
    {
      question: 'Which structure stores key-value pairs?',
      options: ['set', 'list', 'dictionary', 'tuple'],
      correctIndex: 2,
      explanation: 'Correct. Dictionaries map keys to values.',
      difficulty: 'Easy'
    },
    {
      question: 'What is a key property of sets?',
      options: ['Allow duplicate values', 'Store ordered indexes only', 'Keep unique values', 'Use key-value pairs'],
      correctIndex: 2,
      explanation: 'Correct. Sets automatically remove duplicates.',
      difficulty: 'Medium'
    },
    {
      question: 'Which option is NOT valid for dictionary access?',
      options: ['user["name"]', 'user.get("name")', 'user.name', '"name" in user'],
      correctIndex: 2,
      explanation: 'Correct. user.name is not standard dictionary key access.',
      difficulty: 'Hard'
    }
  ],
  9: [
    {
      question: 'Which method converts text to lowercase?',
      options: ['lower()', 'down()', 'small()', 'casefolded()'],
      correctIndex: 0,
      explanation: 'Correct. lower() returns lowercase text.',
      difficulty: 'Easy'
    },
    {
      question: 'Which option uses an f-string correctly?',
      options: ['f("Hi {name}")', '"Hi {name}"', 'f"Hi {name}"', 'formatf("Hi", name)'],
      correctIndex: 2,
      explanation: 'Correct. Prefix string with f to evaluate placeholders.',
      difficulty: 'Medium'
    },
    {
      question: 'Which is NOT true about strings in Python?',
      options: ['Strings are immutable', 'You can slice strings', 'You can change one character directly by index', 'len() gives string length'],
      correctIndex: 2,
      explanation: 'Correct. Strings are immutable, so direct index assignment is invalid.',
      difficulty: 'Hard'
    }
  ],
  10: [
    {
      question: 'Which block handles runtime errors?',
      options: ['try/except', 'if/else', 'for/break', 'def/return'],
      correctIndex: 0,
      explanation: 'Correct. try/except handles exceptions safely.',
      difficulty: 'Easy'
    },
    {
      question: 'What is the role of finally?',
      options: ['Runs only on success', 'Runs only on error', 'Runs whether error happens or not', 'Stops the program'],
      correctIndex: 2,
      explanation: 'Correct. finally is used for cleanup regardless of outcome.',
      difficulty: 'Medium'
    },
    {
      question: 'Which is NOT recommended in error handling?',
      options: ['Catch specific exceptions', 'Log error details', 'Use bare except everywhere', 'Validate input before risky operations'],
      correctIndex: 2,
      explanation: 'Correct. Bare except can hide real bugs and should be avoided.',
      difficulty: 'Hard'
    }
  ],
  11: [
    {
      question: 'Why use with open(...) as f?',
      options: ['It auto-closes the file', 'It encrypts files', 'It increases RAM', 'It skips permissions'],
      correctIndex: 0,
      explanation: 'Correct. with ensures files close safely even when errors happen.',
      difficulty: 'Easy'
    },
    {
      question: 'Which mode opens a file for appending text?',
      options: ['r', 'w', 'a', 'x'],
      correctIndex: 2,
      explanation: 'Correct. a appends content to the end of the file.',
      difficulty: 'Medium'
    },
    {
      question: 'Which statement is NOT correct about file modes?',
      options: ['r needs file to exist', 'w can overwrite existing content', 'a appends without deleting old content', 'x overwrites existing files safely'],
      correctIndex: 3,
      explanation: 'Correct. x creates a new file and fails if it already exists.',
      difficulty: 'Hard'
    }
  ]
}
