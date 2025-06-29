// App.js
import { useState } from "react";
import DropdownSection from "./sheet.js";
import initialSections from "./course.json";
import ProgressCard from "./ProgressCard.js";
import "./course.css";

function App() {
  const [sections, setSections] = useState(initialSections);
  const totalSubtopics = initialSections.reduce(
    (total, section) => total + section.items.length,
    0
  );
  const totalCompleted = sections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.completed).length,
    0
  );

  const easyCount = initialSections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.difficulty === "Easy").length,
    0
  );
  const mediumCount = initialSections.reduce(
    (total, section) =>
      total +
      section.items.filter((item) => item.difficulty === "Medium").length,
    0
  );
  const hardCount = initialSections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.difficulty === "Hard").length,
    0
  );

  const easyCompleted = sections.reduce(
    (total, section) =>
      total +
      section.items.filter(
        (item) => item.difficulty === "Easy" && item.completed
      ).length,
    0
  );
  const mediumCompleted = sections.reduce(
    (total, section) =>
      total +
      section.items.filter(
        (item) => item.difficulty === "Medium" && item.completed
      ).length,
    0
  );
  const hardCompleted = sections.reduce(
    (total, section) =>
      total +
      section.items.filter(
        (item) => item.difficulty === "Hard" && item.completed
      ).length,
    0
  );

  const [openIndex, setOpenIndex] = useState(null);

  const percentage = ((totalCompleted / totalSubtopics) * 100).toFixed(1);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (circumference * percentage) / 100;

  const handleToggleCompleted = (sectionIdx, itemIdx) => {
    setSections((prevSections) =>
      prevSections.map((section, sIdx) =>
        sIdx === sectionIdx
          ? {
              ...section,
              items: section.items.map((item, iIdx) =>
                iIdx === itemIdx
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
          : section
      )
    );
  };

  const handleToggleRevision = (sectionIdx, itemIdx) => {
    setSections((prevSections) =>
      prevSections.map((section, sIdx) =>
        sIdx === sectionIdx
          ? {
              ...section,
              items: section.items.map((item, iIdx) =>
                iIdx === itemIdx ? { ...item, revision: !item.revision } : item
              ),
            }
          : section
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black px-2 py-8 app-container">
      <ProgressCard
        totalCompleted={totalCompleted}
        totalCount={totalSubtopics}
        easyCompleted={easyCompleted}
        easyCount={easyCount}
        mediumCompleted={mediumCompleted}
        mediumCount={mediumCount}
        hardCompleted={hardCompleted}
        hardCount={hardCount}
      />
      <div className="w-full max-w-3xl mt-6">
        {sections.map((section, idx) => (
          <DropdownSection
            key={idx}
            title={section.title}
            items={section.items}
            open={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            onToggleCompleted={(itemIdx) => handleToggleCompleted(idx, itemIdx)}
            onToggleRevision={(itemIdx) => handleToggleRevision(idx, itemIdx)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
