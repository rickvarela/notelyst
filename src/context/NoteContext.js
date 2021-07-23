import { nanoid } from 'nanoid';
import { createContext, useContext, useReducer } from 'react';

const Context = createContext();

const noteReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_NOTE_UNDER_EDIT':
      return {
        ...state,
        editorFocus: false,
        data: state.data.map((note) => {
          if (note._id === state._idUnderEdit) {
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
        data: [...state.data, createNewNote(init_id)],
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
        if (deletedIndex === 0) {
          _idUnderEdit = newData[0]._id;
        } else {
          _idUnderEdit = newData[deletedIndex - 1]._id;
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

    default:
      return state;
  }
};

const createNewNote = (init_id) => {
  return {
    _id: init_id,
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

export const NoteProvider = ({ children }) => {
  let init_id = nanoid();
  const [noteState, dispatchNoteState] = useReducer(noteReducer, {
    _idUnderEdit: init_id,
    editorFocus: true,
    data: [createNewNote(init_id)],
  });

  const value = {
    noteState,
    dispatchNoteState,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useNoteState = () => useContext(Context);
