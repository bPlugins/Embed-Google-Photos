<?php
/**
 * Plugin Name: Embed Google Photos
 * Description: Embed stunning Google Photos galleries directly into your WordPress site with the Google Photos Block plugin.
 * Version: 1.0.1
 * Author: Al Amin
 * Author URI: https://profiles.wordpress.org/alamincmt
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: embed-google-photos
 */

// ABS PATH
if (!defined('ABSPATH')) {exit;}

// Constant
if ('localhost' === $_SERVER['HTTP_HOST']) {
    $plugin_version = time();
} else {
    $plugin_version = '1.0.1';

}
define('BPGPB_PLUGIN_VERSION', $plugin_version);

// define('BPGPB_PLUGIN_VERSION', 'localhost' === $_SERVER['HTTP_HOST']  time() : '1.0.0');
define('BPGPB_ASSETS_DIR', plugin_dir_url(__FILE__) . 'assets/');

// Google Photos Block
class bpgpb_GooglePhotos
{
    public function __construct()
    {
        add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
        add_action('init', [$this, 'onInit']);
        add_action('admin_init', [$this, 'registerBPGPBSetting']);
        add_action('rest_api_init', [$this, 'registerBPGPBSetting']);
    }

    public function registerBPGPBSetting()
    {
        register_setting('bpgpb-google-photos', 'bpgpb-google-photos', array(
            'show_in_rest' => array(
                'name' => 'bpgpb-google-photos',
                'schema' => array(
                    'type' => 'string',
                ),
            ),
            'type' => 'string',
            'default' => '{}',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $token = $this->get_latest_token();
        // localize convert
        register_setting('ajax_info', 'ajax_info', array(
            'show_in_rest' => array(
                'name' => 'ajax_info',
                'schema' => array(
                    'type' => 'string',
                ),
            ),
            'type' => 'string',
            'default' => wp_json_encode(['nonce' => wp_create_nonce('wp_ajax'), 'token' => $token]),
            'sanitize_callback' => 'sanitize_text_field',
        ));
    }

    public function get_latest_token()
    {
        $token = json_decode(get_option('bpgpb-google-photos'), true);
        $is_not_expired = get_transient('bpgpb_expireTime');
        if (!$is_not_expired && isset($token['refresh_token']) && $token['refresh_token'] != '') {
            $response = wp_remote_get("https://api.bplugins.com/wp-json/google-photos/v1/refresh-token?refresh_token=" . $token['refresh_token'].'&time='.time());
            $new_token = json_decode(wp_remote_retrieve_body($response), true);
            if (isset($new_token['access_token'])) {
                $token['access_token'] = $new_token['access_token'];
                // update_option('bpgpb_accessToken', $token);
                update_option('bpgpb-google-photos', wp_json_encode($token));
                set_transient('bpgpb_expireTime', 3500, 3500);
            }
        }
        return $token;
    }


    public function enqueueBlockAssets()
    {
        wp_register_style('fancyapps', BPGPB_ASSETS_DIR . 'css/fancyapps.min.css', [], '5.0');

        wp_register_style('bpgpb-google-photos-style', plugins_url('dist/style.css', __FILE__), ['fancyapps'], BPGPB_PLUGIN_VERSION);

        wp_register_script('fancyapps', BPGPB_ASSETS_DIR . 'js/fancyapps.min.js', [], '5.0');
        wp_register_script('bpgpb-google-photos-script', plugins_url('dist/script.js', __FILE__), ['react', 'react-dom', 'fancyapps'], BPGPB_PLUGIN_VERSION);
    }

    public function onInit()
    {
        wp_register_style('bpgpb-block-directory-editor-style', plugins_url('dist/editor.css', __FILE__), ['wp-edit-blocks', 'bpgpb-google-photos-style'], BPGPB_PLUGIN_VERSION); // Backend Style

        register_block_type(__DIR__, [
            'editor_style' => 'bpgpb-block-directory-editor-style',
            'render_callback' => [$this, 'render'],
        ]); // Register Block

        wp_set_script_translations('BPGPB-block-directory-editor-script', 'embed-google-photos', plugin_dir_path(__FILE__) . 'languages'); // Translate
    }

    public function render($attributes)
    {
        extract($attributes);

        $className = $className ?? '';
        $BPGPBBlockClassName = 'wp-block-bpgpb-google-photos ' . $className . ' align' . $align;

        wp_enqueue_style('bpgpb-google-photos-style');
        wp_enqueue_script('bpgpb-google-photos-script');

        $token = $this->get_latest_token();

        ob_start();?>
		<div class='<?php echo esc_attr($BPGPBBlockClassName); ?>' id='BPGPBBlockDirectory-<?php echo esc_attr($cId) ?>' data-attributes='<?php echo esc_attr(wp_json_encode($attributes)); ?>' data-info='<?php echo esc_attr(wp_json_encode(['nonce' => wp_create_nonce('wp_ajax'), 'token' => $token])); ?>'></div>

		<?php return ob_get_clean();
    } // Render
}
new bpgpb_GooglePhotos();

require_once plugin_dir_path(__FILE__) . '/GoogleAPI/google-api.php';