import styled from 'styled-components';
import { useNoteState } from '../context/NoteContext';
import { Node } from 'slate';
import SiteLogo from '../assets/svg/site-logo.svg';
import CloseX from '../assets/svg/close-x.svg';

const $MenuArea = styled.div`
  background-color: #e7ebee;
  width: ${({ screenState }) =>
    screenState.expandMenu ? 0 : screenState.isMobile ? '100%' : '400px'};
  overflow-x: hidden;
  opacity: ${({ screenState }) => (screenState.expandMenu ? 0 : '100%')};
  transition: opacity 700ms;
  display: flex;
  flex-direction: column;
`;

export const MenuArea = ({ handelExpand, screenState }) => {
  return (
    <$MenuArea handelExpand={handelExpand} screenState={screenState}>
      <NoteMenuHeader handelExpand={handelExpand} screenState={screenState} />
      <NoteList handelExpand={handelExpand} screenState={screenState} />
    </$MenuArea>
  );
};

// Note Menu Header

const $NoteMenuHeader = styled.div`
  background-color: #324a5f;
  color: white;
  display: flex;
  justify-content: space-between;
`;

const $SiteLogo = styled.img`
  height: 25px;
  margin: auto 5px;
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

const NoteMenuHeader = ({ handelExpand, screenState }) => {
  const { dispatchNoteState } = useNoteState();

  const handelCreateNote = () => {
    dispatchNoteState({
      type: 'CREATE_NEW_NOTE',
    });
  };

  return (
    <$NoteMenuHeader>
      <$SiteLogo src={SiteLogo} />
      <div>
        {screenState.isMobile && (
          <$Button onClick={handelExpand}>CLOSE MENU</$Button>
        )}
        <$Button onClick={handelCreateNote}>NEW NOTE</$Button>
      </div>
    </$NoteMenuHeader>
  );
};

// Note List

const $NoteList = styled.div`
  overflow-y: auto;
`;

const NoteList = ({ handelExpand, screenState }) => {
  const { noteState, dispatchNoteState } = useNoteState();
  return (
    <$NoteList>
      {noteState.data.map((note) => (
        <NoteItem
          note={note}
          key={note._id}
          _idUnderEdit={noteState._idUnderEdit}
          handelExpand={handelExpand}
          screenState={screenState}
        />
      ))}
    </$NoteList>
  );
};

// Note Item

const $NoteItem = styled.div`
  background-color: ${(props) => (props.isCurrent ? '#A1B9CE' : 'none')};
  padding: 5px;
  height: 60px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #bbc6d3;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isCurrent ? 'none' : '#CED6DF')};
  }

  img {
    opacity: 0;
    height: 15px;
  }

  &:hover img {
    opacity: 1;
  }
`;

const $IconWrapper = styled.div`
  width: 20px;
  width: 20px;
`;

const $NoteItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding-left: 5px;
`;

const $NoteItemText = styled.div`
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  margin: auto 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-height: 1.5em;
`;

const NoteItem = ({ note, _idUnderEdit, handelExpand, screenState }) => {
  const { noteState, dispatchNoteState } = useNoteState();
  let noteContent = note.editorState;

  const getNoteText = () => {
    return noteContent
      .slice(1)
      .filter((n) => Node.string(n) !== '')
      .map((n) => Node.string(n).trim())
      .join(' ');
  };

  const handelClick = () => {
    dispatchNoteState({ 
      type: 'CHANGE_NOTE_UNDER_EDIT',
      payload: { _idUnderEdit: note._id },
    });
    if (screenState.isMobile) handelExpand();
  };

  const handelDelete = () => {
    if (noteState.data.length === 1) return;
    if (note._id === noteState._idUnderEdit) {
      dispatchNoteState({
        type: 'CHANGE_NOTE_UNDER_EDIT',
        payload: { _idUnderEdit: noteState.data[0]._id },
      });
    }
    dispatchNoteState({
      type: 'DELETE_NOTE',
      payload: { _idToDelete: note._id },
    });
  };

  return (
    <$NoteItem isCurrent={note._id === _idUnderEdit}>
      <$IconWrapper>
        <img onClick={handelDelete} src={CloseX} />
      </$IconWrapper>
      <$NoteItemWrapper onClick={handelClick}>
        <$NoteItemText bold>
          {noteContent.length <= 1 && Node.string(noteContent[0]) === ''
            ? 'New note...'
            : Node.string(noteContent[0])}
        </$NoteItemText>
        {noteContent.length > 1 && (
          <$NoteItemText>{getNoteText()}</$NoteItemText>
        )}
      </$NoteItemWrapper>
    </$NoteItem>
  );
};
