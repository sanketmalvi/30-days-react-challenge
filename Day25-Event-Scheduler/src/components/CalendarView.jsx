import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const categoryColors = {
  Work: "#1e90ff",
  Personal: "#28a745",
  Urgent: "#dc3545",
  Others: "#6c757d",
};

const CalendarView = ({ events, setSelectedEvent, deleteEvent }) => {
  const handleEventClick = ({ event }) => {
    const found = events.find((e) => e.id === event.id);
    const action = window.prompt("Type 'edit' to edit or 'delete' to remove this event:");
    if (action === "edit") {
      setSelectedEvent(found);
    } else if (action === "delete") {
      deleteEvent(event.id);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      events={events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.dateTime,
        backgroundColor: categoryColors[e.category] || "#888",
        borderColor: categoryColors[e.category] || "#888",
        extendedProps: { category: e.category },
        display: "block",
      }))}
      eventClick={handleEventClick}
      eventDidMount={(info) => {
        info.el.setAttribute("title", `${info.event.title} (${info.event.extendedProps.category})`);
      }}
    />
  );
};

export default CalendarView;
