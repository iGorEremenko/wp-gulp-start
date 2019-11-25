<?php

/****
 * use to example
 ****/

//$array_key_value = [
//    'type-post' => 'type-post name value str type', // duplicated in arguments when calling a function ($type_field)
//    'post-text' => 'post-text value str type',
//    'post-date' => 'post-date value str type',
//    'id-dept' => 'id-dept value int type',
//    'some-string' => 'some-string any value str type'
//];
//
//$check_key_name_field = ['post-text', 'post-date']; // Which keys above check for matches?


/****
 * CALL -> register_acf_create_check_arr_field('field_repeater_name', $array_key_value, $check_key_name_field, 'type-post', $post_id);
 ****/


function register_acf_create_check_arr_field($field_repeater_name, $array_key_value, $check_key_name_field, $type_field, $post_id)
{
    $array_key_value['id'] = strval(time() . generateRandomString($length = 15, 'any'));

    if (have_rows($field_repeater_name, $post_id)) {
        $fields_get_arr = get_field($field_repeater_name, $post_id);
        $status = false;
        $error = 'nothing';
        $has_type = false;
        foreach ($fields_get_arr as $item) {
            $temp = [];
            if ($type_field == $item['type-post']) {
                $has_type = true;
                for ($i = 0; $i < count($check_key_name_field); $i++) {
                    if ($item[$check_key_name_field[$i]] == $array_key_value[$check_key_name_field[$i]]) {
                        $temp[$i] = 1;
                    } else {
                        $temp[$i] = 0;
                    }
                }
                if (!in_array(0, $temp)) {
                    $status = false;
                    break;
                } else {
                    $status = true;
                }
            }
        }
        if (!$has_type) {
            add_row($field_repeater_name, $array_key_value, $post_id);
        }
    } else {
        $status = true;
        $error = 'update fields not found';
    }
    if ($status) {
        add_row($field_repeater_name, $array_key_value, $post_id);
        $error = 'update fields true';
    } else {
        $error = 'update fields false';
    }
    return $error;
}

