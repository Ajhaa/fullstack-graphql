import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const SET_BIRTHYEAR = gql`
  mutation EditAuthor($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      name
      born
    }
  }
`;

const SetBirthyear = ({ authors }) => {
  const [author, setAuthor] = useState(authors[0] | "");
  const [year, setYear] = useState("");
  const [setBirthyear] = useMutation(SET_BIRTHYEAR);

  const submit = e => {
    e.preventDefault();
    setBirthyear({ variables: { name: author, year: Number(year) } });
    setYear('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <select value={author} onChange={e => setAuthor(e.target.value)}>
            {authors.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div>
          <input type="submit" value="set birthyear" />
        </div>
      </form>
    </div>
  );
};

export default SetBirthyear;
