import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://media1.giphy.com/media/iiW7fjnWCnPD9ZGJqc/200w.webp?cid=ecf05e47rz9sdh0ajgtfaysh94jul0ipuxahddqwano0ykbe&rid=200w.webp&ct=g",
  "https://media4.giphy.com/media/zkIIzwcq7LwUhSbPyu/200w.webp?cid=ecf05e47xtf6vvtur3lhzp0o2ytxo0p8u0gv18f0j0pytyse&rid=200w.webp&ct=g",
  "https://media1.giphy.com/media/PYqdBERBeIXi2zG1Nl/200w.webp?cid=ecf05e47rz9sdh0ajgtfaysh94jul0ipuxahddqwano0ykbe&rid=200w.webp&ct=g",
  "https://media2.giphy.com/media/iv895YWveVRTpi2h6x/200w.webp?cid=ecf05e47rz9sdh0ajgtfaysh94jul0ipuxahddqwano0ykbe&rid=200w.webp&ct=g",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifInputValue, setGifInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkForConnectedWallet = async () => {
    const { solana } = window;
    try {
      if (solana?.isPhantom) {
        console.log("Wallet Found!");

        const response = await solana.connect({ onlyIfTrusted: true });
        console.log("Connected! Public Key: ", response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      } else {
        alert("Could not connect to your Phantom Wallet");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const onLoad = async () => {
      await checkForConnectedWallet();
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  useEffect(() => {
    if (walletAddress) {
      console.log("Loading gifs");

      // Load gifs from solana

      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  const onGifInputChange = (event) => {
    const { value } = event.target;
    setGifInputValue(value);
  };

  const sendGif = async () => {
    if (gifInputValue.length > 0) {
      console.log("Gif Link: ", gifInputValue);
      setGifList([...gifList, gifInputValue]);
      setGifInputValue("");
    }
    console.log("Empty Input, try again");
  };

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendGif();
        }}
      >
        <input
          type={"text"}
          placeholder="Enter Titan's GIF link"
          onChange={onGifInputChange}
          value={gifInputValue}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((gifLink) => (
          <div className="gif-item" key={gifLink}>
            <img src={gifLink} alt={gifLink} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderConnectWalletButton = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect Wallet!
    </button>
  );
  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🏈 Titan's GIFs</p>
          <p className="sub-text">⚔️⚔️⚔️⚔️</p>
          {walletAddress
            ? renderConnectedContainer()
            : renderConnectWalletButton()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
