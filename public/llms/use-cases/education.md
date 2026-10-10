# Building Education and learning products with opendraft

> Learning platforms, courses, classrooms and student information systems. Learners need to know where they are and what is next; instructors need to see a whole class at a glance and act in bulk.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

education, learning, lms, course, courses, classroom, student, teacher, instructor, school, university, lesson, quiz, assignment, grades, gradebook, enrollment, edtech.

## Principles for this domain

- Make progress visible everywhere: where the learner is in the course, what is done, what is next and how long it takes. Use `progress` (`label` and `valueLabel`, e.g. `3 of 8 lessons`) and always offer a clear Continue action. Keep the default brand tone, or `success` at 100%: `tone="auto"` treats a full bar as bad.
- Accessibility first: sufficient contrast, full keyboard use, captions and transcripts for media, readable text sizes, no time limits that cannot be extended, and no meaning by color alone. Learners often use shared, older or assistive devices.
- Give low-pressure feedback: say what was right and what to try next, avoid red-X shaming, let learners retry, and show a grade only when the instructor chooses to release it. Celebrate completion without confetti that cannot be turned off.
- Separate instructor and learner views: the same course shows authoring, grading and class analytics to instructors, and only the learner's own work and progress to students. Never expose other students' names or grades.
- Be offline-tolerant: save drafts and answers locally as the learner types, show a visible Saved or Not saved state, and queue submissions with a clear status when the connection drops.
- Protect minors' data: avoid public profiles by default, show only what a guardian or teacher needs, and put sensitive records behind explicit access. Where your rules require it, keep consent and access records; opendraft makes no compliance guarantee.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Course catalog and enrollment

- Fit: **Adapt**
- Use: [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: Works for cohort or scheduled courses. `catalog`: `host` is the instructor (set `labels.hostLabel` to 'Taught by'), `date` the start date, `capacity` and `remaining` the seats, `category` the subject, `priceRanges` and `currency` for fees (price 0 shows the free label). `detail-page`: tiers are enrolment options (full price, concession), the Schedule tab is the week-by-week outline, key facts for length and level, FAQ, `onWaitlist` for full cohorts; relabel with `labels`. `checkout` for paid enrolment.
- Missing: Item shape is event-shaped: `host`, `date`, `capacity` and `remaining` are required and the date block and seats are always shown, so self-paced courses with no start date or seat limit don't fit (use `card`, `input`, `select` and `badge`). No prerequisite or level filters. `checkout` has fixed copy (booking for someone else, digital pass or desk collection, a QR ticket on confirmation); free enrolment can skip it and call your API from `onCheckout`.

### Learner dashboard: courses in progress

- Fit: **Ready**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: One `card` per course with `progress` (`label` is the course, `valueLabel` '3 of 8 lessons') and a Continue `button`; `stat` for streak or time spent; `tabs` for In progress and Completed; `empty-state` for a new learner. Don't set `tone="auto"` on completion bars: it reads a full bar as bad.

### Lesson and module navigation

- Fit: **Adapt**
- Use: [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Sidebar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-sidebar.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: Modules in an `accordion` with lesson rows inside, or an `animated-sidebar` menu (menu buttons with `isActive`, `disabled` for locked lessons, a `badge` slot, sub-menus, a mobile sheet). A vertical `stepper` (steps take a `description` such as the duration) shows a linear path with a check on finished lessons. `progress` for the module.
- Missing: `stepper` is linear: only completed steps are clickable, there is no locked or skipped state and no jump to any lesson, so use it for a short path, not a full syllabus. `sidebar-nav` is an AI chat sidebar (workspace switcher, searchable chats), not course navigation. No table-of-contents component with per-lesson completion: build the rows with a Check icon.

### Video and reading lesson content

- Fit: **Gap**
- Use: [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Skeleton](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/skeleton.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Transcript, notes and resources can sit in `tabs` beside the player; `accordion` for chapters; `code-block` (code, language, line highlights, copy, line numbers) for programming lessons; `skeleton` while content loads.
- Missing: No video or audio player (captions, speed, resume), no PDF or slide viewer; embed one and keep the transcript beside it.

### Quizzes and assessments

- Fit: **Gap**
- Use: [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Question Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/question-card.md)
- How: Compose a quiz: `radio-group` and `checkbox` for answers, `textarea` for short answers, `progress` with `label` '4 of 10', a `dialog` that confirms submit and names unanswered questions, and an `alert` for time remaining. Keep scoring and explanations in your code and show them with `badge` and `alert`. `question-card` suits ungraded warm-up questions or polls.
- Missing: `question-card` is survey-shaped, not a quiz: questions are `{q, type, options}` strings with no correct answer, single choice auto-advances so answers cannot be reviewed first, there is always a Skip button and a free-text 'Something else' option, and it returns answers by index with no scoring or feedback. No timer with accessibility extensions, no question-bank authoring.

### Assignment submission and files

- Fit: **Ready**
- Use: [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `dropzone` for uploads (`accept`, `maxSize`, `maxFiles`, a `files` list with progress and per-file error; you handle the upload), a status `badge` (Not started, Submitted, Late, Graded), `timeline` for submission history, and an `alert` for the deadline.

### Gradebook and feedback (instructor)

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- How: `table` is the grid: virtualized (fixed `rowHeight`, `height`), sticky header, sortable, resizable and reorderable columns, `selectable` with `onSelectionChange` (ids) and `getRowId`, and `editable` columns with `onCellEdit` for inline score entry (plain text input, so validate the number yourself). Show your own bulk bar of `button`s over the selection. Open feedback in a `drawer` with `textarea` and a `slider` per rubric criterion (`marks`, `formatValue`). Scrolls sideways on phones.
- Missing: No rubric component and no sticky first column. `filter-table` is a demo task table, `records-table` a demo record grid and `selection-actions` an AI text-rewrite bar, so none of them is a gradebook.

### Class and cohort analytics

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: Relabel `analytics-dashboard`: KPI cards with delta (completion, average score), one metric line chart with tabs, a sortable table per assignment (name, learners via `formatVisitors`, completion 0-1 via `formatConversion`, or a `valueColumn`), and the `channels` stacked bar can show grade bands. `progress` per assignment.
- Missing: Ranges are fixed to three tabs (7d, 30d, 90d; relabel to week, month, term) and are not driven by `date-range-picker`. The chart is one series; no histogram and no per-student drill-down chart.

### Timetable, deadlines and events

- Fit: **Gap**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md)
- How: `timeline` lists upcoming deadlines in order (`time`, `timestamp`, status current, upcoming or destructive for overdue, `meta` for the course) with `align="right-time"` on wide screens; `table` for a sortable list; `alert` for due soon; `date-picker` (`min`, `max`, `isDateDisabled`) to set a reminder date.
- Missing: No calendar and no week-view timetable or month grid with events. `date-picker` and `date-range-picker` show a month grid for choosing dates only, with no event markers, and `date-picker` has no time-zone support.

### Discussion and AI tutor

- Fit: **Adapt**
- Use: [Chat App](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/chat-app.md), [Message](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message.md), [Message Bubble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-bubble.md), [Message Scroller](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-scroller.md), [Prompt Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/prompt-input.md), [Streaming Response](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/streaming-response.md), [Citations](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/citations.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md)
- How: `message` rows (`from` is `user` or `assistant`) with `avatar`; `prompt-input` as the composer (omit `models`); `streaming-response` for tutor answers (status streaming, complete or error, copy, retry, up or down feedback, and a `sources` list); `citations` lets a tutor point to course material (`CitationItem` with title, domain, url); `message-scroller` follows streamed output. Label AI answers clearly.
- Missing: No threaded forum with replies, reactions or moderation, and no instructor review queue; only two message sides. Build those from `message` and `table`.

## Libraries and services that pair well

- Video lessons with captions: Mux Player, Video.js, Vimeo Player API. No video player ships in opendraft; embed one with captions and playback speed, report progress back to update `progress`, and place the transcript in `tabs` beside it.
- LMS interoperability and content standards: LTI 1.3, xAPI, SCORM Cloud. These sit in your backend; opendraft only renders the resulting course, grade and progress data, so map them into the props of `progress`, `table` and `stepper`.
- Rostering and sign-in with school accounts: Clever, ClassLink, Google Workspace for Education. `auth-screen` takes a `providers` list for the provider buttons but always shows the email and password form; keep roles (student, teacher, guardian) in your own data so views can differ.
- Offline sync and draft saving: Dexie (IndexedDB), TanStack Query persistence, RxDB. Save answers and drafts locally and show a Saved or Queued state with `badge`; flush the queue on reconnect.
- Calendar and timetable: FullCalendar, react-big-calendar, Schedule-X. No calendar component ships; use one of these for the week view and keep the opendraft `timeline` for a simple upcoming-deadlines list.

## Typical screens

- **Learner home**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Course catalog**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md)
- **Lesson player**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Sidebar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-sidebar.md) + [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Quiz**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Assignment**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Deadlines**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Instructor gradebook**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md) + [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md) + [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md) + [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-education
```

## Known gaps

- Course catalog and enrollment: Item shape is event-shaped: `host`, `date`, `capacity` and `remaining` are required and the date block and seats are always shown, so self-paced courses with no start date or seat limit don't fit (use `card`, `input`, `select` and `badge`). No prerequisite or level filters. `checkout` has fixed copy (booking for someone else, digital pass or desk collection, a QR ticket on confirmation); free enrolment can skip it and call your API from `onCheckout`.
- Lesson and module navigation: `stepper` is linear: only completed steps are clickable, there is no locked or skipped state and no jump to any lesson, so use it for a short path, not a full syllabus. `sidebar-nav` is an AI chat sidebar (workspace switcher, searchable chats), not course navigation. No table-of-contents component with per-lesson completion: build the rows with a Check icon.
- Video and reading lesson content: No video or audio player (captions, speed, resume), no PDF or slide viewer; embed one and keep the transcript beside it.
- Quizzes and assessments: `question-card` is survey-shaped, not a quiz: questions are `{q, type, options}` strings with no correct answer, single choice auto-advances so answers cannot be reviewed first, there is always a Skip button and a free-text 'Something else' option, and it returns answers by index with no scoring or feedback. No timer with accessibility extensions, no question-bank authoring.
- Gradebook and feedback (instructor): No rubric component and no sticky first column. `filter-table` is a demo task table, `records-table` a demo record grid and `selection-actions` an AI text-rewrite bar, so none of them is a gradebook.
- Class and cohort analytics: Ranges are fixed to three tabs (7d, 30d, 90d; relabel to week, month, term) and are not driven by `date-range-picker`. The chart is one series; no histogram and no per-student drill-down chart.
- Timetable, deadlines and events: No calendar and no week-view timetable or month grid with events. `date-picker` and `date-range-picker` show a month grid for choosing dates only, with no event markers, and `date-picker` has no time-zone support.
- Discussion and AI tutor: No threaded forum with replies, reactions or moderation, and no instructor review queue; only two message sides. Build those from `message` and `table`.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
