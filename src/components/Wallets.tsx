import {X} from 'lucide-react'

interface WalletsProps{
    isOpen :boolean;
    onClose: ()=>void;
    onSelectWallet: (wallet: "phantom" | 'solflare')=>void;
}
function Wallets({isOpen, onClose, onSelectWallet}: WalletsProps){
    if(!isOpen) return null;
    return(
        <div className = 'fixed bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 max-w-sm w-full mx-4'>
            <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectWallet('phantom')}
            className="w-full p-4 border border-[#A88FAC] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
          >
            <img
              src="https://phantom.app/favicon.ico"
              alt="Phantom"
              className="w-8 h-8"
            />
            <div className="text-left">
              <h3 className="font-semibold">Phantom</h3>
              <p className="text-sm text-gray-500">Connect to Phantom Wallet</p>
            </div>
          </button>
          
          <button
            onClick={() => onSelectWallet('solflare')}
            className="w-full p-4 border border-[#A88FAC] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
          >
            <img
              src="https://solflare.com/favicon.ico"
              alt="Solflare"
              className="w-8 h-8"
            />
            <div className="text-left">
              <h3 className="font-semibold">Solflare</h3>
              <p className="text-sm text-gray-500">Connect to Solflare Wallet</p>
            </div>
          </button>
        </div>
            </div>
        </div>
    )
}
export default Wallets;