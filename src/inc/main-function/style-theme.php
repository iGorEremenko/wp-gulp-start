<?php
/**
 *  (styles / scripts) on all pages
 * ---------------------------------------------------------------------------------------------------------------------
 */
function ajax_url_var_add()
{
    // I connect js variable with URL to admin ajax requestor
    wp_localize_script('my_custom.js', 'my_ajax',
        array(
            'url' => admin_url('admin-ajax.php')
        )
    );
}


add_action('wp_enqueue_scripts', function () {
    //----- connect the internal theme style -----
    wp_enqueue_style('style.css', get_template_directory_uri() . '/style.css', array(), time());
    wp_enqueue_style('main.css', get_template_directory_uri() . '/css/main.css', array(), time());

    //----- connect external styles from the internet without https:// -----
//    wp_enqueue_style('built.css', '//site.com/styles/built.css');

    //----- we connect scripts in head -----
//    wp_enqueue_script('main.head.js', get_template_directory_uri() . '/js/main.head.js', array(), time());

    //----- We connect external scripts from the Internet to the head without https:// -----
//    wp_enqueue_script('site.com.css', '//site.com/styles/site.com.css', array(), time());

    //----- Connect external scripts from the Internet to footer without https:// -----
//    wp_enqueue_script('site.com.css', '//site.com/styles/site.com.css', array(), time(), true);

    //----- we connect scripts in footer -----
    wp_enqueue_script('vendor.js', get_template_directory_uri() . '/js/vendor.js', array(), time(), true);
    wp_enqueue_script('my-custom.js', get_template_directory_uri() . '/js/my-custom.js', array(), time(), true);
    wp_enqueue_script('main.js', get_template_directory_uri() . '/js/main.js', array(), time(), true);

    ajax_url_var_add(); // I connect js variable with URL to admin ajax requestor
});

/**
 *  (styles / scripts) on wp-admin
 * ---------------------------------------------------------------------------------------------------------------------
 */
add_action('wp_enqueue_scripts', function () {

    wp_enqueue_script('my-custom-admin.js', get_template_directory_uri() . '/js/my-custom-admin.js', array(), time(), true);

    ajax_url_var_add(); // I connect js variable with URL to admin ajax requestor
});