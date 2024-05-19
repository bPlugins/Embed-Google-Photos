

import { useEffect } from 'react';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Settings Components
import { Label } from '../../Components';
import { tabController } from '../../Components/utils/functions';

import Settings from './Settings';
import Style from './Style';
import { photosOpt } from './utils/options';
import Layout from './Layout';
import { getAlbumList } from './utils/functions';
import useWPOptionMutation from './hooks/useWPOptionMutation';
import useWPOptionQuery from './hooks/useWPOptionQuery';
import { loadingIcon } from './utils/icons';
import useWPAjax from './hooks/useWPAjax';
const bpgpbEvent = new CustomEvent('bpgpbEventEdit');

const Edit = (props) => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { photosType, albumId } = attributes;

	const { isLoading: loadingOnSet } = useWPOptionMutation('bpgpb-google-photos', { dataType: 'object' });
	// const { data: token = {}, fetchData, isLoading } = useWPOptionQuery('bpgpb-google-photos');
	const { isLoading, data: token, refetch: fetchData, error } = useWPAjax('bpgpb_retrieve_access_token', { nonce: window.wpApiSettings?.nonce })

	console.log({ token, error });

	useEffect(() => {
		clientId && setAttributes({ cId: clientId.substring(0, 10) });
	}, [clientId]);

	useEffect(() => tabController(), [isSelected]);

	useEffect(() => {
		window.addEventListener('bpgpbEventEdit', () => {
			fetchData();
		});

		// if (!isLoading) {
		// 	setMcbData(token);
		// }

	}, []);

	useEffect(() => {
		if (!loadingOnSet) {
			window.dispatchEvent(bpgpbEvent);
		}
	}, [loadingOnSet]);

	useEffect(() => {
		if (!loadingOnSet) {
			fetchData();
		}
	}, [loadingOnSet]);

	useEffect(() => {
		const getPhotos = async () => {

			if (token?.access_token) {
				if (!albumId) {
					const response = await getAlbumList(token?.access_token);
					setAttributes({ albumList: response?.data?.albums });
					setAttributes({ albumId: albumId || response?.data?.albums?.[0]['id'] });
				}
			}
		}
		getPhotos();
	}, [photosType, token]);

	if (isLoading) {
		return <div className='loadingIcon'>{loadingIcon} </div>
	}
	if (!token?.access_token) {
		return <div className='bpgpbSelectArea'>
			<h2>{__('Authorization and Access Token Required', 'embed-google-photos')}</h2>
			<button className='pbgpbTarget' onClick={() => {
				wp.data.dispatch('core/edit-post').openGeneralSidebar('bpgpb-google-photos/bpgpb-google-photos');
			}} >{__('Authorization', 'embed-google-photos')}</button>
		</div>
	}

	if (!photosType) {
		return <div className='bpgpbSelectArea'>
			<h2>{__('You must select photos type', 'embed-google-photos')}</h2>

			<Label className='mt0 label'>{__('Photo Type', 'embed-google-photos')}</Label>
			<SelectControl value={photosType} options={[{ label: 'Select', value: '' }, ...photosOpt]} onChange={(val) => setAttributes({ photosType: val })} />
		</div>
	}

	return (<>
		<Settings attributes={attributes} setAttributes={setAttributes} token={token} />
		<div className={className} id={`BPGPBBlockDirectory-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />
			<div className="BPGPBBlockDirectory">
				<Layout attributes={attributes} token={token} />
			</div>
		</div>
	</>
	);
};

export default Edit;
