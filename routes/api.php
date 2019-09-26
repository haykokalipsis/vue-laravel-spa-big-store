<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
 * Putting our route definitions in the routes/api.php file will tell Laravel they are API routes
 * so Laravel will prefix the routes with a /api in the URL to differentiate them from web-routes.
*/

//Adding the auth:api middleware ensures any calls to the routes in that group must be authenticated.

Route::post('login', 'UserController@login');
Route::post('register', 'UserController@register');
Route::get('/products', 'ProductController@index');
Route::post('/upload-file', 'ProductController@uploadFile');
Route::get('/products/{product}', 'ProductController@show');

Route::group(['middleware' => 'auth:api'], function(){
	Route::get('/users','UserController@index');
    Route::get('users/{user}','UserController@show');
    Route::patch('users/{user}','UserController@update');
    Route::get('users/{user}/orders','UserController@showOrders');
    Route::patch('products/{product}/units/add','ProductController@updateUnits');
    Route::patch('orders/{order}/deliver','OrderController@deliverOrder');
    Route::resource('/orders', 'OrderController');
    Route::resource('/products', 'ProductController')->except(['index','show']);
});
