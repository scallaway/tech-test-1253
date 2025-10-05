# Tech Test 1253

Implemented with React + Typescript, Vite and bun.

I've also included React Compiler in the name of performance, but it doesn't
really make much difference for a project of this size.

## How to run

### Prerequisite

If you don't already have bun, please install it locally as outlined
[here](bun.sh)

### Running instructions

1. Clone the repo
2. Run `bun install`
3. Run `bun run dev`
4. Navigate to [localhost:5173](http://localhost:5173/)

## Covered vs. not covered

As was expected, I didn't get around to doing everything in the list. I
attribute that mainly to my inexperience with AgGrid and Workers, requiring
some additional time to brush up on that knowledge (I front-loaded that as much
as possible).

My priorities were defined as follows:
1. Render a basic spreadsheet layout
2. Parse basic cell formula operations
3. Reference cells within the above formula
4. Tab synchronisation
5. Negative value flashing

After ~3 hours of going at the problem, I managed to check off the top 3 items
in my priorities list - whilst also spending some time to devise a plan on tab
synchronisation as well.

I decided on these priorities as I felt getting the fundamentals of the
spreadsheet working first was of much higher importance than the other items
listed.

## Tab synchronisation plan

My main idea was to use `BroadcastChannel` to communicate between tab
instances.

When the React app mounts, it sends out a message on the specific channel
asking for the current state of the table. Any existing instances that are
currently running would pick up the message and respond back with the current
state. The fresh instance is then able to write those values to the grid.

When a cell has been updated, since the Worker is able to access
`BroadcastChannel` as well, it then sends out an "update" message with the
relevant Cell coordinates and the latest values, where other instances are
listening out for that message and can update accordingly.

Of course, this is all rather high-level, and doesn't take into consideration
two instances editing the same cell. I think that would require thinking and
planning well beyond the scope of 3 hours to determine a reconciliation
strategy.

I think, for a simple project like this, `BroadcastChannel` is better suited
than a `SharedWorker` primarily due to its simplicity to setup. On top of this,
there is much better browser compatibility with Web Workers +
`BroadcastChannel` compared to `SharedWorker`.

## Package justifications

On top of the required React & Typescript combination, I did lean on a few
other packages to make development easier.

### Math.js

I realised fairly swiftly that I was spending a lot of time understanding and
implementing AgGrid as well as Workers, so I didn't want to spend a lot of time
writing a whole mathematical expression parser as well. I spent a little bit of
time researching and came to the conclusion that Math.js solved the problems I
needed it to solve, whilst still being aware of the security implications.

### Immer

I'm a big fan of using the `produce()` function exported by `immer` to update
objects, especially nested objects, in an immutable manner. I find writing
immutable-first code much easier to maintain (everything is `readonly` where
possible), but in the situations where you do need to make in-line updates, I
find `produce()` is certainly worth its weight.

### Tiny Invariant

By implicitly defining invariants in the code, I find readability is greatly
improved - you no longer need to have non-null assertions in situations you
_think_ you'll not be stung by `undefined` access. This rubber-stamps that line
in the code making it very clear if something has gone wrong.
