import { useCallback, useMemo, useState } from 'react'

type Json = Record<string, unknown>

function useBackendBaseUrl() {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  return base.replace(/\/$/, '')
}

function usePost<TReq extends Json, TRes = any>(path: string) {
  const baseUrl = useBackendBaseUrl()
  const url = useMemo(() => `${baseUrl}${path}`, [baseUrl, path])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TRes | null>(null)

  const mutate = useCallback(async (body: TReq): Promise<TRes> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Request failed')
      setData(json)
      return json as TRes
    } catch (e: any) {
      setError(e?.message || 'Request failed')
      throw e
    } finally {
      setLoading(false)
    }
  }, [url])

  return { mutate, loading, error, data }
}

function useGet<TRes = any>(path: string) {
  const baseUrl = useBackendBaseUrl()
  const url = useMemo(() => `${baseUrl}${path}`, [baseUrl, path])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TRes | null>(null)

  const refetch = useCallback(async (): Promise<TRes> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Request failed')
      setData(json)
      return json as TRes
    } catch (e: any) {
      setError(e?.message || 'Request failed')
      throw e
    } finally {
      setLoading(false)
    }
  }, [url])

  return { refetch, loading, error, data }
}

export function useHealth() {
  return useGet<{ ok: boolean }>('/health')
}

export function useNetworkParams() {
  return useGet<any>('/network/params')
}

export function useDeployApp() {
  return usePost<{}, { appId: number; appAddress: string }>('/app/deploy')
}

export function useCreateListing() {
  type Req = { managerAddr: string; name: string; unitName?: string; total: number; decimals?: number }
  type Res = { txn: string }
  return usePost<Req, Res>('/listings')
}

export function useOptIn() {
  type Req = { accountAddr: string; assetId: number }
  type Res = { txn: string }
  return usePost<Req, Res>('/asa/optin')
}

export function usePreparePayment() {
  type Req = { buyerAddr: string; appAddr: string; priceMicroAlgos: string }
  type Res = { txn: string }
  return usePost<Req, Res>('/buy/prepare-payment')
}

export function useGetListing(assetId: number | string) {
  return useGet<any>(`/app/listing/${assetId}`)
}

export function decodeBase64Txn(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(b64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  }
  return Uint8Array.from(Buffer.from(b64, 'base64'))
}


