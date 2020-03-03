export const UserReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ID':
      return { id: action.user.id };
    default:
      return state;
  }
};
