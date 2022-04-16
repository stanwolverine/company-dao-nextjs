import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
	return (
		<section>
			<h1 className='text-3xl font-bold'>Hello</h1>

			<Link href={'/nfts/'}>NFTs</Link>
		</section>
	);
};

export default Home;
