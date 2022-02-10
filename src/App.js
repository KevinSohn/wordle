import { useEffect, useState } from 'react';
import './App.css';

function App() {
  let wordKey = ["W", "O", "R", "D", "Y"];
  let classKey = ["gray", "yellow", "green", "blank"];
  let firstA = new Map([["Q", 3], ["W", 3], ["E", 3], ["R", 3], ["T", 3], ["Y", 3], ["U", 3], ["I", 3], ["O", 3], ["P", 3]]);
  let alpha2 = new Map([["A", 3], ["S", 3], ["D", 3], ["F", 3], ["G", 3], ["H", 3], ["J", 3], ["K", 3], ["L", 3]]);
  let alpha3 = new Map([["Z", 3], ["X", 3], ["C", 3], ["V", 3], ["B", 3], ["N", 3], ["M", 3]]);

  let firstRowAlpha = [];


  const [input, setInput] = useState([["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]]);
  // 0 is gray, 1 is yellow, 2 is green
  const [check, setCheck] = useState([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]);
  const [col, setCol] = useState(0);
  const [row, setRow] = useState(0);
  const [victory, setVictory] = useState([[], [], [], [], []]);
  const [vtext, setVText] = useState('');


  const handleUserKeyPress = event => {
    const { key, keyCode } = event;
    if (keyCode === 8) {
      let temp = [...input];
      if (temp[col][row] === '') {
        temp[col - 1][row] = '';
        temp[col][row] = '';
        setCol(col - 2);
      }
      temp[col][row] = '';
      setInput(temp);
      if (col > 0) {
        setCol(col - 1);
      }
    }

    if (keyCode === 32 || (keyCode >= 65 && keyCode <= 90)) {
      if (input[col][row] === '') {
        let temp = [...input];
        temp[col][row] = key.toUpperCase();
        if (col < 4) {
          setCol(col + 1);
        }
        setInput(temp);
      }
    }
    if (keyCode === 13 && col === 4 && input[col][row] !== '') {
      checkAnswers();
    }
  };

  function checkAnswers() {
    let temp = [...check];
    let visitedInput = [false, false, false, false, false];
    let visitedKey = [false, false, false, false, false];

    let cnt = 0;
    for (let i = 0; i < 5; i++) {
      if (wordKey[i] === input[i][row]) {
        visitedInput[i] = true;
        visitedKey[i] = true;
        temp[i][row] = 2;
        cnt++;
      }
      else {
        temp[i][row] = 0;
      }
    }
    if (cnt === 5) {
      console.log("victory!");
      announceVictory(true);
      return;
    }

    //input
    //wordKey
    //visited

    for (let i = 0; i < 5; i++) {
      if (visitedInput[i]) {
        continue;
      }
      for (let k = 0; k < 5; k++) {

        if (i === k) {
          continue;
        }
        if (visitedKey[k]) {
          continue;
        }
        if (input[i][row] === wordKey[k]) {
          visitedKey[k] = true;
          visitedInput[i] = true;
          temp[i][row] = 1;
        }
      }
    }
    setCheck(temp);
    setRow(row + 1);
    setCol(0);
  }

  async function announceVictory() {
    console.log(check);

    let temp = [[], [], [], [], []];
    let key = ["⬜", "🟨", "🟩"];

    let vString = '';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        temp[j][i] = check[i][j];
      }
    }

    for (let i = 0; i <= row; i++) {
      for (let j = 0; j < 5; j++) {
        vString += key[temp[i][j]] + '';
      }
      vString += '\n';
    }
    setVText(vString);
    setVictory(temp);
  }

  async function copy(text) {
    await navigator.clipboard.writeText(text);
    alert('Good job! Text copied!');
  }

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  });

  useEffect(() => {
    console.log(col);
  }, [col])

  useEffect(() => {
    if (vtext !== '') {
      copy(vtext);
    }
  }, [vtext]);

  useEffect(() => {
    console.log(firstA.entries());
    for (let [key, value] of firstA.entries()) {
      let curDiv = (<div className={"letterKeyBox" + classKey[value]}>{key}</div>);
      firstRowAlpha.push(curDiv);
    }

    console.log(firstRowAlpha);
  }, []);

  return (
    <div className="App flex flex-col justify-center items-center">
      <h1 className="header">Wordle!</h1>
      <div className='body mt-5'>
        <div className='flex flex-col'>
          <div className='flex flex-row'>
            {input.map((curRow, i) => (
              <div key={i}>{curRow.map((letter, j) => (
                <div key={j} className={"letterBox " + classKey[check[i][j]]} autoCapitalize='true'>{letter}</div>
              ))}</div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );


}

export default App;
