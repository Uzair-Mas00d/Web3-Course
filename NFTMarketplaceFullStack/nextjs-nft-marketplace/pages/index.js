import NFTBox from "@/components/NFTBox";
import { useMoralis } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json"
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "@/constants/subgraphQueries";

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis() 
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

  const { loading, error, data, listedNfts } = useQuery(GET_ACTIVE_ITEMS)

  return (
    <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            console.log(nft)
                            const { price, nftAddress, tokenId, seller } =
                              nft
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
  );
}
