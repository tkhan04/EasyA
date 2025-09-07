import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { useSnackbar } from 'notistack'
import {
  useDeployApp,
  useCreateListing,
  useOptIn,
  usePreparePayment,
  useGetListing,
  decodeBase64Txn,
} from '../hooks/useAlgorandApi'

const PlaneActions = () => {
  const { activeAddress, signTransactions } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const [name, setName] = useState('G700 #1')
  const [total, setTotal] = useState(1000)
  const [unitName, setUnitName] = useState('PLANE')

  const [assetId, setAssetId] = useState<string>('')
  const [appAddr, setAppAddr] = useState<string>('')
  const [priceMicroAlgos, setPriceMicroAlgos] = useState<string>('100000') // 0.1 ALGO per share (hardcoded default)

  // Demo-only hardcoded wallet/share logic for presentation
  const [fakeWalletUsd, setFakeWalletUsd] = useState<number>(1250000) // $1,250,000 demo balance
  const [pricePerShareUsd] = useState<number>(5) // $5 per share
  const [showBuy, setShowBuy] = useState(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [availableShares, setAvailableShares] = useState<number>(40) // arbitrary demo value
  const [myShares, setMyShares] = useState<number>(0)
  const [buyLoading, setBuyLoading] = useState<boolean>(false)

  const deploy = useDeployApp()
  const createListing = useCreateListing()
  const optIn = useOptIn()
  const preparePay = usePreparePayment()
  const listingQuery = useGetListing(assetId || '0')

  return (
    <div className="flex flex-col gap-3 p-4 border rounded">
      <h3 className="font-bold">Plane Actions</h3>

      <button className="btn btn-primary" onClick={() => deploy.mutate({} as any)}>
        Deploy App
      </button>

      <div className="flex gap-2 items-center">
        <input className="input input-bordered" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input input-bordered" type="number" placeholder="Total" value={total} onChange={(e) => setTotal(parseInt(e.target.value || '0'))} />
        <input className="input input-bordered" placeholder="Unit" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
        <button
          className="btn"
          onClick={async () => {
            if (!activeAddress) return
            try {
              const res = await createListing.mutate({ managerAddr: activeAddress, name, unitName, total, decimals: 0 } as any)
              const unsignedTxn = decodeBase64Txn(res.txn)
              const stxns = await signTransactions!([unsignedTxn])
              const signed = (Array.isArray(stxns) ? stxns[0] : stxns) as Uint8Array
              const algorand = AlgorandClient.fromConfig({ algodConfig })
              const sendRes = await algorand.client.algod.sendRawTransaction(signed as Uint8Array).do()
              enqueueSnackbar(`ASA create sent: ${sendRes.txid}`, { variant: 'success' })
            } catch (e: any) {
              enqueueSnackbar(e?.message || 'ASA create failed', { variant: 'error' })
            }
          }}
        >
          Create Listing (ASA)
        </button>
      </div>

      <div className="flex flex-col gap-2 p-3 border rounded bg-base-100">
        <div className="text-sm">Demo wallet balance: ${'{'}fakeWalletUsd.toLocaleString(){'}'}</div>
        <div className="text-sm">Shares left: {availableShares}</div>
        <div className="text-sm">Price per share (USD): ${'{'}pricePerShareUsd.toFixed(2){'}'}</div>
      </div>

      <div className="flex gap-2 items-center">
        <input className="input input-bordered" placeholder="Asset ID" value={assetId} onChange={(e) => setAssetId(e.target.value)} />
        <button
          className="btn"
          onClick={async () => {
            if (!activeAddress || !assetId) return
            try {
              const res = await optIn.mutate({ accountAddr: activeAddress, assetId: Number(assetId) } as any)
              const unsignedTxn = decodeBase64Txn(res.txn)
              const stxns = await signTransactions!([unsignedTxn])
              const signed = (Array.isArray(stxns) ? stxns[0] : stxns) as Uint8Array
              const algorand = AlgorandClient.fromConfig({ algodConfig })
              const sendRes = await algorand.client.algod.sendRawTransaction(signed as Uint8Array).do()
              enqueueSnackbar(`Opt-in sent: ${sendRes.txid}`, { variant: 'success' })
            } catch (e: any) {
              enqueueSnackbar(e?.message || 'Opt-in failed', { variant: 'error' })
            }
          }}
        >
          Opt-in
        </button>
        <button className="btn" onClick={() => listingQuery.refetch()}>Get Listing</button>
        <button className="btn btn-secondary" onClick={() => setShowBuy(true)}>Buy Shares</button>
      </div>

      <div className="flex gap-2 items-center">
        <input className="input input-bordered" placeholder="App Address" value={appAddr} onChange={(e) => setAppAddr(e.target.value)} />
        <input className="input input-bordered" placeholder="Price (µAlgos)" value={priceMicroAlgos} onChange={(e) => setPriceMicroAlgos(e.target.value)} />
        <button
          className="btn"
          onClick={async () => {
            if (!activeAddress) return
            try {
              const res = await preparePay.mutate({ buyerAddr: activeAddress, appAddr, priceMicroAlgos } as any)
              const unsignedTxn = decodeBase64Txn(res.txn)
              const stxns = await signTransactions!([unsignedTxn])
              const signed = (Array.isArray(stxns) ? stxns[0] : stxns) as Uint8Array
              const algorand = AlgorandClient.fromConfig({ algodConfig })
              const sendRes = await algorand.client.algod.sendRawTransaction(signed as Uint8Array).do()
              enqueueSnackbar(`Payment sent: ${sendRes.txid}`, { variant: 'success' })
            } catch (e: any) {
              enqueueSnackbar(e?.message || 'Payment failed', { variant: 'error' })
            }
          }}
        >
          Prepare Payment
        </button>
      </div>

      {deploy.data && (
        <div className="text-sm">App deployed: {deploy.data.appId} ({deploy.data.appAddress})</div>
      )}
      {listingQuery.data && (
        <pre className="text-xs bg-base-200 p-2 rounded">{JSON.stringify(listingQuery.data, null, 2)}</pre>
      )}

      {/* Buy Modal */}
      <dialog className={`modal ${showBuy ? 'modal-open' : ''}`}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Buy Plane Shares</h3>
          <div className="mt-3 flex flex-col gap-2">
            <div className="text-sm">Price per share: ${'{'}pricePerShareUsd.toFixed(2){'}'}</div>
            <div className="text-sm">Available shares: {availableShares}</div>
            <div className="text-sm">Your shares (local): {myShares}</div>
            <input
              className="input input-bordered"
              type="number"
              min={1}
              max={availableShares}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || '1'))}
            />
            <div className="text-sm">
              Total cost: ${'{'}(pricePerShareUsd * (isNaN(quantity) ? 0 : quantity)).toFixed(2){'}'}
            </div>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowBuy(false)}>Cancel</button>
            <button
              type="button"
              className={`btn btn-primary ${buyLoading ? 'btn-disabled' : ''}`}
              onClick={async (e) => {
                e.preventDefault()
                const qty = Math.max(1, quantity || 1)
                if (qty > availableShares) return enqueueSnackbar('Quantity exceeds available', { variant: 'warning' })
                const totalUsd = pricePerShareUsd * qty

                try {
                  setBuyLoading(true)
                  // Demo-only: check & deduct from fake wallet, update shares locally
                  if (fakeWalletUsd < totalUsd) {
                    enqueueSnackbar('Insufficient demo wallet funds', { variant: 'error' })
                    setBuyLoading(false)
                    return
                  }
                  setFakeWalletUsd((w) => w - totalUsd)
                  setAvailableShares((s) => s - qty)
                  setMyShares((s) => s + qty)
                  enqueueSnackbar(`Buy successful: purchased ${qty} share(s) for $${'{'}totalUsd.toFixed(2){'}'}`, { variant: 'success' })
                  setShowBuy(false)
                } catch (e: any) {
                  console.error('Buy failed', e)
                  enqueueSnackbar(e?.message || 'Buy failed', { variant: 'error' })
                }
                setBuyLoading(false)
              }}
            >
              {buyLoading ? 'Processing…' : 'Confirm Buy'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default PlaneActions


