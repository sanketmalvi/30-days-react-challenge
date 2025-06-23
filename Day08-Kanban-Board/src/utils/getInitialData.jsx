export const getInitialData = () => {
  const saved = localStorage.getItem('kanban-data');
  return saved
    ? JSON.parse(saved)
    : {
        tasks: {},
        columns: {
          backlog: { id: 'backlog', title: 'Backlog', taskIds: [] },
          'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
          done: { id: 'done', title: 'Done', taskIds: [] },
        },
        columnOrder: ['backlog', 'in-progress', 'done'],
      };
};