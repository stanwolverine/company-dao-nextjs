import * as React from 'react';
import { ApiEndPoints } from '../../constants/api-end-points';

const useDeployNFTStates = () => {
	const [name, setName] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [nftImage, setNFTImage] = React.useState<null | File>(null);

	// @notice submits form with form data
	// @dev File class for file might be different on react-native
	const deployNFT = async () => {
		if (
			name.length > 0 &&
			description.length > 0 &&
			nftImage instanceof File
		) {
			const formData = new FormData();
			formData.append('nft_name', name);
			formData.append('nft_description', description);
			formData.append('nft_image', nftImage);

			fetch(ApiEndPoints.Nfts, {
				method: 'POST',
				body: formData,
				headers: {
					// 'Content-Type': 'multipart/form-data', // Multer will throw "Boundary not found" error if this header is set
					Accept: 'application/json',
				},
			})
				.then((res) => (res.ok ? res.json() : Promise.reject(res)))
				.then((data) => console.log(data))
				.catch((res) => console.error(res));
		} else {
			throw new Error('Check form fields');
		}
	};

	return {
		name,
		setName,
		description,
		setDescription,
		nftImage,
		setNFTImage,
		deployNFT,
	};
};

const DeployNFT: React.FC = () => {
	const {
		name,
		setName,
		description,
		setDescription,
		nftImage,
		setNFTImage,
		deployNFT,
	} = useDeployNFTStates();

	// Note: setName and setDescription should be called with new value (string type).
	// so, we can't use them directly in input onChange prop as it will pass event object instead of string.
	// You might also think that we can pass event object and get string value from that object.
	// Problem in this approach is this event object is different in React Native, so then we won't be able to use our hook in react native.

	// @notice handles nft name and description value change
	const handleInputValueChange: React.ChangeEventHandler<
		HTMLInputElement
	> = ({ target }) => {
		if (target.name === 'nft-name') {
			setName(target.value);
		} else if (target.name === 'nft-description') {
			setDescription(target.value);
		}
	};

	// @notice handles nft image selection
	const handleImageSelection: React.ChangeEventHandler<HTMLInputElement> = ({
		target,
	}) => {
		if (target.files instanceof FileList && target.files.length > 0) {
			setNFTImage(target.files[0]);
		} else if (nftImage !== null) {
			setNFTImage(null);
		}
	};

	// @notice handles form submit
	const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (
		event,
	) => {
		event.preventDefault();
		event.stopPropagation();

		deployNFT();
	};

	return (
		<section className='deploy-nft container mx-auto px-6'>
			<h1 className='h-16'>Deploy NFT</h1>

			<form
				onSubmit={handleFormSubmit}
				action=''
				method='post'
				className='w-4/6 self-center'
			>
				<div className='mb-6'>
					<label
						htmlFor='nft-name'
						className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
					>
						NFT Name
					</label>

					<input
						value={name}
						onChange={handleInputValueChange}
						type='text'
						id='nft-name'
						name='nft-name'
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						required
					/>
				</div>

				<div className='mb-6'>
					<label
						htmlFor='nft-description'
						className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
					>
						Description
					</label>
					<input
						type='text'
						value={description}
						onChange={handleInputValueChange}
						id='nft-description'
						name='nft-description'
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						required
					/>
				</div>

				<div className='mb-6'>
					<label
						className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
						htmlFor='nft-image'
					>
						Upload NFT file
					</label>
					<input
						id='nft-image'
						name='nft-image'
						type='file'
						onChange={handleImageSelection}
						className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-transparent focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
						required
					/>
				</div>

				<button
					type='submit'
					className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
				>
					Submit
				</button>
			</form>
		</section>
	);
};

export default DeployNFT;
