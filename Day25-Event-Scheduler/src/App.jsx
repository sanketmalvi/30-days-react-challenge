import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import EventForm from "./components/EventForm";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("events");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission status:", permission);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const localNow = now.toLocaleString("sv-SE", { hour12: false }).slice(0, 16);
      console.log("Checking reminders at:", localNow);

      events.forEach((e) => {
        if (e.dateTime === localNow && !e.notified) {
          console.log("🔔 Triggering reminder for:", e.title);

          if (Notification.permission === "granted") {
            new Notification("Reminder", {
              body: `${e.title} - ${e.category}`,
            });
          } else {
            alert(`🔔 Reminder: ${e.title} - ${e.category}`);
          }

          setEvents((prev) =>
            prev.map((ev) =>
              ev.id === e.id ? { ...ev, notified: true } : ev
            )
          );
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [events]);

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: uuidv4(), notified: false }]);
  };

  const updateEvent = (updated) => {
    setEvents(events.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div
      className={`p-6 max-w-5xl mx-auto font-sans min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 to-white text-black"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
          📅 Calendar
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <EventForm
        addEvent={addEvent}
        updateEvent={updateEvent}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />

      <CalendarView
        events={events}
        setSelectedEvent={setSelectedEvent}
        deleteEvent={deleteEvent}
      />

      {/* Test Working Notification Button */}
      {/* <button
        onClick={() => {
          console.log("🔁 Manual test triggered");
          if ("Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("🔔 Reminder Test", {
                body: "✅ This is a working browser notification",
              });
            } else {
              alert("❌ Notifications not granted. Please allow them in browser settings.");
            }
          } else {
            alert("❌ Your browser does not support Notifications API");
          }
        }}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
      >
        🔁 Test Working Notification
      </button> */}
    </div>
  );
}

export default App;