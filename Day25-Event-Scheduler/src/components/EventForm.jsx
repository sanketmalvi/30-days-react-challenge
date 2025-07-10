import { useEffect, useState } from "react";

const categories = [
  { label: "Work", color: "#1e90ff" },
  { label: "Personal", color: "#28a745" },
  { label: "Urgent", color: "#dc3545" },
  { label: "Others", color: "#6c757d" },
];

const EventForm = ({ addEvent, updateEvent, selectedEvent, setSelectedEvent }) => {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [category, setCategory] = useState(categories[0].label);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDateTime(selectedEvent.dateTime);
      setCategory(selectedEvent.category);
    }
  }, [selectedEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dateTime || !category) return;

    const event = { title, dateTime, category };

    if (selectedEvent) {
      updateEvent({ ...selectedEvent, ...event });
      setSelectedEvent(null);
    } else {
      addEvent(event);
    }

    setTitle("");
    setDateTime("");
    setCategory(categories[0].label);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded flex-1 min-w-[200px]"
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded bg-black"
      >
        {categories.map((c) => (
          <option key={c.label} value={c.label}>
            {c.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {selectedEvent ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default EventForm;
