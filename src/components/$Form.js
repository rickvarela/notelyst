import styled from 'styled-components';

export const $Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  border: 1px solid black;
  padding: 40px;
  border-radius: 5px;

  > input {
    font-size: 1.25rem;
  }

  > input:-webkit-autofill::first-line {
    font-family: $body-font;
    font-size: 1.25rem;
  }

  input[type='submit'] {
    margin-top: 20px;
  }
`;
