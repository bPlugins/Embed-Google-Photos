import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, SelectControl, RangeControl, __experimentalUnitControl as UnitControl, __experimentalBoxControl as BoxControl, TextControl, ToggleControl } from '@wordpress/components';

import { produce } from 'immer';

// Settings Components
import { BDevice, BorderControl, ColorsControl, Label, Typography } from '../../Components';

import { tabController } from '../../Components/utils/functions';
import { emUnit, perUnit, pxUnit } from '../../Components/utils/options';
import { favoriteOpt, generalStyleTabs, layoutShowOpt, mediaTypeOpt, photosOpt, ratioOpt } from './utils/options';


const Settings = ({ attributes, setAttributes }) => {
	const { photosType, favorite, albumList, albumId, mediaType, columns, columnGap, rowGap, coverImage, imgBorder, loadMoreBtnTypo, loadMoreBtnColors, loadMoreBtnBorder, loadMoreBtnPadding, layoutShow, album } = attributes;
	const [device, setDevice] = useState('desktop');

	const { title, isTitle } = album;

	// List of Album 
	const categoriesOpt = albumList?.map((album) => {
		return { label: album.title, value: album.id }
	});

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Google Photos Type', 'embed-google-photos')} initialOpen={true}>
						<SelectControl label={__('Select Type', 'embed-google-photos')} labelPosition="side" value={photosType} options={[{ label: 'Select', value: '' }, ...photosOpt]} onChange={(val) => setAttributes({ photosType: val })} />

						{photosType === "albums" && <>

							{
								layoutShow === "albums" && <> <ToggleControl className='mt10' label={__('Title Show/Hide', 'embed-google-photos')} checked={isTitle} onChange={(val) => setAttributes({ album: { ...album, isTitle: val } })} />

									{isTitle && <TextControl className='mt10' label={__('Title', 'embed-google-photos')} value={title} onChange={(val) => setAttributes({ album: { ...album, title: val } })} />}
								</>
							}

							<SelectControl className='mt10' label={__('Album List', 'embed-google-photos')} labelPosition="side" value={layoutShow} options={layoutShowOpt} onChange={val => setAttributes({ layoutShow: val })} />

							<SelectControl className='mt10' label={__('Select Album', 'embed-google-photos')} labelPosition="side" value={albumId} options={[{ label: 'Select', value: '' }, ...categoriesOpt]} onChange={val => setAttributes({ albumId: val })} />
						</>}

						{photosType === 'photos' && <SelectControl className='mt10' label={__('Feature', 'embed-google-photos')} labelPosition='side' value={favorite} options={favoriteOpt} onChange={val => setAttributes({ favorite: val })} />}

						{photosType !== 'albums' && <SelectControl label={__('Media Type', 'embed-google-photos')} labelPosition='side' value={mediaType} options={mediaTypeOpt} onChange={val => setAttributes({ mediaType: val })} />}
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Image Aspect Ratio', 'embed-google-photos')} initialOpen={false}>
						<SelectControl className="mt15" label={__('Ratio', 'embed-google-photos')} labelPosition="side" value={coverImage?.ratio} options={ratioOpt} onChange={(val) => {
							setAttributes({ coverImage: { ...coverImage, ratio: val } })
						}} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Layout', 'embed-google-photos')} initialOpen={false}>
						<PanelRow>
							<Label mt='0'>{__('Columns:', 'b-testimonials')}</Label>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>

						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-testimonials')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(30), perUnit(3), emUnit(2)]} isResetValueOnUnitChange={true} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-testimonials')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(40), perUnit(3), emUnit(2.5)]} isResetValueOnUnitChange={true} />
					</PanelBody>
				</>}

				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Image', 'embed-google-photos')} initialOpen={false}>
						<BorderControl className='' label={__('Border', 'b-testimonials')} value={imgBorder}
							onChange={(val) => setAttributes({ imgBorder: val })} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Load More Button', 'embed-google-photos')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'b-testimonials')} value={loadMoreBtnTypo} onChange={val => setAttributes({ loadMoreBtnTypo: val })} produce={produce} />

						<ColorsControl className='mt10 mb10' label={__('Colors', 'tiktok')} value={loadMoreBtnColors} onChange={val => setAttributes({ loadMoreBtnColors: val })} defaults={{ color: '#fff', bg: '#ff3b5c' }} />

						<BoxControl label={__('Padding', 'tiktok')} values={loadMoreBtnPadding} onChange={val => setAttributes({ loadMoreBtnPadding: val })} units={[pxUnit(3), emUnit(2)]} resetValues={{ top: 0, right: 0, bottom: 0, left: 0 }} />

						<BorderControl className='' label={__('Border', 'b-testimonials')} value={loadMoreBtnBorder}
							onChange={(val) => setAttributes({ loadMoreBtnBorder: val })} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;