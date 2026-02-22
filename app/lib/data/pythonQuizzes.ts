export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const pythonQuizzes: Record<number, QuizQuestion> = {
  1: {
    question: 'Which function is used to print text in Python?',
    options: ['echo()', 'print()', 'show()', 'write()'],
    correctIndex: 1,
    explanation: 'Python uses print() to display output.'
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
  }
}
