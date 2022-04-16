import Link from 'next/link';
import * as React from 'react';

const Nfts = () => {
	const [nfts, setNfts] = React.useState<{ cid: string }[]>([]);

	React.useEffect(() => {
		fetch('http://localhost:3000/api/nfts', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})
			.then((res) => (res.ok ? res.json() : Promise.reject(res)))
			.then((data) => {
				console.log(data);
				setNfts(data.value);
			})
			.catch((res) => console.error(res));
	}, []);

	return (
		<section className='deploy-nft container mx-auto px-6'>
			<Link href={'/nfts/deploy/'} passHref>
				<button>Deploy New NFT</button>
			</Link>

			<h1 className='h-16'>Your NFTs</h1>

			{nfts.map((nft) => {
				return <div key={nft.cid}>{JSON.stringify(nft, null, 4)}</div>;
			})}
		</section>
	);
};

export default Nfts;
