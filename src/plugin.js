

import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
const { PanelBody, Button } = wp.components;
const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
import { generateString } from './utils/functions';
import gp_prompt from './utils/gp_prompt';

import useWPOptionQuery from './hooks/useWPOptionQuery';
import useWPAjax from './utils/useWPAjax';
import { blockIcon, googleIcon } from './utils/icons';

const bpgpbEvent = new CustomEvent('bpgpbEventEdit');

const RenderPlugin = () => {

    // retrieve nonce and authorized if exists 
    const { data: info, fetchData: refetchSavedToken } = useWPOptionQuery('ajax_info');

    // fetch token from bplugins server using ajax
    const { data: token = null, isLoading, refetch, saveData } = useWPAjax('bpgpb_get_access_token', {}, true); //authorize

    useEffect(() => {
        // will run when authorization window closed
        if (!isLoading && token) {
            window.dispatchEvent(bpgpbEvent);
            refetchSavedToken();
        }
    }, [isLoading]);


    // unauthorize google account
    const unAuthorized = () => {
        saveData({ nonce: info.nonce, un_authorize: true });
        setTimeout(() => {
            refetchSavedToken();
        }, 500);
    }
    // console.log({ token });
    return <>
        <PluginSidebarMoreMenuItem target='bpgpb-google-photos'>{__('Google Photos Block', 'embed-google-photos')}</PluginSidebarMoreMenuItem>

        <PluginSidebar className='bPlPluginSidebar' name='bpgpb-google-photos' title={__('Google Photos', 'embed-google-photos')}>
            <PanelBody className='bPlPanelBody bpgpbPanelBody' title={__('Authorization', 'embed-google-photos')} initialOpen={true}>

                <div className='gpAuthorization mt15'>
                    {info?.token?.access_token ? <Button onClick={unAuthorized} className="button button-secondary gpSignOut">{__('Sign Out', 'bpgpb-g-google-photos')}</Button> : <Button className='gpAuthBtn' onClick={async () => {
                        const state = generateString(15);
                        const url = `https://api.bplugins.com/google-photos-auth/?state=${state}`

                        gp_prompt(url, 670, 520, function () {
                            refetch({ nonce: info.nonce, state });
                        });
                    }} >{googleIcon} {__('Sign in with Google', 'bpgpb-g-google-photos')}</Button>}
                </div>
            </PanelBody>
        </PluginSidebar>
    </>
};

registerPlugin('bpgpb-google-photos', {
    icon: blockIcon,
    render: RenderPlugin
});