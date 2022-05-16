import "./App.css";
import web3 from "./web3";
import { useEffect, useState } from "react";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      // don't need call({from: xxx}). Only in call, send is not
      //because we use provider of Metamask, it have default from address
      setManager(await lottery.methods.manager().call());
      setPlayerList(await lottery.methods.getPlayerList().call());
      setBalance(await web3.eth.getBalance(lottery.options.address));
    })();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounstList = await web3.eth.getAccounts();
    setMessage("Loading...");

    // not like call, we need sent address who send create this transaction
    await lottery.methods.enter().send({
      from: accounstList[0],
      value: web3.utils.toWei(value, "ether"),
      gas: 1000000,
    });

    setMessage("You entered!!!");
  };

  const onClick = async () => {
    const accounstList = await web3.eth.getAccounts();

    setMessage("Pick a winner processing....");
    await lottery.methods.pickWinner().send({
      gas: 1000000,
      from: accounstList[0],
    });

    setMessage("A winner has been picked!!!");
  };

  return (
    <div className="App">
      <div>Manager: {manager}</div>
      <div>Player number: {playerList.length}</div>
      <div>Balance win: {web3.utils.fromWei(balance, "ether")}</div>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <label>
          Amount(Must {">"} 0.011)
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </label>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Pick a winner</h4>
      <button onClick={onClick}>Pick</button>
      <hr />
      <h2>{message}</h2>
    </div>
  );
}

export default App;
