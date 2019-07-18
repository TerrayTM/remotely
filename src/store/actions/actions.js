import io from 'socket.io-client';

import * as actionTypes from './actionTypes';
import { server } from '../../config';

let socket = null;

export const connectToServer = () => {
    return async (dispatch, getState) => {
        try {
            socket = io.connect(server, { reconnection: false });

            socket.on('connect_error', () => dispatch(connectionFailed()));

            socket.on('disconnect', () => dispatch(connectionDisconnected()));

            socket.on('connect', () => dispatch(connectionSuccess()));

            socket.on('screenShot', (blob) => dispatch(receivedScreenShot(blob)));

            socket.on('serverClosed', () => dispatch(connectionDisconnected()));

            socket.on('file', (data, fileName) => dispatch(fileReceived(data, fileName, getState().files)));
        } catch (error) {
            dispatch(connectionFailed());
        }
    };
};

export const joinSession = (id, token) => {
    return async (dispatch) => {
        dispatch(joinSessionBegin());

        id = id.toUpperCase();
        id = id.split('-').join('');
        token = token.toUpperCase();

        if (socket) {
            const params = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            }

            try {
                let response = await fetch(`${server}/session`, params);
                response = await response.text();

                if (response === 'VALID') {
                    socket.emit('joinSession', id, token, (success, ratio, size) => {
                        dispatch((success ? joinSessionSuccess : joinSessionFailed)(id, ratio, size));
                    });
                } else {
                    dispatch(joinSessionFailed());
                }
            } catch (error) {
                dispatch(joinSessionFailed());
            }
        }
    };
};

export const closeConnection = () => {
    return async (dispatch) => {
        if (socket) {
            socket.emit('closeSession', () => {
                dispatch(connectionReset());
            });
        }
    }
};

export const connectionReset = () => {
    return {
        type: actionTypes.CONNECTION_RESET
    };
};

export const resetJoinError = () => {
    return {
        type: actionTypes.RESET_JOIN_ERROR
    };
};

export const sendKeyBoardKeys = (keys) => {
    if (socket) {
        socket.emit('keyBoardEvent', keys);
    }
};

export const sendLeftMouseDown = (position) => {
    if (socket) {
        socket.emit('mouseLeftDown', position);
    }
};

export const sendLeftMouseUp = (position) => {
    if (socket) {
        socket.emit('mouseLeftUp', position);
    }
};

export const sendRightMouseDown = (position) => {
    if (socket) {
        socket.emit('mouseRightDown', position);
    }
};

export const sendRightMouseUp = (position) => {
    if (socket) {
        socket.emit('mouseRightUp', position);
    }
};

const joinSessionBegin = () => {
    return {
        type: actionTypes.JOIN_SESSION_BEGIN,
    };
};

const joinSessionFailed = () => {
    return {
        type: actionTypes.JOIN_SESSION_FAILED,
    };
};

const joinSessionSuccess = (id, ratio, size) => {
    return {
        type: actionTypes.JOIN_SESSION_SUCCESS,
        id,
        ratio,
        size
    };
};

const connectionSuccess = () => {
    return {
        type: actionTypes.CONNECTION_SUCCESS,
    };
};

const connectionFailed = () => {
    return {
        type: actionTypes.CONNECTION_FAILED,
    };
};

const connectionDisconnected = () => {
    return {
        type: actionTypes.CONNECTION_DISCONNECTED,
    };
};

const receivedScreenShot = (blob) => {
    return {
        type: actionTypes.RECEIVED_SCREENSHOT,
        blob
    };
};

const fileReceived = (data, fileName, currentFiles) => {
    const length = Math.min(16, currentFiles.length);
    const file = new Blob([data], { type: 'octet/stream' });
    const item = { path: window.URL.createObjectURL(file), name: fileName };
    const files = [item, ...currentFiles.slice(0, length)];
    const waste = currentFiles.slice(length);

    waste.forEach(i => {
        window.URL.revokeObjectURL(i.path);
    });
    
    return {
        type: actionTypes.FILE_RECEIVED,
        files
    };
};

export const deleteFiles = () => {
    return async (dispatch, getState) => {
        getState().files.forEach(i => {
            window.URL.revokeObjectURL(i.path);
        });

        dispatch(filesDeleted());
    };
};

const filesDeleted = () => {
    return {
        type: actionTypes.DELETE_FILES
    };
};