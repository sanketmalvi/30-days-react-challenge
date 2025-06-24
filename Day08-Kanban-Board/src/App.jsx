import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";

const initialData = {
  todo: [
    { id: uuid(), text: "Design the UI", completed: false, tag: "#34d399" },
  ],
  inprogress: [],
  done: [],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban-columns");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [newTask, setNewTask] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("kanban-columns", JSON.stringify(columns));
  }, [columns]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = [...columns[source.droppableId]];
    const [movedTask] = sourceCol.splice(source.index, 1);
    const destCol = [...columns[destination.droppableId]];
    destCol.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: uuid(),
      text: newTask,
      completed: false,
      tag: randomTag(),
    };
    setColumns({
      ...columns,
      [selectedColumn]: [...columns[selectedColumn], task],
    });
    setNewTask("");
    setShowModal(false);
  };

  const toggleComplete = (colKey, taskId) => {
    setColumns({
      ...columns,
      [colKey]: columns[colKey].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const deleteTask = (colKey, taskId) => {
    setColumns({
      ...columns,
      [colKey]: columns[colKey].filter((task) => task.id !== taskId),
    });
  };

  const randomTag = () => {
    const tags = ["#facc15", "#34d399", "#60a5fa", "#f472b6"];
    return tags[Math.floor(Math.random() * tags.length)];
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-100">
      <h1 className="text-3xl font-bold text-center mb-6">🧠 Kanban Board</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columns).map(([colKey, tasks]) => (
            <Droppable key={colKey} droppableId={colKey}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white rounded-xl shadow-md p-4"
                >
                  <h2 className="text-xl font-semibold capitalize mb-4">
                    {colKey.replace(/([A-Z])/g, " $1")}
                  </h2>
                  {tasks.map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="mb-3 p-3 rounded-md bg-gray-50 shadow border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(colKey, task.id)}
                              />
                              <span className={
                                `text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`
                              }>
                                {task.text}
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: task.tag }}
                              ></span>
                              <button
                                onClick={() => deleteTask(colKey, task.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Delete task"
                              >✖</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2">Add New Task</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              placeholder="Task description"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-3"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {Object.keys(columns).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >Cancel</button>
              <button
                onClick={addTask}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}