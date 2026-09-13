/* ============================================================
   Quizzes — 5 questions per lecture
   Types: Multiple Choice, Predict Output, Find the Error
   Format:
   {
     "topic-id": [
       {
         question: "...",
         options: ["A", "B", "C", "D"],
         correctIndex: 1,
         explanation: "..."
       },
       ...
     ]
   }
   Add more topics by copying the structure below.
   ============================================================ */

export const QUIZZES = {
  // ---------- Module 1 — Basics ----------
  intro: [
    {
      question: 'Which header file is needed to use cout?',
      options: ['<stdio.h>', '<iostream>', '<conio.h>', '<string.h>'],
      correctIndex: 1,
      explanation:
        '<iostream> provides input/output stream objects like cout and cin.',
    },
    {
      question: 'Predict the output: cout << "Hello" << " " << "World";',
      options: ['Hello World', 'HelloWorld', 'Hello World World', 'Error'],
      correctIndex: 0,
      explanation:
        'The << operator concatenates output. "Hello" + space + "World" = "Hello World".',
    },
    {
      question: 'What is the entry point of a C++ program?',
      options: ['start()', 'begin()', 'main()', 'run()'],
      correctIndex: 2,
      explanation:
        'Every C++ program must have a main() function where execution begins.',
    },
    {
      question: 'Find the error: int main() { cout << "Hi" }',
      options: [
        'Missing #include <iostream>',
        'Missing semicolon after cout',
        'Both A and B',
        'No error',
      ],
      correctIndex: 2,
      explanation:
        'cout requires <iostream>, and every statement must end with a semicolon.',
    },
    {
      question: 'What does "using namespace std;" allow you to do?',
      options: [
        'Define variables',
        'Use std objects without the std:: prefix',
        'Include libraries',
        'Create namespaces',
      ],
      correctIndex: 1,
      explanation:
        'It brings the std namespace into scope so you can write cout instead of std::cout.',
    },
  ],

  syntax: [
    {
      question: 'Every C++ statement must end with what character?',
      options: ['. (period)', '; (semicolon)', ', (comma)', ': (colon)'],
      correctIndex: 1,
      explanation: 'Semicolons mark the end of statements in C++.',
    },
    {
      question: 'Which of these is a valid single-line comment?',
      options: [
        '/* comment */',
        '<!-- comment -->',
        '// comment',
        '# comment',
      ],
      correctIndex: 2,
      explanation:
        '// starts a single-line comment. /* */ is for multi-line comments.',
    },
    {
      question: 'Predict the output: cout << 10 + 5;',
      options: ['10+5', '15', '10 5', 'Error'],
      correctIndex: 1,
      explanation:
        'The expression 10 + 5 is evaluated to 15 before being printed.',
    },
    {
      question: 'Find the error: int main( ) { cout << "test" << endl; return 0 }',
      options: [
        'Missing semicolon after return 0',
        'Wrong use of endl',
        'Missing braces',
        'No error',
      ],
      correctIndex: 0,
      explanation: 'return 0 needs a semicolon: return 0;',
    },
    {
      question: 'What is the purpose of the return 0; statement in main()?',
      options: [
        'Prints 0 to the screen',
        'Ends the program with a success status',
        'Returns nothing',
        'Restarts the program',
      ],
      correctIndex: 1,
      explanation:
        'return 0 signals to the operating system that the program finished successfully.',
    },
  ],

  // Add more topics here following the same pattern:
  // 'topic-id': [
  //   { question: '...', options: ['A','B','C','D'], correctIndex: 0, explanation: '...' },
  //   ... (5 questions total)
  // ],
}

/** Get quiz questions for a topic (returns empty array if none defined). */
export function getQuiz(topicId) {
  return QUIZZES[topicId] || []
}
