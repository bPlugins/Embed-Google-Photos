
import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, Button, __experimentalInputControl as InputControl } from '@wordpress/components';
const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;

import useWPOptionQuery from './hooks/useWPOptionQuery';
import useWPAjax from './utils/useWPAjax';
import { blockIcon } from './utils/icons';

const bpgpbEvent = new CustomEvent('bpgpbEventEdit');

const RenderPlugin = () => {

    const [bpgpbData, setbpgpbData] = useState({});
    const { client_id = '', client_secret = '', refresh_token = '' } = bpgpbData || {};

    // retrieve nonce and authorized if exists 
    const { fetchData: refetchSavedToken } = useWPOptionQuery('ajax_info');

    // fetch token from bplugins server using ajax
    const { data: token = null, isLoading, saveData } = useWPAjax('retrieve_refresh_token', { nonce: window.wpApiSettings?.nonce }); //authorize


    useEffect(() => {
        if (!isLoading && token) {
            setbpgpbData(token);
        }
    }, [isLoading])


    useEffect(() => {
        // will run when authorization window closed
        if (!isLoading && token) {
            window.dispatchEvent(bpgpbEvent);
            refetchSavedToken();
        }
    }, [isLoading]);

    const saveInformation = () => {
        saveData({ ...bpgpbData, save: true });

    }

    return <>
        <PluginSidebarMoreMenuItem target='bpgpb-google-photos'>{__('Google Photos Block', 'embed-google-photos')}</PluginSidebarMoreMenuItem>

        <PluginSidebar className='bPlPluginSidebar' name='bpgpb-google-photos' title={__('Google Photos', 'embed-google-photos')}>
            <PanelBody className='bPlPanelBody bpgpbPanelBody' title={__('Authorization', 'embed-google-photos')} initialOpen={true}>

                <div className='gpAuthorization mt15'>
                    <div className='bpgpbGetHelp'>
                        <InputControl label={__('Client ID', 'embed-google-photos')} labelPosition='top' value={client_id} onChange={(val) => setbpgpbData({ ...bpgpbData, client_id: val })} />
                        <a target='__blank' href='https://bplugins.com/docs/embed-google-photos/guides/'>{__('Help', 'embed-google-photos')}</a>
                    </div>

                    <InputControl label={__('Client Secret', 'embed-google-photos')} labelPosition='top' value={client_secret} onChange={(val) => setbpgpbData({ ...bpgpbData, client_secret: val })} />

                    <InputControl label={__('Refresh Token', 'embed-google-photos')} labelPosition='top' value={refresh_token} onChange={(val) => setbpgpbData({ ...bpgpbData, refresh_token: val })} />

                    <Button className="button button-secondary gpSignOut" onClick={saveInformation}>{__('Save Information')}</Button>

                </div>

            </PanelBody>
        </PluginSidebar>
    </>
};

registerPlugin('bpgpb-google-photos', {
    icon: blockIcon,
    render: RenderPlugin
});