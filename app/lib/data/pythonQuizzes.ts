export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const pythonQuizzes: Record<number, QuizQuestion> = {
  1: {
    question: 'Python is mainly used to ____ to computers.',
    options: ['paint screens', 'give instructions', 'repair hardware', 'format disks'],
    correctIndex: 1,
    explanation: 'Python is a programming language used to give instructions to computers.'
  },
  2: {
    question: 'Which of these is a valid boolean value in Python?',
    options: ['true', 'FALSE', 'True', 'bool'],
    correctIndex: 2,
    explanation: 'Boolean literals are True and False (capitalized).'
  },
  3: {
    question: 'What does input() return by default?',
    options: ['Integer', 'Float', 'String', 'Boolean'],
    correctIndex: 2,
    explanation: 'input() always returns a string unless you convert it.'
  },
  4: {
    question: 'Which keyword handles an additional condition after if?',
    options: ['else if', 'elseif', 'elif', 'otherwise'],
    correctIndex: 2,
    explanation: 'Python uses elif for extra conditions.'
  },
  5: {
    question: 'Which loop is best when number of iterations is known?',
    options: ['while', 'for', 'do-while', 'repeat'],
    correctIndex: 1,
    explanation: 'for loops are typically used for known ranges/collections.'
  },
  6: {
    question: 'Which keyword returns a value from a function?',
    options: ['give', 'yield', 'return', 'result'],
    correctIndex: 2,
    explanation: 'return sends a value back to the caller.'
  },
  7: {
    question: 'Which statement about lists and tuples is correct?',
    options: [
      'Both are immutable',
      'List is mutable, tuple is immutable',
      'Tuple is mutable, list is immutable',
      'Both are key-value pairs'
    ],
    correctIndex: 1,
    explanation: 'Lists can be changed after creation, tuples cannot.'
  },
  8: {
    question: 'Which data structure stores key-value pairs?',
    options: ['Set', 'List', 'Dictionary', 'Tuple'],
    correctIndex: 2,
    explanation: 'Dictionaries map keys to values.'
  },
  9: {
    question: 'Which is the best modern way to format variables inside a string?',
    options: ['concat()', 'f-strings', 'printf()', 'join()'],
    correctIndex: 1,
    explanation: 'f-strings are clean, readable, and commonly used in modern Python.'
  },
  10: {
    question: 'Which block is used to catch errors in Python?',
    options: ['catch', 'except', 'error', 'finally'],
    correctIndex: 1,
    explanation: 'Python uses except after try to handle exceptions.'
  },
  11: {
    question: 'Why is "with open(...)" preferred for file handling?',
    options: [
      'It reads faster always',
      'It can only write files',
      'It auto-closes the file safely',
      'It avoids file permissions'
    ],
    correctIndex: 2,
    explanation: 'The with-context manager ensures file cleanup even if errors happen.'
  }
}
