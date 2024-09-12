

import { useEffect } from 'react';
import { getAlbumPhotos } from '../utils/functions';
import { backArrow } from '../utils/icons';

const Single = ({ attributes, photos, setPhotos, token, albumId, pageToken, setPageToken, setSinglePage, setLoading, singleAlbumDetails }) => {
    const { cId, columns } = attributes;
    const { desktop, tablet, mobile } = columns;

    // PageToken 
    const PageToken = async () => {
        const photosData = await getAlbumPhotos(token, albumId, pageToken, setLoading);
        setPhotos([...photos, ...photosData?.data?.mediaItems]);
        setPageToken(photosData?.data?.nextPageToken);
    }

    // Fancyapps 
    useEffect(() => {
        Fancybox.bind(`[data-fancybox='image-gallery-${cId}']`, {
            Toolbar: {
                display: {
                    left: [],
                    middle: [],
                    right: ['slideshow', 'close'],
                }
            },
            Thumbs: false,
            contentClick: 'toggleZoom',
        });

    }, []);

    const { baseUrl, mimeType } = photos[0] || {};
    const isVideo = mimeType.startsWith('video/');
    const videoUrl = `${baseUrl}=dv`;

    return <>
        <div className='backArrow' onClick={() => setSinglePage(false)}>{backArrow}</div>

        <div className='bpgpbTopSection'>
            <a className='item' data-fancybox={`image-gallery-${cId}`} href={isVideo ? videoUrl : `${baseUrl}=w1600-h1200`} data-type={`${isVideo ? 'html5video' : ''}`}>
                <img className='topImg' src={baseUrl} alt="" />
            </a>
            <div className="albumDetails">
                <h2>{singleAlbumDetails?.title}</h2>
                <p>{singleAlbumDetails?.mediaItemsCount}</p>
            </div>
            <div style={{ display: 'none' }}>
                {photos.slice(1).map((photo, index) => {
                    const isVideo = photo?.mimeType.startsWith('video/');
                    const videoUrl = `${photo?.baseUrl}=dv`;
                    return <a key={index} data-fancybox={`image-gallery-${cId}`} href={isVideo ? videoUrl : `${photo?.baseUrl}=w1600-h1200`} data-type={`${isVideo ? 'html5video' : ''}`}>
                        <img src={photo?.baseUrl} />
                    </a>
                })}
            </div>
        </div>

        <div className={`layoutSection columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
            {photos?.map((photo, index) => {
                const isVideo = photo?.mimeType.startsWith('video/');
                const videoUrl = `${photo?.baseUrl}=dv`;

                return <a data-fancybox={`bpgpb-gallery-${cId}`} key={index} className='imgArea' href={isVideo ? videoUrl : `${photo?.baseUrl}=w1600-h1200`} data-type={`${isVideo ? 'html5video' : ''}`}>
                    <div className='img'>
                        <img src={photo?.baseUrl} alt="" />
                    </div>
                </a>
            })}
        </div>

        {pageToken && <div className='btnArea'>
            <button onClick={() => PageToken()} className='loadMoreBtn'>Load More</button>
        </div>}
    </>
}
export default Single;