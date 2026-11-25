// Add a project by copying an entry. The README describes each field.
const projects = [
  {
    id: "focuslog",
    title: "FocusLog",
    category: "Desktop application",
    summary: "A personal journal and to-do list built as my A-Level Computer Science project.",
    stack: ["Python", "Tkinter", "SQLite"],
    notes: "I used SQLite to associate entries and tasks with each account. The journal validates dates before saving and allows one entry per day.",
  },
  {
    id: "vision-mouse",
    title: "Vision Mouse",
    category: "Computer vision",
    summary: "A webcam-based mouse that tracks nose movement and uses blinks to click.",
    stack: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"],
    notes: "Raw webcam coordinates didn’t map cleanly to the display. I used ratio scaling to map movement from the camera frame to screen coordinates.",
  },
];
