import { ethers } from 'ethers'

const Navigation = ({ account, setAccount, setNetwork }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
    }

    return (
        <nav>
            <div className='nav__brand'>      
                <h1>Acclimate</h1>               
            </div>
            <div>
                <ul className='nav__links'>
                    <li><a href="#Essentials">Essentials</a></li> 
                    <li><a href="#Clothing & Costumes">Clothing</a></li>
                    <li><a href="#Toys">Toys</a></li>
                </ul>
            </div>
            <input
                type="text"
                className="nav__search"
            ></input>

           <div className='nav__connect'>
            {account ? (
              <>
                <button type="button" className="nav__connected-button">
                  {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
                <div className='nav__dropdown'>
                  <button onClick={() => setNetwork('localhost')}>Localhost</button>
                  <button onClick={() => setNetwork('goerli')}>Goerli</button>
                </div>
              </>
            ) : (
              <button type="button" className="nav__connect-button" onClick={connectHandler}>
                Connect
              </button>
            )}
          </div>
        </nav>
    );
}

export default Navigation;
