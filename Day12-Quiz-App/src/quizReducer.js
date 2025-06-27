export const initialState = {
  questions: [],
  index: 0,
  score: 0,
  selected: null,
  timer: 30,
  showResult: false,
  userAnswers: [],
};

export function quizReducer(state, action) {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...initialState, questions: action.payload };
    case 'SELECT_OPTION':
      const correct = state.questions[state.index].correct_answer === action.payload;
      const updatedAnswers = [...state.userAnswers];
      updatedAnswers[state.index] = {
        selected: action.payload,
        correct: state.questions[state.index].correct_answer,
      };
      return {
        ...state,
        selected: action.payload,
        score: correct ? state.score + 1 : state.score,
        userAnswers: updatedAnswers,
      };
    case 'NEXT':
      if (state.index + 1 === state.questions.length) return { ...state, showResult: true };
      return { ...state, index: state.index + 1, selected: null, timer: 30 };
    case 'TICK':
      if (state.timer === 1) return { ...state, index: state.index + 1, selected: null, timer: 30 };
      return { ...state, timer: state.timer - 1 };
    default:
      return state;
  }
}