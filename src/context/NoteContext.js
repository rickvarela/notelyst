import { nanoid } from 'nanoid';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

const Context = createContext();

const apiDomain = (path) => {
  const production = process.env.NODE_ENV === 'production';
  return production ? 'https://api.rickvarela.com' + path : path;
};

const noteReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_NOTE_PROPS_UNDER_EDIT':
      return {
        ...state,
        editorFocus: false,
        data: state.data.map((note) => {
          if (note._id === state._idUnderEdit) {
            if (action.payload.note.editorState) {
              action.payload.note.saved = !note.saved
                ? false
                : deepEqual(note.editorState, action.payload.note.editorState);
            }
            return {
              ...note,
              ...action.payload.note,
            };
          }
          return note;
        }),
      };

    case 'CHANGE_NOTE_UNDER_EDIT':
      return {
        ...state,
        editorFocus: true,
        _idUnderEdit: action.payload._idUnderEdit,
      };

    case 'CREATE_NEW_NOTE':
      let init_id = nanoid();
      return {
        ...state,
        editorFocus: true,
        _idUnderEdit: init_id,
        data: [createNewNote(init_id), ...state.data],
      };

    case 'DELETE_NOTE':
      if (state.data.length === 1) return state;

      if (state._idUnderEdit === action.payload._idToDelete) {
        let deletedIndex, newData, _idUnderEdit;
        newData = state.data.filter((note, index) => {
          if (note._id !== action.payload._idToDelete) {
            return true;
          }
          deletedIndex = index;
          return false;
        });
        if (deletedIndex === newData.length) {
          _idUnderEdit = newData[newData.length - 1]._id;
        } else {
          _idUnderEdit = newData[deletedIndex]._id;
        }
        return {
          ...state,
          _idUnderEdit,
          data: newData,
        };
      }

      return {
        ...state,
        data: state.data.filter(
          (note) => note._id !== action.payload._idToDelete
        ),
      };

    case 'INIT_NOTE_LIST_LOCALSTOAGE':
      return initNoteState();

    case 'INIT_NOTE_LIST_DATABASE':
      return action.payload.initNoteState;

    case 'RESET_NOTE_LIST':
      let reset_id = nanoid();
      return {
        _idUnderEdit: reset_id,
        editorFocus: true,
        data: [createNewNote(reset_id)],
      };

    default:
      return state;
  }
};

function deepEqual(object1, object2) {
  if (!object1 || !object2) return;
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}

const createNewNote = (init_id) => {
  return {
    _id: init_id,
    saved: true,
    editorState: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
    selection: {
      anchor: {
        path: [0, 0],
        offset: 0,
      },
      focus: {
        path: [0, 0],
        offset: 0,
      },
    },
  };
};

function initNoteState(
  noteState = JSON.parse(sessionStorage.getItem('noteLyst-data'))
) {
  if (noteState) {
    noteState = noteState.map((note) => {
      return {
        ...note,
        saved: false,
        selection: {
          anchor: {
            path: [0, 0],
            offset: 0,
          },
          focus: {
            path: [0, 0],
            offset: 0,
          },
        },
      };
    });
    return {
      _idUnderEdit: noteState[0]._id,
      editorFocus: true,
      data: noteState,
    };
  } else {
    let init_id = nanoid();
    return {
      _idUnderEdit: init_id,
      editorFocus: true,
      data: [createNewNote(init_id)],
    };
  }
}

export const NoteProvider = ({ children }) => {
  const { authState, authActions } = useAuth();
  const [noteState, dispatchNoteState] = useReducer(noteReducer, {});

  useEffect(() => {
    if (noteState.data) {
      sessionStorage.setItem(
        'noteLyst-data',
        JSON.stringify(
          noteState.data.map((note) => {
            return { _id: note._id, editorState: note.editorState };
          })
        )
      );
    }
  }, [noteState.data]);

  const updateNoteUnderEdit = (notePropsToUpdate) => {
    dispatchNoteState({
      type: 'UPDATE_NOTE_PROPS_UNDER_EDIT',
      payload: {
        note: notePropsToUpdate,
      },
    });
  };

  const updateEditorStateUnderEdit = (editorStateToUpdate) => {
    dispatchNoteState({
      type: 'UPDATE_NOTE_PROPS_UNDER_EDIT',
      payload: {
        note: { editorState: editorStateToUpdate },
      },
    });
  };

  const updateSelectionUnderEdit = (selectionToUpdate) => {
    dispatchNoteState({
      type: 'UPDATE_NOTE_PROPS_UNDER_EDIT',
      payload: {
        note: { selection: selectionToUpdate },
      },
    });
  };

  const changeNoteUnderEdit = (_idToEdit) => {
    dispatchNoteState({
      type: 'CHANGE_NOTE_UNDER_EDIT',
      payload: { _idUnderEdit: _idToEdit },
    });
  };

  const createNewNote = () => {
    dispatchNoteState({
      type: 'CREATE_NEW_NOTE',
    });
  };

  const deleteNote = (_idToDelete) => {
    if (authState.authUser) {
      fetch('/api/note/delete', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ _idToDelete }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          dispatchNoteState({
            type: 'DELETE_NOTE',
            payload: { _idToDelete, saved: true },
          });
        })
        .catch(() => {
          //Do nothing
        });
    } else {
      dispatchNoteState({
        type: 'DELETE_NOTE',
        payload: { _idToDelete, saved: true }, //TODO remove saved
      });
    }
  };

  const saveNote = (noteToSave) => {
    fetch(apiDomain('/api/note'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(noteToSave),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      dispatchNoteState({
        type: 'UPDATE_NOTE_PROPS_UNDER_EDIT',
        payload: {
          note: { saved: true },
        },
      });
    });
  };

  const initNoteState = async () => {
    const isAuth = await authActions.checkAuth();
    if (isAuth) {
      fetch(apiDomain('/api/notes/user'), {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          let newNoteState = {
            _idUnderEdit: data[0]._id,
            editorFocus: true,
            data: data.map((note) => {
              return {
                ...note,
                saved: true,
                selection: {
                  anchor: {
                    path: [0, 0],
                    offset: 0,
                  },
                  focus: {
                    path: [0, 0],
                    offset: 0,
                  },
                },
              };
            }),
          };
          dispatchNoteState({
            type: 'INIT_NOTE_LIST_DATABASE',
            payload: { initNoteState: newNoteState },
          });
        })
        .catch(() => {
          dispatchNoteState({
            type: 'INIT_NOTE_LIST_LOCALSTOAGE',
          });
        });
    } else {
      dispatchNoteState({
        type: 'INIT_NOTE_LIST_LOCALSTOAGE',
      });
    }
  };

  const resetNotes = () => {
    dispatchNoteState({
      type: 'RESET_NOTE_LIST',
    });
  };

  const value = {
    noteState,
    dispatchNoteState,
    noteActions: {
      updateNoteUnderEdit,
      updateEditorStateUnderEdit,
      updateSelectionUnderEdit,
      changeNoteUnderEdit,
      createNewNote,
      deleteNote,
      saveNote,
      initNoteState,
      resetNotes,
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useNoteState = () => useContext(Context);
