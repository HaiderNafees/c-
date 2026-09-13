/* ============================================================
   Exercises — 3 per lecture (Easy / Medium / Exam)
   Format:
   {
     "topic-id": [
       { level: "easy"|"medium"|"exam", task: "...", solution: "..." },
       ...
     ]
   }
   Add more topics by copying the structure below.
   Solutions are code snippets shown in the collapsible accordion.
   ============================================================ */

export const EXERCISES = {
  // ---------- Module 1 — Basics ----------
  intro: [
    {
      level: 'easy',
      task: 'Write a C++ program that prints "Hello, C++!" to the screen.',
      solution: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
    },
    {
      level: 'medium',
      task: 'Write a program that prints your name and age on separate lines.',
      solution: `#include <iostream>
using namespace std;

int main() {
    cout << "Name: Alex" << endl;
    cout << "Age: 25" << endl;
    return 0;
}`,
    },
    {
      level: 'exam',
      task: 'Write a program that prints the numbers 1 to 5, each on a new line, WITHOUT using loops.',
      solution: `#include <iostream>
using namespace std;

int main() {
    cout << 1 << endl;
    cout << 2 << endl;
    cout << 3 << endl;
    cout << 4 << endl;
    cout << 5 << endl;
    return 0;
}`,
    },
  ],

  syntax: [
    {
      level: 'easy',
      task: 'Write the basic structure of a C++ program with a main() function that does nothing.',
      solution: `#include <iostream>
using namespace std;

int main() {
    return 0;
}`,
    },
    {
      level: 'medium',
      task: 'Write a program with a comment explaining what the program does, then print "Syntax learned".',
      solution: `#include <iostream>
using namespace std;

// This program prints a message about learning syntax
int main() {
    cout << "Syntax learned" << endl;
    return 0;
}`,
    },
    {
      level: 'exam',
      task: 'Write a program that prints the following pattern using cout statements (no loops):\n*\n**\n***',
      solution: `#include <iostream>
using namespace std;

int main() {
    cout << "*" << endl;
    cout << "**" << endl;
    cout << "***" << endl;
    return 0;
}`,
    },
  ],

  // Add more topics here following the same pattern:
  // 'topic-id': [
  //   { level: 'easy', task: '...', solution: '...' },
  //   { level: 'medium', task: '...', solution: '...' },
  //   { level: 'exam', task: '...', solution: '...' },
  // ],
}

/** Get exercises for a topic (returns empty array if none defined). */
export function getExercises(topicId) {
  return EXERCISES[topicId] || []
}
