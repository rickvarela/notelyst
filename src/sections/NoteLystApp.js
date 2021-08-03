import styled from 'styled-components';
import { useState, useEffect } from 'react';

import { MenuArea } from '../components/MenuArea';
import { EditorArea } from '../components/EditorArea';
import { useNoteState } from '../context/NoteContext';

const $NoteLystApp = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const NoteLystApp = () => {
  const [screenState, setScreenState] = useState({
    isMobile: window.innerWidth < 800,
    expandMenu: false,
  });
  const { noteState, noteActions } = useNoteState();

  useEffect(() => {
    noteActions.initNoteState()
    const updateWindow = () => {
      setScreenState((prevState) => ({
        ...prevState,
        isMobile: window.innerWidth < 800,
      }));
    };

    window.addEventListener('resize', updateWindow);
    return () => window.removeEventListener('resize', updateWindow);
  }, []);

  const handelExpand = () => {
    setScreenState((prevState) => ({
      ...prevState,
      expandMenu: !prevState.expandMenu,
    }));
  };

  return noteState.data ? (
    <$NoteLystApp>
      <MenuArea handelExpand={handelExpand} screenState={screenState} />
      <EditorArea handelExpand={handelExpand} screenState={screenState} />
    </$NoteLystApp>
  ) : null;
};
