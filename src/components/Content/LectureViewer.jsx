import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { todayISO } from '../../hooks/useProgress'
import CodeBlock from './CodeBlock'
import ExerciseList from './ExerciseList'
import Quiz from './Quiz'

/* ============================================================
   LectureViewer
   Displays a single topic's content:
     1. Title + Module badge
     2. Lecture notes
     3. Code example (CodeBlock with copy + syntax highlight)
     4. Exercises (3 levels with collapsible solutions)
     5. Topic Quiz (5 questions + score)
     6. Mark Complete button (or "Completed on [date]")
     7. Reference footer

   Props: topic (object from syllabus.js)
   ============================================================ */

export default function LectureViewer({ topic }) {
  const { progress, updateProgress } = useAuth()
  const { showToast } = useToast()

  const completed = progress?.lecturesCompleted ?? []
  const isDone = completed.includes(topic.id)

  // Look up completion date from progress (stored alongside, if available).
  // For now we just show today if just completed; otherwise show the record.
  const completedOn = progress?.completedDates?.[topic.id] || todayISO()

  const handleMarkComplete = () => {
    if (isDone) return
    updateProgress((prev) => ({
      lecturesCompleted: [...prev.lecturesCompleted, topic.id],
      totalPoints: prev.totalPoints + 10,
      completedDates: {
        ...prev.completedDates,
        [topic.id]: todayISO(),
      },
    }))
    showToast('Lecture marked complete (+10 pts)', 'success')
  }

  return (
    <article className="surface-card p-6 md:p-8">
      {/* Header */}
      <header className="mb-6">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{
            background:
              'color-mix(in srgb, var(--color-accent) 15%, transparent)',
            color: 'var(--color-accent)',
          }}
        >
          {topic.module}
        </span>
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text-heading)' }}
        >
          {topic.title}
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
          {topic.description}
        </p>
      </header>

      {/* Lecture Notes */}
      <section className="mb-6">
        <h2
          className="text-lg font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Lecture Notes
        </h2>
        <div
          className="p-5 rounded-xl space-y-3"
          style={{
            background: 'var(--surface-secondary)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <p style={{ color: 'var(--text-body)' }}>
            This section covers <strong>{topic.title}</strong>. By the end of
            this topic you will understand the core concepts and be able to
            apply them in your own C++ programs.
          </p>
          <ul
            className="list-disc pl-5 space-y-1.5"
            style={{ color: 'var(--text-body)' }}
          >
            <li>Key concepts and terminology for {topic.title.toLowerCase()}</li>
            <li>Step-by-step explanation with examples</li>
            <li>Common pitfalls and best practices</li>
            <li>Hands-on exercise to reinforce learning</li>
          </ul>
          <p
            className="text-sm italic"
            style={{ color: 'var(--text-muted)' }}
          >
            Full lecture content will be added in a later update. In the
            meantime, explore the exercises and quiz for this topic below.
          </p>
        </div>
      </section>

      {/* Code Example */}
      <section className="mb-6">
        <h2
          className="text-lg font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Code Example
        </h2>
        <CodeBlock code={getCodeSnippet(topic.id)} />
      </section>

      {/* Exercises */}
      <section className="mb-6">
        <h2
          className="text-lg font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Exercises
        </h2>
        <ExerciseList topicId={topic.id} />
      </section>

      {/* Quiz */}
      <section className="mb-6">
        <h2
          className="text-lg font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Topic Quiz
        </h2>
        <Quiz topicId={topic.id} />
      </section>

      {/* Mark Complete */}
      <section className="mb-6">
        {isDone ? (
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background:
                'color-mix(in srgb, var(--color-success) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-success) 30%, transparent)',
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-success)', color: '#fff' }}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-success)' }}
              >
                Completed
              </div>
              <div
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Completed on {completedOn}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleMarkComplete}
            className="btn-primary flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Mark as Complete
          </button>
        )}
      </section>

      {/* Reference footer */}
      <footer
        className="pt-4 border-t text-xs"
        style={{
          borderColor: 'var(--surface-border)',
          color: 'var(--text-muted)',
        }}
      >
        <p>
          C++ Learning App — practice exercises and quizzes for every topic.
        </p>
      </footer>
    </article>
  )
}

/**
 * Return a short code snippet tailored to the topic.
 * Placeholder content — easy to replace with real examples later.
 */
function getCodeSnippet(id) {
  const snippets = {
    intro: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
    syntax: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
    'output-comments': `#include <iostream>
using namespace std;

int main() {
    // This is a comment
    cout << "Hello, World!" << endl;
    return 0;
}`,
    variables: `#include <iostream>
using namespace std;

int main() {
    int myNum = 15;
    cout << myNum;
    return 0;
}`,
    'data-types': `int myNum = 5;
float myFloatNum = 5.99;
char myLetter = 'D';
string myText = "Hello";
bool myBoolean = true;`,
    operators: `int sum = 100 + 50;
int diff = 100 - 50;
int product = 10 * 5;
int quotient = 10 / 2;
int remainder = 11 % 3;`,
    'strings-math': `#include <iostream>
#include <string>
#include <cmath>
using namespace std;

int main() {
    string greeting = "Hello";
    cout << greeting.length() << endl;
    cout << sqrt(64) << endl;
    return 0;
}`,
    conditions: `int time = 20;
if (time < 18) {
    cout << "Good day.";
} else {
    cout << "Good evening.";
}`,
    switch: `int day = 4;
switch (day) {
    case 1: cout << "Monday"; break;
    case 2: cout << "Tuesday"; break;
    default: cout << "Other";
}`,
    loops: `for (int i = 0; i < 5; i++) {
    cout << i << endl;
}

int i = 0;
while (i < 5) {
    cout << i << endl;
    i++;
}`,
    'break-continue': `for (int i = 0; i < 10; i++) {
    if (i == 4) break;
    if (i == 2) continue;
    cout << i << endl;
}`,
    arrays: `string cars[4] = {"Volvo", "BMW", "Ford", "Mazda"};
cout << cars[0];`,
    'structs-enums': `struct Car {
    string brand;
    string model;
    int year;
};

enum Level { LOW, MEDIUM, HIGH };`,
    pointers: `string food = "Pizza";
string* ptr = &food;

cout << ptr << endl;   // address
cout << *ptr << endl;  // value`,
    functions: `void myFunction() {
    cout << "I just got executed!";
}

int main() {
    myFunction();
    return 0;
}`,
    'overloading-scope': `int plusFunc(int x, int y) {
    return x + y;
}

double plusFunc(double x, double y) {
    return x + y;
}`,
    recursion: `int sum(int k) {
    if (k > 0) {
        return k + sum(k - 1);
    }
    return 0;
}`,
    'classes-objects': `class Car {
  public:
    string brand;
    string model;
    int year;
};

int main() {
    Car myCar;
    myCar.brand = "BMW";
    return 0;
}`,
    'class-methods': `class MyClass {
  public:
    void myMethod() {
        cout << "Hello World!";
    }
};`,
    constructors: `class Car {
  public:
    string brand;
    Car(string b) {
        brand = b;
    }
};`,
    'access-specifiers': `class MyClass {
  public:    // public
    int x;
  private:   // private
    int y;
  protected: // protected
    int z;
};`,
    encapsulation: `class Employee {
  private:
    int salary;
  public:
    void setSalary(int s) { salary = s; }
    int getSalary() { return salary; }
};`,
    inheritance: `class Vehicle {
  public:
    string brand = "Ford";
};

class Car : public Vehicle {
  public:
    string model = "Mustang";
};`,
    polymorphism: `class Animal {
  public:
    virtual void sound() { cout << "Some sound"; }
};

class Dog : public Animal {
  public:
    void sound() override { cout << "Woof"; }
};`,
    'file-handling': `#include <fstream>
using namespace std;

int main() {
    ofstream file("filename.txt");
    file << "Hello file!";
    file.close();
    return 0;
}`,
    exceptions: `try {
    throw runtime_error("Something went wrong");
} catch (exception& e) {
    cout << e.what();
}`,
    'date-time': `#include <ctime>
#include <iostream>
using namespace std;

int main() {
    time_t now = time(0);
    cout << ctime(&now);
    return 0;
}`,
    vectors: `#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    v.push_back(4);
    cout << v.size();
    return 0;
}`,
    'lists-stacks-queues': `#include <stack>
#include <queue>
using namespace std;

stack<int> s;
s.push(1);

queue<int> q;
q.push(1);`,
    'sets-maps': `#include <set>
#include <map>
using namespace std;

set<int> mySet = {1, 2, 3};
map<string, int> myMap;
myMap["one"] = 1;`,
    'iterators-algorithms': `#include <vector>
#include <algorithm>
using namespace std;

vector<int> v = {3, 1, 2};
sort(v.begin(), v.end());`,
  }

  return (
    snippets[id] ||
    `// Example for ${id}
// Coming soon...`
  )
}
