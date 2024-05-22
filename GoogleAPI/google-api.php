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
        add_action('wp_ajax_bpgpb_retrieve_access_token', [$this, 'bpgpb_retrieve_access_token']);
        add_action('wp_ajax_bpgpb_get_access_token', [$this, 'get_access_token']);
        add_action('wp_ajax_nopriv_bpgpb_get_access_token', [$this, 'get_access_token']);
        add_action('wp_ajax_retrieve_refresh_token', [$this, 'retrieve_refresh_token']);
    }

    function retrieve_refresh_token(){

         if (!wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'wp_rest')) {
            wp_send_json_error('invalid request');
        }

        $save = sanitize_text_field($_POST['save']);

        $data = get_option('bpgpb_auth_info');
        if(!$save && $data){
            wp_send_json_success($data);
        }


        $client_id = sanitize_text_field($_POST['client_id']);
        $client_secret = sanitize_text_field($_POST['client_secret']);
        $refresh_token = sanitize_text_field($_POST['refresh_token']);

         $data = compact('client_id', 'client_secret', 'refresh_token');

        //  wp_send_json_success( [$data, $_POST] );

        if(!$client_id || !$client_secret || !$refresh_token){
            wp_send_json_error('data missing');
        }

        try {
            $data = compact('client_id', 'client_secret', 'refresh_token');

            $response = wp_remote_post('https://oauth2.googleapis.com/token', [
                'method' => 'POST',
                'body' => array(
                    "client_id" => $client_id,
                    "client_secret" => $client_secret,
                    "refresh_token" =>  $refresh_token,
                    "grant_type" => "refresh_token"
                ),
            ]);
        
            $response = json_decode(wp_remote_retrieve_body( $response ), true);

            $response['refresh_token'] = $refresh_token;

            update_option('bpgpb_auth_info', $data);
            update_option('bpgpb-google-photos', wp_json_encode($response));
            set_transient('bpgpb_expireTime', 3500, 3500);
            wp_send_json_success( $data );
        } catch (\Throwable $th) {
            throw $th;
        }
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
        set_transient('bpgpb_expireTime', 3500, 3500);
        wp_send_json_success($_POST);
    }

    public function bpgpb_retrieve_access_token(){

        if (!wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'wp_rest')) {
            wp_send_json_error('invalid request');
        }

        $token = json_decode(get_option('bpgpb-google-photos'), true);
        $is_valid = get_transient('bpgpb_expireTime');
        
        if($is_valid){
            wp_send_json_success($token);
        }

        if($token['refresh_token']){

            $response = wp_remote_get("https://api.bplugins.com/wp-json/google-photos/v1/refresh-token?refresh_token=" . $token['refresh_token'].'&time='.time());
            $new_token = json_decode(wp_remote_retrieve_body($response));
            update_option('bbb_access_token', [time(), date('m'), $new_token]);
            $token['access_token'] = $new_token['access_token'];

            update_option('bpgpb-google-photos', wp_json_encode($token));
            set_transient('bpgpb_expireTime', 3500, 3500);
            wp_send_json_success([$token]);
        }

        wp_send_json_success([]);

    }

}
new GooglePhotosAPI();

