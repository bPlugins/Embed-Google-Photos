

import { useState, useEffect } from 'react';
import { getAlbumPhotos, getAllPhotos, getFavorite, getSingleAlbumDetails } from './utils/functions';
import { loadingIcon } from './utils/icons';
import Single from './Components/Single';

const Layout = ({ attributes, token }) => {

    const { cId, columns, photosType, albumList, albumId, mediaType, favorite, layoutShow, album } = attributes;
    const { desktop, tablet, mobile } = columns;
    const [photos, setPhotos] = useState([]);
    const [pageToken, setPageToken] = useState();
    const [{ loading }, setLoading] = useState(false);
    const [singlePage, setSinglePage] = useState(false);
    const [singleAlbumId, setSingleAlbumId] = useState();
    const [singleAlbumDetails, setSingleAlbumDetails] = useState();

    const { title, isTitle } = album;

    useEffect(() => {
        const getPhotos = async () => {

            if (token?.access_token) {
                if (photosType === 'photos') {
                    const photosData = await getAllPhotos(token?.access_token, null, favorite, mediaType, setLoading);
                    setPhotos(photosData?.data?.mediaItems);
                    setPageToken(photosData?.data?.nextPageToken);

                }
                else if (photosType === "favorite") {
                    const photosData = await getFavorite(token?.access_token, null, mediaType, setLoading);
                    setPhotos(photosData?.data?.mediaItems);
                    setPageToken(photosData?.data?.nextPageToken);
                }

                else if (photosType === "albums" && albumId) {
                    const photosData = await getAlbumPhotos(token?.access_token, albumId, null, setLoading);
                    setPhotos(photosData?.data?.mediaItems);
                    setPageToken(photosData?.data?.nextPageToken);
                }
            }
        }
        getPhotos();
    }, [photosType, token, albumId, mediaType, favorite]);

    useEffect(() => {
        Fancybox.bind(`[data-fancybox='bpgpb-gallery-${cId}']`, {
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

    const PageToken = async () => {

        if (photosType === 'photos') {
            const photosData = await getAllPhotos(token?.access_token, pageToken, favorite, mediaType, setLoading);
            setPhotos([...photos, ...photosData?.data?.mediaItems]);
            setPageToken(photosData?.data?.nextPageToken);
        }

        else if (photosType === 'favorite') {
            const photosData = await getFavorite(token?.access_token, pageToken, mediaType, setLoading);
            setPhotos([...photos, ...photosData?.data?.mediaItems]);
            setPageToken(photosData?.data?.nextPageToken);
        }

        else if (photosType === 'albums') {
            const photosData = await getAlbumPhotos(token?.access_token, albumId, pageToken, setLoading);
            setPhotos([...photos, ...photosData?.data?.mediaItems]);
            setPageToken(photosData?.data?.nextPageToken);
        }
    }

    if (!photos?.length && !loading) {
        return <h2>Photos Not Found</h2>
    }

    if (loading) {
        return <div className='loadingIcon'>{loadingIcon}</div>
    }

    // console.log(albumList);
    const clickFetchAlbumData = async (token, albumId, pageToken = null, setLoading) => {
        const photosData = await getAlbumPhotos(token?.access_token, albumId, pageToken, setLoading);
        setPhotos(photosData?.data?.mediaItems);
        setPageToken(photosData?.data?.nextPageToken);
    }

    const details = async (albumId) => {
        const details = await getSingleAlbumDetails(token?.access_token, albumId);
        setSingleAlbumDetails(details?.data);
    }

    const onClickData = (id) => {
        setSingleAlbumId(id);
    }

    return <>
        {(layoutShow === "albums" && !singlePage) && <div className='albumMainArea'>
            {isTitle && <h2> {title}</h2>}
            <div className={`layoutSection columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
                {albumList?.map((album, index) => {
                    return <div key={index} className='singleAlbum'
                        onClick={() => {
                            clickFetchAlbumData(token, album?.id, null, setLoading);
                            onClickData(album?.id)
                            setSinglePage(true);
                            details(album?.id);
                        }}>
                        <div className='mainImage'>
                            <div className="img">
                                <img src={album?.coverPhotoBaseUrl} alt="" />
                            </div>
                        </div>
                        <div>
                            <h1 className='title'>{album?.title}</h1>
                            <h3 className='totalCount'>{album?.mediaItemsCount}</h3>
                        </div>
                    </div>
                })}
            </div>
        </div >}

        {/* single Component */}
        {singlePage && <Single attributes={attributes} token={token?.access_token} photos={photos} setPhotos={setPhotos} albumId={singleAlbumId} pageToken={pageToken} setPageToken={setPageToken} setSinglePage={setSinglePage} setLoading={setLoading} singleAlbumDetails={singleAlbumDetails} />}

        {
            layoutShow !== "albums" && <>
                <div className={`layoutSection columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
                    {photos?.map((photo, index) => {
                        const isVideo = photo?.mimeType.startsWith('video/');
                        const videoUrl = `${photo?.baseUrl}=dv`;

                        return <a data-fancybox={`bpgpb-gallery-${cId}`} key={index} className='imgArea' href={`${isVideo ? videoUrl : photo?.baseUrl}`} data-type={`${isVideo ? 'html5video' : ''}`}>
                            <div className='img'>
                                <img src={photo?.baseUrl} alt="" />
                            </div>
                        </a>
                    })}
                </div>
                {loading && <h1> Loading...... </h1>}
                {pageToken && <div className='btnArea'>
                    <button onClick={() => PageToken()} className='loadMoreBtn'>Load More</button>
                </div>}
            </>
        }
    </>
};

export default Layout;
