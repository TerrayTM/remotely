import * as actionTypes from '../actions/actionTypes';

const apply = (state, newState) => {
    return {
        ...state,
        ...newState
    };
};

const initalState = {
    connected: false,
    error: false,
    joinError: false,
    id: null,
    loading: false,
    screenShot: null,
    ratio: null,
    size: null,
    files: []
};

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.CONNECTION_SUCCESS: return state.error ? state : apply(state, { connected: true });
        case actionTypes.CONNECTION_DISCONNECTED: return apply(state, { connected: false, error: true, id: null, screenShot: null, ratio: null });
        case actionTypes.CONNECTION_FAILED: return apply(state, { connected: false, error: true });
        case actionTypes.RECEIVED_SCREENSHOT: return apply(state, { screenShot: action.blob });
        case actionTypes.JOIN_SESSION_BEGIN: return apply(state, { loading: true, joinError: false });
        case actionTypes.JOIN_SESSION_SUCCESS: return apply(state, { loading: false, id: action.id, ratio: action.ratio, size: action.size });
        case actionTypes.JOIN_SESSION_FAILED: return apply(state, { loading: false, joinError: true });
        case actionTypes.RESET_JOIN_ERROR: return apply(state, { joinError: false });
        case actionTypes.CONNECTION_RESET: return apply(state, { ratio: null, screenShot: null, loading: false, id: null, joinError: false });
        case actionTypes.FILE_RECEIVED: return apply(state, { files: action.files });
        case actionTypes.DELETE_FILES: return apply(state, { files: [] });
        default: return state;
    }
};

export default reducer;