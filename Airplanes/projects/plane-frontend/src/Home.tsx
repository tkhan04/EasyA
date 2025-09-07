// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'
import PlaneActions from './components/PlaneActions'

interface HomeProps { }

interface CardData {
  title: string
  description: string
  image: string
  buttonText: string
  fullDescription: string
}

const cards: CardData[] = [
  {
    title: 'Cesana 353',
    description: 'Cessna 353 with 3000 hours of flight time',
    image: 'https://media.istockphoto.com/id/1466721380/photo/small-private-airplane-parked-at-the-airfield-at-scenic-sunrise.jpg?b=1&s=170667a&w=0&k=20&c=RRPU5BAO4oaFjVvYiM7ZrjMO0N3FyKkaoa32xLom3kE=',
    buttonText: 'View',
    fullDescription: "Cessna 107 with 3000 hours of flight time. Looking to sell 40% of my shares in this fine flying machine. Stored in a hanger located near Boston Logan Airport."
  },
  {
    title: 'Boeing LightAIr',
    description: 'Super light and fuel efficant Jet.',
    image: 'https://media.istockphoto.com/photos/small-single-engine-propeller-airplane-picture-id537584895?k=6&m=537584895&s=612x612&w=0&h=8qphW1aSAd-zASssWzHaUgwXPrbF1tmiH_iNhP4xzcA=',
    buttonText: 'View',
    fullDescription: "Cessna 107 with 3000 hours of flight time. Looking to sell 40% of my shares in this fine flying machine. Stored in a hanger located near Boston Logan Airport."
  },
  {
    title: 'FastJet Sky Surfer',
    description: 'Additonal info',
    image: 'https://media.istockphoto.com/id/1501079590/photo/small-light-airplane-on-green-field.jpg?b=1&s=170667a&w=0&k=20&c=UWlncGXL5zVgC01tHSGXGGxhbK6V9uNBodmxwyDxG0Q=',
    buttonText: 'View',
    fullDescription: "Cessna 107 with 3000 hours of flight time. Looking to sell 40% of my shares in this fine flying machine. Stored in a hanger located near Boston Logan Airport."
  },
  {
    title: 'Cesana 534',
    description: 'Cesana 030 ready for flight!',
    image: 'https://media.istockphoto.com/id/172646269/photo/private-airplane-taking-off-from-runway.jpg?s=612x612&w=0&k=20&c=M_SL2UflP58OmlSZPIN0HK2FqubpjMdNdtnofIk-_xY=',
    buttonText: 'View',
    fullDescription: "Cessna 107 with 3000 hours of flight time. Looking to sell 40% of my shares in this fine flying machine. Stored in a hanger located near Boston Logan Airport."
  }
]


const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)

  const { activeAddress } = useWallet()


  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }

return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <a className="btn btn-ghost text-xl">AirAlgo</a>

        <div className="flex justify-center flex-1">
          <button type="button" className="btn btn-primary lg:btn-lg flex items-center gap-2" onClick={toggleWalletModal}>
            <div className="w-full text-center">
              <div className="text-xs opacity-60 normal-case">my algo balance</div>
              <div className="text-lg font-bold normal-case">1,250,000.00</div>
            </div>
          </button>
        </div>


      </div>


      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl h-full">
              <figure className="h-48 w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover"
                />
              </figure>
              <div className="card-body flex flex-col justify-between">
                <div>
                  <h2 className="card-title">{card.title}</h2>
                  <p>{card.description}</p>
                </div>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedCard(card)}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Modal */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />

      {/* Plane Modal */}
      {selectedCard && (
        <dialog id="card_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">{selectedCard.title}</h3>
            <img
              src={selectedCard.image}
              alt={selectedCard.title}
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
            <p className="py-4">{selectedCard.description}</p>
            <div className="mt-4">
              <PlaneActions />
            </div>
            <div className="modal-action flex gap-2">
              <button
                className="btn"
                onClick={() => setSelectedCard(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}

export default Home
