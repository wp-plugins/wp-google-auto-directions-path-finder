<?php
 
/*
Plugin Name:  WP Google Auto Directions Path Finder
Plugin URI: http://www.luciaintelisano.it/wp-google-auto-directions-path-finder
Description: A plugin to get/find best route between two points with autodetection
Version: 1.1.0
Author: Lucia Intelisano
Author URI: http://www.luciaintelisano.it
*/

/*  Copyright 2015   WP Google Auto Directions Path Finder  (email : lucia.intelisano@gmail.com) */

  	// init plugin
	wgadpf_init();
	
	
	
	 
 	 
	/* Extract text inside two tags */
	function getRow3000($cnt, $tagStart, $tagEnd) {
		$start = 0;
		$end = strlen($cnt);
		if (!(strpos($cnt, $tagStart)===false)) {
			$start = strpos($cnt, $tagStart)+strlen($tagStart);
		}	
		if (!(strpos($cnt, $tagEnd)===false)) {
			$end = strpos($cnt, $tagEnd);
		}
		$row = substr($cnt, $start, $end-$start);	
		return $row;
	}
		
	/**
 		* Function for adding header style sheets and js
 	*/
	function wgadpf_theme_name_scripts() {	
	 
		wp_enqueue_style('default_style_wgadpf_1', plugins_url('css/stylemapwpgadpf.css', __FILE__), false, time());
		wp_enqueue_script( 'default_scripts_wgadpf_1', "https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places,geometry", array(), '', false );
		wp_enqueue_script( 'default_scripts_wgadpf_2', plugins_url('js/scriptmapwpgadpf.js', __FILE__), array(), time(), true );
	} 
		
		
	/**
 	* Function for adding a link on main menu of wp
 	*/	
	function wgadpf_plugin_setup_menu(){
       add_options_page('WP Google Auto Directions Path Finder', 'WP Google Auto Directions Path Finder', 'administrator', __FILE__, 'wgadpf_settings_page',plugins_url('/images/icon.png', __FILE__));
	}
	
	
	/**
 	* Function for init plugin
 	*/
	function wgadpf_init(){
		add_action( 'wp_enqueue_scripts', 'wgadpf_theme_name_scripts' ); 
	 	add_action('admin_menu', 'wgadpf_plugin_setup_menu');
	 	add_action( 'admin_init', 'wgadpf_register_mysettings' );   
	 	add_filter( 'the_content', 'wgadpf_my_the_post_action' );
		add_shortcode('wpgadpf', 'wgadpf_createMap');
		add_action('media_buttons', 'wgadpf_add_my_media_button');
	}	
		
		
	/**
 * Function for creation map
 */	
	function wgadpf_createMap($atts) {
			$atts = shortcode_atts( array(
				'title_start' => '',
				'title_end' => '',
				'start_address' => '',
				'end_address' => '' 
			), $atts, 'wgadpf' );			
			$dir = plugin_dir_path( __FILE__ );
			$cnt = file_get_contents($dir."template/map.html");
			$cnt = str_replace('{URL_PLUGIN}', plugin_dir_url( __FILE__ ),$cnt);
			$cnt = str_replace('{TITLE_START}',strip_tags($atts["title_start"]),$cnt);
			$cnt = str_replace('{TITLE_END}',strip_tags($atts["title_end"]),$cnt);
			$cnt = str_replace('{START_LOCATION}',strip_tags($atts["start_address"]),$cnt);
			$cnt = str_replace('{END_LOCATION}',ucwords(strtolower(strip_tags($atts["end_address"]))),$cnt);
 		 
			return $cnt;
	}

	
	 
	 
	 
	 
 

	/**
 * Function for register settings
 */
function wgadpf_register_mysettings() {
 
	register_setting( 'wgadpf-settings-group', 'wgadpf_view_on_cat' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_view_on_tag' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_default_title_start' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_default_title_end' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_end_location' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_start_html_tag' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_end_html_tag' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_title' );
	register_setting( 'wgadpf-settings-group', 'wgadpf_exclude_from_title' );
}

	/**
 * Function for view settings page 
 */
function wgadpf_settings_page() {
?>
<div class="wrap">
<h2>WP Google Auto Directions Path Finder</h2>

<form method="post" action="options.php">
    <?php 
    	settings_fields( 'wgadpf-settings-group' );  
    	do_settings_sections( 'wgadpf-settings-group' ); 
    ?>
    <table class="form-table">
       
        
         <tr valign="top">
        <th scope="row">Shortcode</th>
        <td>  [wpgadpf end_address="insert here destination address" title_start="insert here title for from place" title_end="insert here title for destination place" ]</td>
        </tr>
        <tr valign="top">
        <th scope="row">View on post of categories</th>
        <td><input type="text" name="wgadpf_view_on_cat" value="<?php echo esc_attr( get_option('wgadpf_view_on_cat') ); ?>" /> (es. cat1,cat2,...)</td>
        </tr>
        
        <tr valign="top">
        <th scope="row">View on post of tags</th>
        <td><input type="text" name="wgadpf_view_on_tag" value="<?php echo esc_attr( get_option('wgadpf_view_on_tag') ); ?>" /> (es. tag1,tag2,...)</td>
        </tr>
          <tr valign="top">
        <th scope="row">Default title for start position</th>
        <td><input type="text" name="wgadpf_default_title_start" value="<?php echo esc_attr( get_option('wgadpf_default_title_start') ); ?>" /></td>
        </tr>
           <tr valign="top">
        <th scope="row">Default title for end position</th>
        <td><input type="text" name="wgadpf_default_title_end" value="<?php echo esc_attr( get_option('wgadpf_default_title_end') ); ?>" /></td>
        </tr>
        
         <tr valign="top">
        <th scope="row">Default end location</th>
        <td><input type="text" name="wgadpf_end_location" value="<?php echo esc_attr( get_option('wgadpf_end_location') ); ?>" /></td>
        </tr>
        <tr valign="top">
        <th scope="row">Get location from html tag inside content</th>
        <td>start tag <input type="text" name="wgadpf_start_html_tag" value="<?php echo esc_attr( get_option('wgadpf_start_html_tag') ); ?>" />
        end tag <input type="text" name="wgadpf_end_html_tag" value="<?php echo esc_attr( get_option('wgadpf_end_html_tag') ); ?>" />
        
        </td>
        </tr>
        <tr valign="top">
        <th scope="row">Get location from title</th>
        <td><input type="checkbox" name="wgadpf_title" <?php checked( '1', get_option('wgadpf_title')) ; ?> value="1" /></td>
        </tr>
         <tr valign="top">
        <th scope="row">Exclude word from title</th>
        <td><input type="text" name="wgadpf_exclude_from_title" value="<?php echo esc_attr( get_option('wgadpf_exclude_from_title') ); ?>" /></td>
        </tr>
    </table>
    
    <?php submit_button(); ?>

</form>
</div>
<?php
}


	/**
 * Function for add map on post 
 */
function wgadpf_my_the_post_action( $content ) {
 if ( is_single() ) {
	$cats = strtolower(get_option('wgadpf_view_on_cat'));
	$attachok=0;
	if  ($cats!="") {
		 $arrCat = split(",",$cats);
		 $categories = get_the_category();
		 if($categories){
			foreach($categories as $category) {
					foreach($arrCat as $cat) {
						if (strtolower($category->name)==$cat) {
							$attachok=1;
					 	}
					}
			}
		}	
	}
	$tagnames = trim(strtolower(get_option('wgadpf_view_on_tag')));	 
	if ($tagnames!="") {
		 
		$posttags = get_the_tags();
		if ($posttags!="") {
 			 $arrTags = split(",",$tagnames);
		  foreach($posttags as $tagpost) {
	 			foreach($arrTags as $tagname) {
					if (trim(strtolower($tagpost->name))==$tagname) {
							$attachok=1;
					}	 
				}
		  }
		}
	}	
	if ($attachok==1) {
			global $post, $wp_query;
    		$post_id = $post->ID;
    		$atts = array();
    		$atts["title_start"] = strip_tags(get_option('wgadpf_default_title_start')); 
    		$atts["title_end"] = strip_tags(get_option('wgadpf_default_title_end')); 
    		$loc =  strip_tags(get_option('wgadpf_end_location'));
    		 
    			if ($loc=="") {
    			 
    				$start_html_tag =  get_option('wgadpf_start_html_tag');
    				$end_html_tag =  get_option('wgadpf_end_html_tag');
    				if ($start_html_tag!="") {
    					$loc = getRow3000($post->post_content, $start_html_tag, $end_html_tag); 
    				}  
    				
    				if ($loc=="" && get_option('wgadpf_title')==true) {
    				 		 $loc = strtolower($post->post_title);
    				}
    				$exclude = get_option('wgadpf_exclude_from_title');
    				$exclude = str_replace(" ",",",$exclude);
    				$arrD = split(",",$exclude);
    				foreach($arrD as $k => $w) {
    					$w = strtolower(trim($w));
    					$loc = str_replace($w,"",$loc);
    				}	 
    			}
    		
    	 
    		$loc = str_replace("+"," ",$loc);
    		$loc = str_replace("-",",",$loc);
    	 
 
    		$atts["end_address"] = $loc; 
			$cnt = wgadpf_createMap($atts);
			$content.=$cnt;
	}
}	
	return $content;
 

	 
    
}
 function wgadpf_add_my_media_button() {
    echo '<a href="javascript:wp.media.editor.insert(\'[wpgadpf end_address=&quot;&quot; title_start=&quot;&quot; title_end=&quot;&quot; ]\');" id="insert-my-media" class="button">Add directions map</a>';
}
 
 
?>
