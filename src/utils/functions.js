import axios from 'axios';

export const generateString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.trim();
}

export const ratioCheck = (val = "9:16") => {
    const [width, height] = val.split(':');
    const result = (parseInt(height) / parseInt(width)) * 100;
    return result;
}

export const getAlbumList = async (accessToken = '') => {
    const url = 'https://photoslibrary.googleapis.com/v1/albums';

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
    };

    try {
        const response = await axios.get(url, {
            headers
        })
        return response
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export const getFavorite = async (accessToken, pageToken, media, setLoading) => {
    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';

    const params = {
        // pageSize: 20,
        pageToken
    };

    const data = {
        filters: {
            featureFilter: {
                includedFeatures: ["FAVORITES"]
            },
            mediaTypeFilter: {
                mediaTypes: [media]
            }
        }
    };

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    try {
        setLoading(true);
        const response = await axios.post(url, data, {
            headers,
            params
        })
        setLoading(false);
        return response;
    } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        return false;
    }
}

export const getAllPhotos = async (accessToken, pageToken, favorite, media, setLoading) => {
    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    const params = {
        pageSize: 100,
        pageToken
    };

    const data = {
        filters: {
            featureFilter: {
                includedFeatures: [favorite]
            },
            mediaTypeFilter: {
                mediaTypes: [media]
            }
        }
    };

    try {
        setLoading(true);
        const response = await axios.post(url, data, {
            headers,
            params
        })
        setLoading(false);
        return response;
    } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        return false;
    }
}

export const getAlbumPhotos = async (token, albumId, pageToken, setLoading) => {

    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';

    const params = {
        albumId,
        pageSize: 10,
        pageToken
    };

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        setLoading(true);
        const response = await axios.post(url, {}, {
            headers,
            params
        })
        setLoading(false);
        return response;
    } catch (error) {
        setLoading(false);
        console.error('Error:', error);
        return false;
    }
}

export const getSingleAlbumDetails = async (token, albumId) => {
    const url = `https://photoslibrary.googleapis.com/v1/albums/${albumId}`;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(url, {
            headers // Pass headers directly here
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}


