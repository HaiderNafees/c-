/* ============================================================
   Syllabus — 31 C++ Topics
   Edit this file to change/add topic content.
   Each topic: { id, title, module, description }
   Modules: "Basics" | "Core C++" | "OOP" | "Advanced" | "STL"
   ============================================================ */

export const MODULES = [
  { id: 'basics', name: 'Module 1 — Basics' },
  { id: 'core', name: 'Module 2 — Core C++' },
  { id: 'oop', name: 'Module 3 — OOP' },
  { id: 'advanced', name: 'Module 4 — Advanced' },
  { id: 'stl', name: 'Module 5 — STL' },
]

export const SYLLABUS = [
  // ---------- Module 1 — Basics ----------
  {
    id: 'intro',
    title: 'Introduction & Getting Started',
    module: 'Basics',
    description:
      'What is C++, how to install a compiler, and write your first "Hello World" program.',
  },
  {
    id: 'syntax',
    title: 'Syntax & Structure',
    module: 'Basics',
    description:
      'Understanding the basic structure of a C++ program, the main() function, and semicolons.',
  },
  {
    id: 'output-comments',
    title: 'Output & Comments',
    module: 'Basics',
    description:
      'Using cout to print output and adding single-line and multi-line comments.',
  },
  {
    id: 'variables',
    title: 'Variables & User Input',
    module: 'Basics',
    description:
      'Declaring variables, assigning values, and reading input from the user with cin.',
  },
  {
    id: 'data-types',
    title: 'Data Types',
    module: 'Basics',
    description:
      'int, float, double, char, bool, string and the size of each data type.',
  },
  {
    id: 'operators',
    title: 'Operators',
    module: 'Basics',
    description:
      'Arithmetic, assignment, comparison, logical, and bitwise operators.',
  },
  {
    id: 'strings-math',
    title: 'Strings & Math',
    module: 'Basics',
    description:
      'Working with the string class and common math functions from <cmath>.',
  },
  {
    id: 'conditions',
    title: 'Booleans & If-Else Conditions',
    module: 'Basics',
    description:
      'Boolean values, if, else if, else statements and the ternary operator.',
  },
  {
    id: 'switch',
    title: 'Switch Statement',
    module: 'Basics',
    description:
      'Using switch-case to select one of many code blocks to execute.',
  },
  {
    id: 'loops',
    title: 'For & While Loops',
    module: 'Basics',
    description:
      'Repeating code with for, while, and do-while loops.',
  },
  {
    id: 'break-continue',
    title: 'Break & Continue',
    module: 'Basics',
    description:
      'Breaking out of loops early and skipping iterations with continue.',
  },

  // ---------- Module 2 — Core C++ ----------
  {
    id: 'arrays',
    title: 'Arrays',
    module: 'Core C++',
    description:
      'Storing multiple values in a single variable, multi-dimensional arrays.',
  },
  {
    id: 'structs-enums',
    title: 'Structures & Enums',
    module: 'Core C++',
    description:
      'Grouping related data with struct and creating named constants with enum.',
  },
  {
    id: 'pointers',
    title: 'References & Pointers',
    module: 'Core C++',
    description:
      'Creating references, pointers, memory addresses, and dereferencing.',
  },
  {
    id: 'functions',
    title: 'Functions (Basics + Parameters)',
    module: 'Core C++',
    description:
      'Defining and calling functions, parameters, return values, and default parameters.',
  },
  {
    id: 'overloading-scope',
    title: 'Function Overloading & Scope',
    module: 'Core C++',
    description:
      'Multiple functions with the same name, variable scope, and global vs local variables.',
  },
  {
    id: 'recursion',
    title: 'Recursion',
    module: 'Core C++',
    description:
      'Functions that call themselves, base cases, and recursive problem solving.',
  },

  // ---------- Module 3 — OOP ----------
  {
    id: 'classes-objects',
    title: 'Classes & Objects',
    module: 'OOP',
    description:
      'Defining classes and creating objects, attributes and methods.',
  },
  {
    id: 'class-methods',
    title: 'Class Methods',
    module: 'OOP',
    description:
      'Methods defined inside or outside the class definition.',
  },
  {
    id: 'constructors',
    title: 'Constructors',
    module: 'OOP',
    description:
      'Special methods called when objects are created, parameterized constructors.',
  },
  {
    id: 'access-specifiers',
    title: 'Access Specifiers',
    module: 'OOP',
    description:
      'public, private, and protected access control for class members.',
  },
  {
    id: 'encapsulation',
    title: 'Encapsulation',
    module: 'OOP',
    description:
      'Hiding sensitive data using private members and getter/setter methods.',
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    module: 'OOP',
    description:
      'Reusing attributes and methods from one class in another, base and derived classes.',
  },
  {
    id: 'polymorphism',
    title: 'Polymorphism',
    module: 'OOP',
    description:
      'Using the same action in different ways, function overriding and virtual functions.',
  },

  // ---------- Module 4 — Advanced ----------
  {
    id: 'file-handling',
    title: 'File Handling',
    module: 'Advanced',
    description:
      'Reading from and writing to files using ifstream, ofstream, and fstream.',
  },
  {
    id: 'exceptions',
    title: 'Exception Handling',
    module: 'Advanced',
    description:
      'try, catch, throw blocks to handle runtime errors gracefully.',
  },
  {
    id: 'date-time',
    title: 'Date & Time',
    module: 'Advanced',
    description:
      'Working with dates and times using <ctime> and the chrono library.',
  },

  // ---------- Module 5 — STL ----------
  {
    id: 'vectors',
    title: 'Vectors',
    module: 'STL',
    description:
      'Dynamic arrays that can grow and shrink, common vector operations.',
  },
  {
    id: 'lists-stacks-queues',
    title: 'List / Stack / Queue / Deque',
    module: 'STL',
    description:
      'Other STL sequence containers and their use cases.',
  },
  {
    id: 'sets-maps',
    title: 'Sets & Maps',
    module: 'STL',
    description:
      'Associative containers: set, multiset, map, and multimap.',
  },
  {
    id: 'iterators-algorithms',
    title: 'Iterators & Algorithms',
    module: 'STL',
    description:
      'Traversing containers with iterators and using STL algorithms like sort, find.',
  },
]

/* ---------- Helper lookups ---------- */

/** Get a topic by its id. */
export function getTopicById(id) {
  return SYLLABUS.find((t) => t.id === id) || null
}

/** Get all unique module names in display order. */
export function getModuleNames() {
  return MODULES.map((m) => m.name.split('— ')[1] || m.name)
}

/** Get all topics belonging to a given module name. */
export function getTopicsByModule(moduleName) {
  return SYLLABUS.filter((t) => t.module === moduleName)
}

/** Total number of topics in the syllabus. */
export const TOTAL_TOPICS = SYLLABUS.length
