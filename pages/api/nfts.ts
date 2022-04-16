import type { NextApiRequest, NextApiResponse } from 'next';
import { Blob, File, NFTStorage } from 'nft.storage';
import nc from 'next-connect';
import multer from 'multer';

//#region typescript types
interface APIError {
	code: number; // Unique identifier of error
	type: string; // Type of  error
	message: string; // short human readable info about error
	detail?: string; //
}

type APIErrorList = { errors: APIError[] };

type Data = any | APIErrorList;

interface NFTImageNextApiRequest extends NextApiRequest {
	files: {
		nft_image: Express.Multer.File[];
	};
}
//#endregion typescript types

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10485760, files: 1 },
	preservePath: false,
});

const apiRouter = nc<NextApiRequest, NextApiResponse<Data>>({
	onNoMatch(req, res) {
		res.status(405).json({
			errors: [
				{
					code: 1,
					type: 'UnhandledMethod',
					message: 'requested method is not supported',
				},
			],
		});
	},
	onError(error, req, res) {
		console.log(error);
		res.status(501).json({
			errors: [
				{
					code: 2,
					type: 'UNKNOWN_ERROR',
					message: 'Something Went Wrong',
					error,
				},
			],
		});
	},
});

apiRouter.use(upload.fields([{ name: 'nft_image', maxCount: 1 }]));

apiRouter.get(async (_req, res) => {
	try {
		const response = await fetch('https://api.nft.storage/', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
			},
		});

		const data = await response.json();

		res.status(200).json(data);
	} catch (error) {}
});

apiRouter.post(
	async (req: NFTImageNextApiRequest, res: NextApiResponse<Data>) => {
		const { nft_name, nft_description } = req.body;
		const { nft_image } = req.files;

		const nftImage =
			Array.isArray(nft_image) && nft_image.length > 0
				? nft_image[0]
				: null;

		const nftStorageClient = new NFTStorage({
			token: process.env.NFT_STORAGE_KEY,
		});

		console.log(nftImage);

		if (
			nft_name &&
			nft_name.length > 0 &&
			nft_description &&
			nft_description.length > 0 &&
			nftImage
		) {
			const nftMetadata = await nftStorageClient.store({
				name: nft_name,
				description: nft_description,
				image: new File(
					[new Blob([nftImage.buffer])],
					nftImage.originalname,
					{ type: nftImage.mimetype },
				),
			});

			console.log(nftMetadata);

			res.status(200).json(nftMetadata);
		} else {
			throw new Error('Check form fields');
		}
	},
);

export default apiRouter;

export const config = {
	api: {
		bodyParser: false,
	},
};
