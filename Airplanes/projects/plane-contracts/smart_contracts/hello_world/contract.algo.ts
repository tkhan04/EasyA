import {
  Account,
  Contract,
  abimethod,
  arc4,
  BoxMap,
  Global,
  Txn,
  itxn,
  Asset,
  assert,
  type uint64,
  gtxn,
  Bytes,
} from '@algorandfoundation/algorand-typescript'


/**
 * PropertyStruct
 *
 * Represents all the details about a property that is listed for fractional ownership.
 * This struct is stored in a BoxMap, allowing efficient lookup and update by property asset ID.
 *
 * Fields:
 * - address: The physical address of the property (as a string)
 * - totalShares: Total number of shares created for this property
 * - availableShares: Number of shares still available for purchase
 * - pricePerShare: Price per share in microAlgos
 * - propertyAssetId: The Algorand asset ID representing this property
 */
class AirplainShare extends arc4.Struct<{
  address: arc4.Str //where to pick up from
  totalShares: arc4.UintN64 // shares
  availableShares: arc4.UintN64 //amount of shared you can buy
  pricePerShare: arc4.UintN64 //how much each share cost in algo
  privatePlaneID: arc4.UintN64 // a special id
}> {}


export default class FractionalPlaneOwnership extends Contract {


    public listedProperties = BoxMap<uint64, AirplainShare>({ keyPrefix: 'properties' })

    //create ASA 
    @abimethod()
  public createAirplaneListing(planeAddress: string, shares: uint64, pricePerShare: uint64): uint64 {
    // Create the property asset (Algorand Standard Asset, ASA) using an inner transaction
    const assetId = this.createAirplaneAsset(planeAddress, shares)

    // Create a struct with all property details
    const propertyStruct = new AirplainShare({
      address: new arc4.Str(planeAddress),
      totalShares: new arc4.UintN64(shares),
      availableShares: new arc4.UintN64(shares),
      pricePerShare: new arc4.UintN64(pricePerShare),
      privatePlaneID: new arc4.UintN64(assetId),
    })

    // Store the property struct in the BoxMap, keyed by property asset ID
    this.listedProperties(assetId).value = propertyStruct.copy()

    return assetId
  }

  @abimethod({ readonly: true })
  public getListing(assetId: uint64): AirplainShare {
    assert(this.listedProperties(assetId).exists, 'listing not found')
    const listing = this.listedProperties(assetId).value.copy()
    return listing
  }

   /**
   * Creates an Algorand Standard Asset (ASA) for the property and returns its asset ID.
   * This uses an inner transaction to create the asset. The contract (app account) will be the manager and reserve.
   *
   * @param airplaneAddress The physical address of the property (used as asset name)
   * @param shares Total number of shares to be created (asset total)
   * @returns The asset ID of the created ASA
   */
  private createAirplaneAsset(airplaneAddress: string, shares: uint64): uint64 {
    const txnResult = itxn
      .assetConfig({
        assetName: Bytes(airplaneAddress).slice(0, 32).toString(),
        unitName: 'PLANE',
        total: shares,
        decimals: 0,
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        fee: 0,
      })
      .submit()
    return txnResult.createdAsset.id
  }


  @abimethod({ readonly: true })
public getAlgoBalance(user: Account): uint64 {
  return user.balance
}







    


}
