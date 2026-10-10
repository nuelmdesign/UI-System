# Building Education and learning products with opendraft

> Learning platforms, courses, classrooms and student information systems. Learners need to know where they are and what is next; instructors need to see a whole class at a glance and act in bulk.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

education, learning, lms, course, courses, classroom, student, teacher, instructor, school, university, lesson, quiz, assignment, grades, gradebook, enrollment, edtech.

## Principles for this domain

- Make progress visible everywhere: where the learner is in the course, what is done, what is next and how long it takes. Use `progress` and `stepper` with text (`3 of 8 lessons`), and always offer a clear Continue action.
- Accessibility first: sufficient contrast, full keyboard use, captions and transcripts for media, readable text sizes, no time limits that cannot be extended, and no meaning by color alone. Learners often use shared, older or assistive devices.
- Give low-pressure feedback: say what was right and what to try next, avoid red-X shaming, let learners retry, and show a grade only when the instructor chooses to release it. Celebrate completion without confetti that cannot be turned off.
- Separate instructor and learner views: the same course shows authoring, grading and class analytics to instructors, and only the learner's own work and progress to students. Never expose other students' names or grades.
- Be offline-tolerant: save drafts and answers locally as the learner types, show a visible Saved or Not saved state, and queue submissions with a clear status when the connection drops.
- Protect minors' data: avoid public profiles by default, show only what a guardian or teacher needs, and put sensitive records behind explicit access. Where regulation applies, keep consent and access records.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Course catalog and enrollment

- Fit: **Adapt**
- Use: [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md)
- How: `catalog` for browsing with search, categories and sort; `detail-page` has schedule, FAQ, tiers and seats left, which maps to course sessions and cohorts.
- Missing: Item fields are event-shaped (host, date, capacity) so relabel them for instructor, start date and seats; no prerequisite or level filters.

### Learner dashboard: courses in progress

- Fit: **Ready**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `progress` per course with a Continue button, `stat` for streak or time spent, `empty-state` for a new learner.

### Lesson and module navigation

- Fit: **Ready**
- Use: [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Sidebar Nav](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sidebar-nav.md), [Sidebar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-sidebar.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: Modules in an `accordion` or `sidebar-nav`, a vertical `stepper` for the lesson path, with a done or locked state per item.

### Video and reading lesson content

- Fit: **Gap**
- Use: [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Skeleton](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/skeleton.md)
- How: Transcript, notes and resources can sit in `tabs`; `code-block` for programming lessons.
- Missing: No video player with captions, speed control and resume, and no PDF or slide viewer; embed one and keep the transcript beside it.

### Quizzes and assessments

- Fit: **Adapt**
- Use: [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Question Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/question-card.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- How: `question-card` presents a question with options; `radio-group` and `checkbox` for answers; `progress` shows question count; a `dialog` confirms submit and names unanswered questions.
- Missing: No timer with accessibility extensions, no question-bank authoring and no automatic scoring or explanations view.

### Assignment submission and files

- Fit: **Ready**
- Use: [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: `dropzone` for uploads, a status `badge` (Not started, Submitted, Late, Graded), `timeline` for submission history; an `alert` for the deadline.

### Gradebook and feedback (instructor)

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md)
- How: A class-by-assignment `table` with bulk actions; `records-table` for editable rows; `textarea` for feedback and `slider` for a rubric score.
- Missing: No sticky-header spreadsheet grid with inline editing, and no rubric component.

### Class and cohort analytics

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: Relabel `analytics-dashboard` for completion and engagement; `progress` for each assignment's completion.
- Missing: No time-series or distribution chart (grade histogram) and no per-student drill-down chart.

### Timetable, deadlines and events

- Fit: **Gap**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: A `timeline` or `table` can list upcoming deadlines in order.
- Missing: No calendar or week-view timetable.

### Discussion and AI tutor

- Fit: **Adapt**
- Use: [Chat App](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/chat-app.md), [Message Bubble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-bubble.md), [Prompt Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/prompt-input.md), [Citations](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/citations.md), [Streaming Response](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/streaming-response.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md)
- How: The chat and agent components give threads and an input; `citations` lets a tutor point to course material.
- Missing: No threaded forum with replies and moderation; label AI answers clearly and let the instructor review them.

## Libraries and services that pair well

- Video lessons with captions: Mux Player, Video.js, Vimeo Player API. No video player ships in opendraft; embed one with captions and playback speed, report progress back to update `progress`, and place the transcript in `tabs` beside it.
- LMS interoperability and content standards: LTI 1.3, xAPI, SCORM Cloud. These sit in your backend; opendraft only renders the resulting course, grade and progress data, so map them into the props of `progress`, `table` and `stepper`.
- Rostering and sign-in with school accounts: Clever, ClassLink, Google Workspace for Education. Use `auth-screen` with their provider buttons; keep the roles (student, teacher, guardian) in your own data so views can differ.
- Offline sync and draft saving: Dexie (IndexedDB), TanStack Query persistence, RxDB. Save answers and drafts locally and show a Saved or Queued state with `badge`; flush the queue on reconnect.
- Calendar and timetable: FullCalendar, react-big-calendar, Schedule-X. No calendar component ships yet; use it for the week view and keep the opendraft `timeline` for a simple upcoming-deadlines list.

## Typical screens

- **Learner home**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md)
- **Course catalog**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md)
- **Lesson player**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Sidebar Nav](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sidebar-nav.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Quiz**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Question Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/question-card.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- **Instructor gradebook**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md) + [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-education
```

## Known gaps

- Course catalog and enrollment: Item fields are event-shaped (host, date, capacity) so relabel them for instructor, start date and seats; no prerequisite or level filters.
- Video and reading lesson content: No video player with captions, speed control and resume, and no PDF or slide viewer; embed one and keep the transcript beside it.
- Quizzes and assessments: No timer with accessibility extensions, no question-bank authoring and no automatic scoring or explanations view.
- Gradebook and feedback (instructor): No sticky-header spreadsheet grid with inline editing, and no rubric component.
- Class and cohort analytics: No time-series or distribution chart (grade histogram) and no per-student drill-down chart.
- Timetable, deadlines and events: No calendar or week-view timetable.
- Discussion and AI tutor: No threaded forum with replies and moderation; label AI answers clearly and let the instructor review them.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
