
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import Layout from './Layout';

// Block Directory
document.addEventListener('DOMContentLoaded', () => {
	const googlePhotosAllEles = document.querySelectorAll('.wp-block-bpgpb-google-photos');
	googlePhotosAllEles.forEach(googlePhotosEle => {
		const attributes = JSON.parse(googlePhotosEle.dataset.attributes);
		const info = JSON.parse(googlePhotosEle.dataset.info);

		createRoot(googlePhotosEle).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
			<DirectoryRender attributes={attributes} token={info} />
		</>);

		googlePhotosEle?.removeAttribute('data-attributes');
	});
});

const DirectoryRender = ({ attributes, token }) => {
	const { photosType } = attributes;

	if (!token?.token?.access_token || !photosType) {
		return <></>
	}

	return <div className='BPGPBBlockDirectory'>
		<Layout attributes={attributes} token={token?.token} />
	</div>
}