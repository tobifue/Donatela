const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("preference", action.payload.preference);
      localStorage.setItem("isAdmin", action.payload.isAdmin);
      return {
        ...state,
        auth: action.payload,
      };
    case "UNREGISTER":
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("preference");
      localStorage.removeItem("isAdmin");
      return {
        ...state,
        auth: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
