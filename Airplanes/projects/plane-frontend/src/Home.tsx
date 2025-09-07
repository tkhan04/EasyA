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
  fullDescription: string
  totalshare: number
  shareAvalaible: number

}

const cards: CardData[] = [
  {
    title: 'Cesena 139',
    description: 'If a dog chews shoes whose shoes does he choose?',
    image: 'https://media.istockphoto.com/id/1466721380/photo/small-private-airplane-parked-at-the-airfield-at-scenic-sunrise.jpg?b=1&s=170667a&w=0&k=20&c=RRPU5BAO4oaFjVvYiM7ZrjMO0N3FyKkaoa32xLom3kE=',
    buttonText: 'View',
    fullDescription: "For Sale: Shares in a Pilatus PC-12. \n Ever dreamed of owning a high-performance single-engine turboprop that can get you into places a jet can't? Here's your chance! We're offering a limited number of shares in our impeccably maintained 2018 Pilatus PC-12 NG. This isn't just a plane; it's a versatile workhorse, perfect for both business trips and family getaways. With its best-in-class range and ability to operate from shorter runways, the PC-12 gives you incredible flexibility. \n Forget the major hubs—this aircraft opens up a world of smaller, more convenient airports, saving you time and hassle. The cabin is spacious and comfortable, featuring executive seating for eight, a fully enclosed lavatory, and a large cargo door for luggage and gear. Our ownership group is small, professional, and well-managed. We have a simple, transparent scheduling system and a dedicated maintenance team that keeps the aircraft in pristine condition. This is a rare opportunity to enjoy the benefits of private aviation at a fraction of the cost of full ownership. Contact us for a detailed prospectus and to schedule a showing. \n Fractional Ownership: The Iconic Cessna 172. \n Step into the world of aviation with a share in a true legend: the Cessna 172 Skyhawk. Perfect for new pilots, flight schools, or those who simply want a reliable and affordable way to fly, our 2005 model is a fantastic example of this timeless aircraft. This isn't a complex, high-performance machine—it's a straightforward, forgiving, and incredibly fun plane to fly. Our 172 is equipped with a modern Garmin G1000 glass cockpit, making it an excellent platform for building instrument time or training. The four-seat cabin is perfect for local scenic flights or short cross-country trips. Whether you're working on your private pilot's license, taking friends for a joyride, or simply building hours, this plane is ready for you. We're a small, friendly flying club seeking a new partner to share the costs and responsibilities of ownership. Our monthly dues are low, and our scheduling is fair and flexible. If you've been looking for a cost-effective way to get more time in the air, this is the perfect opportunity."
  },
  {
    title: 'Card Two',
    description: 'Another description goes here.',
    image: 'https://media.istockphoto.com/photos/small-single-engine-propeller-airplane-picture-id537584895?k=6&m=537584895&s=612x612&w=0&h=8qphW1aSAd-zASssWzHaUgwXPrbF1tmiH_iNhP4xzcA=',
    buttonText: 'View',
    fullDescription: 'Built in 2009, 3000 Hours of air time. Looking to split into 30 shares for better sustainablity as I no longer have the means to afford the plane alone, however still want to retain the ablity to fly.'

  },
  {
    title: 'Card Three',
    description: 'Extra info about this card.',
    image: 'https://media.istockphoto.com/id/1501079590/photo/small-light-airplane-on-green-field.jpg?b=1&s=170667a&w=0&k=20&c=UWlncGXL5zVgC01tHSGXGGxhbK6V9uNBodmxwyDxG0Q=',
    buttonText: 'View',
    fullDescription: 'Built in 2009, 3000 Hours of air time. Looking to split into 30 shares for better sustainablity as I no longer have the means to afford the plane alone, however still want to retain the ablity to fly.'

  },
  {
    title: 'Card Four',
    description: 'Cesana 030 ready for flight!',
    image: 'https://media.istockphoto.com/id/172646269/photo/private-airplane-taking-off-from-runway.jpg?s=612x612&w=0&k=20&c=M_SL2UflP58OmlSZPIN0HK2FqubpjMdNdtnofIk-_xY=',
    buttonText: 'View',
    fullDescription: 'Built in 2009, 3000 Hours of air time. Looking to split into 30 shares for better sustainablity as I no longer have the means to afford the plane alone, however still want to retain the ablity to fly.'

  }
]


const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [OpenWallet, WalletState] = useState

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

      {/* DaisyUI Modal */}
      {selectedCard && (
        <dialog id="card_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">{selectedCard.title}</h3>
            <img
              src={selectedCard.image}
              alt={selectedCard.title}
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
            <p className="py-4">{selectedCard.fullDescription}</p>
            <div className="modal-action flex gap-2">
              <button className="btn btn-secondary">Contact</button>
              <button className="btn btn-accent">Buy</button>
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