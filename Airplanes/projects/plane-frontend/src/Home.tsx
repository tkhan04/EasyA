// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'

interface HomeProps {}

interface CardData {
  title: string
  description: string
  image: string
  buttonText: string
}

const cards: CardData[] = [
  {
    title: 'Card One',
    description: 'If a dog chews shoes whose shoes does he choose?',
    image: 'https://th.bing.com/th/id/R.db2611db16a7959a14c23f0ea95a1def?rik=PaYV%2fptOCC73UA&pid=ImgRaw&r=0',
    buttonText: 'Buy Now',
  },
  {
    title: 'Card Two',
    description: 'Another description goes here.',
    image: 'https://media.istockphoto.com/photos/small-single-engine-propeller-airplane-picture-id537584895?k=6&m=537584895&s=612x612&w=0&h=8qphW1aSAd-zASssWzHaUgwXPrbF1tmiH_iNhP4xzcA=',
    buttonText: 'Learn More',
  },
  {
    title: 'Card Three',
    description: 'Extra info about this card.',
    image: 'https://placehold.co/400x200',
    buttonText: 'Details',
  },
]


const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
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
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={card.image} alt={card.title} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{card.title}</h2>
                <p>{card.description}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">{card.buttonText}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home


