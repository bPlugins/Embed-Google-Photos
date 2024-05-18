<?php
// ABS PATH
if (!defined('ABSPATH')) {exit;}
class GooglePhotosAPI
{

    /**
     * Initialize the class
     */

    public function __construct()
    {
        add_action('wp_ajax_bpgpb_get_access_token', [$this, 'get_access_token']);
        add_action('wp_ajax_nopriv_bpgpb_get_access_token', [$this, 'get_access_token']);
    }

    public function get_access_token()
    {
        if (!wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'wp_ajax')) {
            wp_send_json_error('invalid request');
        }

        $is_un_authorizing = isset($_POST['un_authorize']) ? true : false;

        if ($is_un_authorizing) {
            $response = [];
        } else {
            $access_token = sanitize_text_field($_POST['access_token']);
            $refresh_token = sanitize_text_field($_POST['refresh_token']);

            if ($access_token) {
                $response = [
                    'access_token' => $access_token,
                    'refresh_token' => $refresh_token,
                ];
            } else {
                // wp_send_json_success($_POST);
                $state = sanitize_text_field($_POST['state']) ?? '';

                $response = wp_remote_get("https://api.bplugins.com/wp-json/google-photos/v1/get-token?state=$state");
                $response = json_decode(wp_remote_retrieve_body($response));
            }
        }

        update_option('bpgpb-google-photos', wp_json_encode($response));
        set_transient('bpgpb_expireTime', 3500);
        wp_send_json_success($response);
    }

}
new GooglePhotosAPI();
