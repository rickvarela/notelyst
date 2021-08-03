import { Transforms } from 'slate';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Slate, withReact, Editable, ReactEditor } from 'slate-react';
import { createEditor } from 'slate';
import { useEffect, useMemo } from 'react';
import { useNoteState } from '../context/NoteContext';
import { useAuth } from '../context/AuthContext';
import UserIcon from '../assets/svg/user-icon.svg';

//Editor Area

const $EditorArea = styled.div`
  //background-color: none;
  flex: 1;
  display: flex;
  width: ${({ screenState }) =>
    screenState.isMobile && screenState.expandMenu ? '100%' : 0};
  overflow: hidden;
  flex-direction: column;
`;

export const EditorArea = ({ handelExpand, screenState }) => {
  return (
    <$EditorArea screenState>
      <EditorAreaHeader handelExpand={handelExpand} />
      <EditorInput />
    </$EditorArea>
  );
};

//Editor Header

const $EditorAreaHeader = styled.div`
  background-color: #324a5f;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const $Button = styled.button`
  text-decoration: none;
  color: black;
  background-color: #ced6df;
  line-height: 35px;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #bbc6d3;
  }
`;

const $Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const $Link = styled(Link)`
  text-decoration: none;
  color: black;
  background-color: #ced6df;
  line-height: 35px;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #bbc6d3;
  }
`;

const $UserIcon = styled.img`
  height: 20px;
`;

const $UserText = styled.div`
  margin: 0 40px 0 10px;
`;

const EditorAreaHeader = ({ handelExpand }) => {
  const { authState, authActions } = useAuth();
  const { noteState, noteActions } = useNoteState();

  const handelSignOut = () => {
    authActions.signOut().then(() => {
      noteActions.resetNotes();
    });
  };

  const getCurrentNote = () => {
    return noteState.data.filter(
      (note) => note._id === noteState._idUnderEdit
    )[0];
  };

  const handelSave = () => {
    noteActions.saveNote(getCurrentNote());
  };

  return (
    <$EditorAreaHeader>
      <div>
        <$Button onClick={handelExpand}>EXPAND MENU</$Button>
        {authState.authUser && (
          <$Button onClick={handelSave}>SAVE NOTE</$Button>
        )}
      </div>
      <$Nav>
        {authState.authUser ? (
          <>
            <$UserIcon src={UserIcon} />
            <$UserText>{authState.authUser.username}</$UserText>
            <$Button onClick={handelSignOut}>SIGN OUT</$Button>
          </>
        ) : (
          <>
            <$Link to='/signup' role='button'>
              SIGN UP
            </$Link>
            <$Link to='/login' role='button'>
              LOGIN
            </$Link>
          </>
        )}
      </$Nav>
    </$EditorAreaHeader>
  );
};

//Editor Input

const $EditorInput = styled.div`
  flex: 1;
  padding: 40px;
`;

const EditorInput = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const { noteState, noteActions } = useNoteState();

  useEffect(() => {
    if (noteState.editorFocus) {
      Transforms.select(editor, getCurentSeletionState());
      ReactEditor.focus(editor);
    }
  }, [noteState]);

  const getCurrentNoteState = () => {
    return noteState.data.filter(
      (note) => note._id === noteState._idUnderEdit
    )[0].editorState;
  };

  const getCurentSeletionState = () => {
    return noteState.data.filter(
      (note) => note._id === noteState._idUnderEdit
    )[0].selection;
  };

  return (
    <$EditorInput>
      <Slate
        editor={editor}
        value={getCurrentNoteState()}
        onChange={noteActions.updateEditorStateUnderEdit}
      >
        <Editable
          placeholder='Enter some text...'
          onBlur={() => noteActions.updateSelectionUnderEdit(editor.selection)}
        />
      </Slate>
    </$EditorInput>
  );
};
