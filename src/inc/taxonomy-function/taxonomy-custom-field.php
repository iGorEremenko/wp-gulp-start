<?php

/**
 * Additional fields for custom taxonomy 'custom_taxonomy' - also works for standard 'category';
 * ---------------------------------------------------------------------------------------------------------------------
 */

$taxname = 'category';

// Fields when adding taxonomy element
add_action("{$taxname}_add_form_fields", 'add_new_custom_fields');
// Fields when editing the taxonomy element
add_action("{$taxname}_edit_form_fields", 'edit_new_custom_fields');

// Preservation when adding taxonomy element
add_action("create_{$taxname}", 'save_custom_taxonomy_meta');
// Preservation when editing taxonomy element
add_action("edited_{$taxname}", 'save_custom_taxonomy_meta');

function edit_new_custom_fields( $term ) {
    ?>
    <tr class="form-field">
        <th scope="row" valign="top"><label>Заголовок</label></th>
        <td>
            <input type="text" name="extra[title]" value="<?php echo esc_attr( get_term_meta( $term->term_id, 'title', 1 ) ) ?>"><br />
            <span class="description">SEO заголовок (title)</span>
        </td>
    </tr>
    <tr class="form-field">
        <th scope="row" valign="top"><label>Описание</label></th>
        <td>
            <input type="text" name="extra[meta_description]" value="<?php echo esc_attr( get_term_meta( $term->term_id, 'meta_description', 1 ) ) ?>"><br />
            <span class="description">SEO описание (description)</span>
        </td>
    </tr>
    <tr class="form-field">
        <th scope="row" valign="top"><label>Ключевые слова</label></th>
        <td>
            <input type="text" name="extra[keywords]" value="<?php echo esc_attr( get_term_meta( $term->term_id, 'keywords', 1 ) ) ?>"><br />
            <span class="keywords">SEO ключевые слова (keywords)</span>
        </td>
    </tr>
    <?php
}

function add_new_custom_fields( $taxonomy_slug ){
    ?>
    <div class="form-field">
        <label for="tag-title">Заголовок</label>
        <input name="extra[title]" id="tag-title" type="text" value="" />
        <p>SEO заголовок (title)</p>
    </div>
    <div class="form-field">
        <label for="tag-description">Описание</label>
        <input name="extra[description]" id="tag-description" type="text" value="" />
        <p>SEO описание (description)</p>
    </div>
    <div class="form-field">
        <label for="tag-keywords">Ключевые слова</label>
        <input name="extra[keywords]" id="tag-keywords" type="text" value="" />
        <p>SEO ключевые слова (keywords)</p>
    </div>
    <?php
}

function save_custom_taxonomy_meta( $term_id ) {
    if ( ! isset($_POST['extra']) ) return;
    if ( ! current_user_can('edit_term', $term_id) ) return;
    if (
        ! wp_verify_nonce( $_POST['_wpnonce'], "update-tag_$term_id" ) && // wp_nonce_field( 'update-tag_' . $tag_ID );
        ! wp_verify_nonce( $_POST['_wpnonce_add-tag'], "add-tag" ) // wp_nonce_field('add-tag', '_wpnonce_add-tag');
    ) return;

    // Все ОК! Теперь, нужно сохранить/удалить данные
    $extra = wp_unslash($_POST['extra']);

    foreach( $extra as $key => $val ){
        // проверка ключа
        $_key = sanitize_key( $key );
        if( $_key !== $key ) wp_die( 'bad key'. esc_html($key) );

        // очистка
        if( $_key === 'tag_posts_shortcode_links' )
            $val = sanitize_textarea_field( strip_tags($val) );
        else
            $val = sanitize_text_field( $val );

        // сохранение
        if( ! $val )
            delete_term_meta( $term_id, $_key );
        else
            update_term_meta( $term_id, $_key, $val );
    }

    return $term_id;
}

/**
 *
 * You can get these metafields in a template or anywhere else using the function get_term_meta(). for Example ID term 10, then:
 *
 * get_term_meta( 10, 'title', 1 );
 * esc_attr( get_term_meta( get_queried_object()->term_id, 'txt_down_product_cat', 1 ) ); ----- Current
 *
 */
